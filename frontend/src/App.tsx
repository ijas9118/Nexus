import React from "react";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import UserRoutes from "./routes/UserRoutes";
import MentorRoutes from "./routes/MentorRoutes";
import AdminRoutes from "./routes/AdminRoutes";
import { ThemeProvider } from "./components/theme-provider";

const App: React.FC = () => {
  return (
    <ThemeProvider defaultTheme="dark" storageKey="vite-ui-theme">
      <BrowserRouter>
        <Routes>
          <Route path="/*" element={<UserRoutes />} />
          <Route path="/mentor/*" element={<MentorRoutes />} />
          <Route path="/admin/*" element={<AdminRoutes />} />
        </Routes>
      </BrowserRouter>
    </ThemeProvider>
  );
};

export default App;
