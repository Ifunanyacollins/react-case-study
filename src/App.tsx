import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import { BoardPage } from "./pages/BoardPage";
import { IssueDetailPage } from "./pages/IssueDetailPage";
import { SettingsPage } from "./pages/SettingsPage";
import { Navigation } from "./components/Navigation";
import { UserProvider } from "./context/UserContext";
import { ThemeProvider } from "./context/ThemeContext";
import { PollingProvider } from "./context/PollingContext";

export const App = () => {
  return (
    <ThemeProvider>
      <PollingProvider>
        <UserProvider>
          <Router>
            <Navigation />
            <Routes>
              <Route path="/board" element={<BoardPage />} />
              <Route path="/issue/:id" element={<IssueDetailPage />} />
              <Route path="/settings" element={<SettingsPage />} />
              <Route path="*" element={<Navigate to="/board" />} />
            </Routes>
          </Router>
        </UserProvider>
      </PollingProvider>
    </ThemeProvider>
  );
};
