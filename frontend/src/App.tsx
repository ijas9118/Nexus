import React, { useEffect, useState } from "react";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import UserRoutes from "./routes/UserRoutes";
import MentorRoutes from "./routes/MentorRoutes";
import AdminRoutes from "./routes/AdminRoutes";
import { ThemeProvider } from "./components/theme/theme-provider";
import NotFound from "./pages/NotFound";
import store from "./store/store";
import { refreshAccessToken } from "./store/slices/authSlice";

const App: React.FC = () => {
  const [isLoading, setIsLoading] = useState<boolean>(true);
  useEffect(() => {
    (async () => {
      if (localStorage.getItem("sessionActive"))
        await store.dispatch(refreshAccessToken());
      setIsLoading(false);
    })();
  }, []);

  if (isLoading) {
    return (
      <div
        style={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          height: "100vh",
        }}
      >
        <div
          className="spinner"
          style={{
            border: "4px solid rgba(0, 0, 0, 0.1)",
            width: "36px",
            height: "36px",
            borderRadius: "50%",
            borderTopColor: "#3498db",
            animation: "spin 1s ease-in-out infinite",
          }}
        ></div>
        <style>
          {`
          @keyframes spin {
            to { transform: rotate(360deg); }
            }
            `}
        </style>
      </div>
    );
  }
  return (
    <ThemeProvider defaultTheme="dark" storageKey="vite-ui-theme">
      <BrowserRouter>
        <Routes>
          <Route path="/*" element={<UserRoutes />} />
          <Route path="/mentor/*" element={<MentorRoutes />} />
          <Route path="/admin/*" element={<AdminRoutes />} />

          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </ThemeProvider>
  );
};

export default App;
