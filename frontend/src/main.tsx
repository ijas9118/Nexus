import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App.tsx";
import { Provider } from "react-redux";
import store from "./store/store.ts";
import { Toaster } from "sonner";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { SocketProvider } from "./context/SocketContext.tsx";

const queryClient = new QueryClient();

createRoot(document.getElementById("root")!).render(
  <Provider store={store}>
    <SocketProvider>
      <QueryClientProvider client={queryClient}>
        <App />
        <Toaster richColors closeButton />
      </QueryClientProvider>
    </SocketProvider>
  </Provider>,
);
