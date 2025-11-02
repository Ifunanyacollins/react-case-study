import React from "react";
import {
  render,
  screen,
  fireEvent,
  waitFor,
  within,
} from "@testing-library/react";
import { BrowserRouter as Router } from "react-router-dom";
import { BoardPage } from "../../pages/BoardPage";
import { ThemeProvider } from "../../context/ThemeContext";
import { UserProvider } from "../../context/UserContext";
import { PollingProvider } from "../../context/PollingContext";
import * as api from "../../utils/api";
import { useIssueStore } from "../../store/useIssueStore";

jest.mock("../../utils/api");
const mockedFetchIssues = api.mockFetchIssues as jest.Mock;

const MOCK_ISSUES = [
  {
    id: "1",
    title: "Test Issue 1",
    status: "Backlog",
    priority: "low",
    severity: 5,
    createdAt: "2025-11-01T10:00:00.000Z",
    assignee: "Admin User",
    tags: ["bug"],
  },
  {
    id: "2",
    title: "Test Issue 2",
    status: "In Progress",
    priority: "high",
    severity: 8,
    createdAt: "2025-11-02T10:00:00.000Z",
    assignee: "Dev User",
    tags: ["feature"],
  },
];

const renderBoardPage = () => {
  return render(
    <ThemeProvider>
      <PollingProvider>
        <UserProvider>
          <Router>
            <BoardPage />
          </Router>
        </UserProvider>
      </PollingProvider>
    </ThemeProvider>
  );
};

beforeEach(() => {
  useIssueStore.setState({
    issues: [],
    lastSync: null,
    isLoading: false,
    error: null,
    filters: {
      searchTerm: "",
      assignee: "all",
      priority: "all",
    },
    assignees: [],
    undoState: null,
  });
  mockedFetchIssues.mockClear();
});

describe("BoardPage User Flow", () => {
  test("should load, display, filter, and move issues with undo", async () => {
    // 1. Setup API Mock
    mockedFetchIssues.mockResolvedValue(MOCK_ISSUES);

    // 2. Render the Page
    renderBoardPage();

    // --- 3. THIS IS THE FIX ---
    // Wait for the loading text to appear (handles async 'act')
    expect(await screen.findByText(/Loading issues.../i)).toBeInTheDocument();

    // 4. Wait for data to appear (handles async 'act')
    const card1 = await screen.findByText("Test Issue 1");
    const card2 = await screen.findByText("Test Issue 2");
    expect(card1).toBeInTheDocument();
    expect(card2).toBeInTheDocument();

    // And verify loading state is gone
    expect(screen.queryByText(/Loading issues.../i)).not.toBeInTheDocument();
    // --- END FIX ---

    // 5. Test Filtering
    const searchInput = screen.getByPlaceholderText(/Title or tag.../i);
    fireEvent.change(searchInput, { target: { value: "feature" } });

    // Card 1 should disappear
    expect(screen.queryByText("Test Issue 1")).not.toBeInTheDocument();
    expect(screen.getByText("Test Issue 2")).toBeInTheDocument();

    // Clear filter
    fireEvent.change(searchInput, { target: { value: "" } });
    expect(screen.getByText("Test Issue 1")).toBeInTheDocument();

    // 6. Test Optimistic Update & Undo
    const moveButton = screen.getByRole("button", { name: /Start >/i });
    fireEvent.click(moveButton);

    // 7. Check that Undo bar appears (handles async 'act')
    const undoBar = await screen.findByText(
      /Moved "Test Issue 1..." to In Progress/i
    );
    expect(undoBar).toBeInTheDocument();

    // 8. Check that the card *optimistically* moved
    const inProgressColumn = screen.getByRole("region", {
      name: /In Progress/i,
    });
    expect(
      within(inProgressColumn).getByText("Test Issue 1")
    ).toBeInTheDocument();

    // 9. Click "Undo"
    const undoButton = screen.getByRole("button", { name: /Undo/i });
    fireEvent.click(undoButton);

    // 10. Check that Undo bar disappears (handles async 'act')
    await waitFor(() => {
      expect(
        screen.queryByText(/Moved "Test Issue 1..."/i)
      ).not.toBeInTheDocument();
    });

    // 11. Check that card moved *back*
    const backlogColumn = screen.getByRole("region", { name: /Backlog/i });
    expect(within(backlogColumn).getByText("Test Issue 1")).toBeInTheDocument();
  });
});
