import React from "react";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import UserRoutes from "./routes/UserRoutes";
import MentorRoutes from "./routes/MentorRoutes";
import AdminRoutes from "./routes/AdminRoutes";
import { ThemeProvider } from "./components/theme/theme-provider";
import NotFound from "./pages/NotFound";

const App: React.FC = () => {
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
