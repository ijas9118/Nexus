import { Input } from "@/components/atoms/input";
import ContentService from "@/services/user/contentService";
import { setBreadcrumbs } from "@/store/slices/breadcrumbSlice";
import { IHistoryItem } from "@/types/content";
import { Search } from "lucide-react";
import { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import HistoryCard from "./components/HistoryCard";

const History = () => {
  const dispatch = useDispatch();
  const [searchTerm, setSearchTerm] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [history, setHistory] = useState<IHistoryItem[]>([]);

  useEffect(() => {
    dispatch(
      setBreadcrumbs([
        { title: "Home", url: "/" },
        { title: "History", url: "" },
      ]),
    );

    const fetchHistory = async () => {
      try {
        const data = await ContentService.getHistory();
        console.log(data);
        setHistory(data);
      } catch (err: unknown) {
        if (err instanceof Error) {
          setError(err.message);
        } else {
          setError("An unknown error occurred.");
        }
      }
    };

    fetchHistory();
  }, [dispatch]);

  return (
    <div className="container mx-auto max-w-3xl px-12 h-screen border-x-[1px] py-8 space-y-8">
      <div className="">
        <h1 className="text-2xl mb-4">Reading History</h1>
        <div className="relative">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            placeholder="Search history..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-9"
          />
        </div>
      </div>
      {error ? (
        <p className="text-center text-red-500">{error}</p>
      ) : history.length === 0 ? (
        <p className="text-center">No history available.</p>
      ) : (
        history
          .filter((item) =>
            item.title.toLowerCase().includes(searchTerm.toLowerCase()),
          )
          .map((item) => (
            <HistoryCard
              key={item.contentId}
              item={item}
              setHistory={setHistory}
            />
          ))
      )}
    </div>
  );
};

export default History;
