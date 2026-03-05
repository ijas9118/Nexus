import "./index.css";

import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { createRoot } from "react-dom/client";
import { Provider } from "react-redux";
import { PersistGate } from "redux-persist/integration/react";
import { Toaster } from "sonner";

import App from "./App.tsx";
import { SocketProvider } from "./context/SocketContext.tsx";
import store, { persistor } from "./store/store.ts";

const queryClient = new QueryClient();

createRoot(document.getElementById("root")!).render(
  <Provider store={store}>
    <PersistGate loading={null} persistor={persistor}>
      <SocketProvider>
        <QueryClientProvider client={queryClient}>
          <App />
          <Toaster richColors closeButton />
        </QueryClientProvider>
      </SocketProvider>
    </PersistGate>
  </Provider>,
);
