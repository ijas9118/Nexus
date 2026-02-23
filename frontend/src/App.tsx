import React, { useEffect, useState } from "react";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import UserRoutes from "./routes/UserRoutes";
import MentorRoutes from "./routes/MentorRoutes";
import AdminRoutes from "./routes/AdminRoutes";
import { ThemeProvider } from "./components/theme/theme-provider";
import store from "./store/store";
import { refreshAccessToken } from "./store/slices/authSlice";
import { ConfirmDialogProvider } from "./context/ConfirmDialogContext";

const App: React.FC = () => {
  const [isLoading, setIsLoading] = useState<boolean>(true);
  useEffect(() => {
    (async () => {
      const urlParams = new URLSearchParams(window.location.search);
      const isSocialSession = urlParams.get("session") === "active";

      if (localStorage.getItem("sessionActive") || isSocialSession) {
        await store.dispatch(refreshAccessToken());

        // Clear the query param if it exists to keep URL clean
        if (isSocialSession) {
          window.history.replaceState(
            {},
            document.title,
            window.location.pathname,
          );
        }
      }
      setIsLoading(false);
    })();
  }, []);

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="animate-spin rounded-full h-9 w-9 border-4 border-gray-200 border-t-blue-500"></div>
      </div>
    );
  }
  return (
    <ConfirmDialogProvider>
      <ThemeProvider defaultTheme="dark" storageKey="vite-ui-theme">
        <BrowserRouter>
          <Routes>
            <Route path="/*" element={<UserRoutes />} />
            <Route path="/mentor/*" element={<MentorRoutes />} />
            <Route path="/admin/*" element={<AdminRoutes />} />
          </Routes>
        </BrowserRouter>
      </ThemeProvider>
    </ConfirmDialogProvider>
  );
};

export default App;
