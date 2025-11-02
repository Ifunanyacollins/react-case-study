import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { BrowserRouter as Router } from "react-router-dom";
import { BoardPage } from "../../pages/BoardPage";
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
    <PollingProvider>
      <UserProvider>
        <Router>
          <BoardPage />
        </Router>
      </UserProvider>
    </PollingProvider>
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
  test("should load, display, and filter issues", async () => {
    mockedFetchIssues.mockResolvedValue(MOCK_ISSUES);

    renderBoardPage();

    const card1 = await screen.findByText("Test Issue 1");
    const card2 = await screen.findByText("Test Issue 2");
    expect(card1).toBeInTheDocument();
    expect(card2).toBeInTheDocument();

    await waitFor(() => {
      expect(screen.queryByText(/Last Sync: Never/i)).not.toBeInTheDocument();
    });

    const searchInput = screen.getByPlaceholderText(/Title or tag.../i);
    fireEvent.change(searchInput, { target: { value: "feature" } });

    expect(screen.queryByText("Test Issue 1")).not.toBeInTheDocument();
    expect(screen.getByText("Test Issue 2")).toBeInTheDocument();

    fireEvent.change(searchInput, { target: { value: "" } });
    expect(screen.getByText("Test Issue 1")).toBeInTheDocument();
  });
});
