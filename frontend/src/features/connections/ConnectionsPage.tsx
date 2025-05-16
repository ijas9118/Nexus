import { Suspense } from "react";
import ConnectionsLayout from "./components/connections-layout";
import ConnectionsLoading from "./components/connections-loading";

export default function ConnectionsPage() {
  return (
    <div className="container max-w-4xl mx-auto py-8 px-4">
      <h1 className="text-3xl font-bold tracking-tight mb-6">Your Network</h1>
      <Suspense fallback={<ConnectionsLoading />}>
        <ConnectionsLayout />
      </Suspense>
    </div>
  );
}
