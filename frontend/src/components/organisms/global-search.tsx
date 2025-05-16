import { useState, useRef, useEffect } from "react";
import { Search, User, Users, FileText, Loader2 } from "lucide-react";
import { Input } from "@/components/atoms/input";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandItem,
  CommandList,
} from "./command";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/atoms/avatar";
import { useGlobalSearch } from "@/hooks/useGlobalSearch";
import { useDebounce } from "@/hooks/useDebounce";
import { useNavigate } from "react-router-dom";

interface SearchResultItem {
  id: string;
  type: "blog" | "squad" | "user";
  title: string;
  snippet?: string;
  image?: string;
  subtitle?: string;
}

export function GlobalSearch() {
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState("");
  const debouncedQuery = useDebounce(query, 300);
  const inputRef = useRef<HTMLInputElement>(null);
  const navigate = useNavigate();

  const { data, isLoading, error } = useGlobalSearch(debouncedQuery);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (inputRef.current && !inputRef.current.contains(e.target as Node)) {
        setOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Close dropdown if query is cleared
  useEffect(() => {
    if (debouncedQuery.trim() === "") {
      setOpen(false);
    }
  }, [debouncedQuery]);

  // Navigate to the appropriate page based on result type
  const handleSelect = (item: SearchResultItem) => {
    setOpen(false);
    setQuery("");

    switch (item.type) {
      case "blog":
        navigate(`/content/${item.id}`);
        break;
      case "squad":
        navigate(`/squad/${item.id}`);
        break;
      case "user":
        navigate(`/profile/${item.snippet}`);
        break;
    }
  };

  // Group results by type
  const blogs = data?.filter((item: SearchResultItem) => item.type === "blog");
  const squads = data?.filter(
    (item: SearchResultItem) => item.type === "squad",
  );
  const users = data?.filter((item: SearchResultItem) => item.type === "user");

  return (
    <div
      className="relative w-full sm:w-[250px] md:w-[300px] lg:w-[400px] max-w-full"
      ref={inputRef}
    >
      <div className="relative">
        <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
        <Input
          placeholder="Search blogs, squads, users..."
          className="pl-8 pr-4"
          value={query}
          onChange={(e) => {
            setQuery(e.target.value);
            if (e.target.value) setOpen(true);
          }}
          onFocus={() => query && setOpen(true)}
        />
      </div>

      {open && (
        <div className="absolute top-full z-50 mt-1 w-full rounded-md border bg-popover shadow-md">
          <Command className="rounded-lg border shadow-md">
            <CommandList>
              {isLoading && (
                <div className="flex items-center justify-center py-6">
                  <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
                </div>
              )}

              {error && (
                <div className="py-6 text-center text-sm text-muted-foreground">
                  Something went wrong. Please try again.
                </div>
              )}

              {!isLoading && !error && data?.length === 0 && query && (
                <CommandEmpty className="py-6 text-center text-sm">
                  No results found for "{query}"
                </CommandEmpty>
              )}

              {(blogs ?? []).length > 0 && (
                <CommandGroup heading="Blogs">
                  {(blogs ?? []).map((blog: SearchResultItem) => (
                    <CommandItem
                      key={blog.id}
                      onSelect={() => handleSelect(blog)}
                      className="flex items-start gap-2 py-3"
                    >
                      <FileText className="mt-0.5 h-4 w-4 shrink-0 text-muted-foreground" />
                      <div className="flex flex-col overflow-hidden">
                        <span className="font-medium truncate">
                          {blog.title}
                        </span>
                        {blog.snippet && (
                          <span
                            className="text-xs text-muted-foreground line-clamp-1"
                            dangerouslySetInnerHTML={{ __html: blog.snippet }}
                          />
                        )}
                      </div>
                    </CommandItem>
                  ))}
                </CommandGroup>
              )}

              {(squads ?? []).length > 0 && (
                <CommandGroup heading="Squads">
                  {(squads ?? []).map((squad: SearchResultItem) => (
                    <CommandItem
                      key={squad.id}
                      onSelect={() => handleSelect(squad)}
                      className="flex items-center gap-2 py-3"
                    >
                      <div className="shrink-0">
                        {squad.image ? (
                          <Avatar className="h-8 w-8">
                            <AvatarImage
                              src={squad.image || "/placeholder.svg"}
                              alt={squad.title}
                            />
                            <AvatarFallback>
                              <Users className="h-4 w-4" />
                            </AvatarFallback>
                          </Avatar>
                        ) : (
                          <div className="flex h-8 w-8 items-center justify-center rounded-full bg-muted">
                            <Users className="h-4 w-4 text-muted-foreground" />
                          </div>
                        )}
                      </div>
                      <div className="flex flex-col">
                        <span className="font-medium">{squad.title}</span>
                        {squad.subtitle && (
                          <span className="text-xs text-muted-foreground">
                            {squad.subtitle}
                          </span>
                        )}
                      </div>
                    </CommandItem>
                  ))}
                </CommandGroup>
              )}

              {(users ?? []).length > 0 && (
                <CommandGroup heading="Users">
                  {(users ?? []).map((user: SearchResultItem) => (
                    <CommandItem
                      key={user.id}
                      onSelect={() => handleSelect(user)}
                      className="flex items-center gap-2 py-3"
                    >
                      <div className="shrink-0">
                        {user.image ? (
                          <Avatar className="h-8 w-8">
                            <AvatarImage
                              src={user.image || "/placeholder.svg"}
                              alt={user.title}
                            />
                            <AvatarFallback>
                              <User className="h-4 w-4" />
                            </AvatarFallback>
                          </Avatar>
                        ) : (
                          <div className="flex h-8 w-8 items-center justify-center rounded-full bg-muted">
                            <User className="h-4 w-4 text-muted-foreground" />
                          </div>
                        )}
                      </div>
                      <div className="flex flex-col">
                        <span className="font-medium">{user.title}</span>
                        {user.snippet && (
                          <span className="text-xs text-muted-foreground">
                            {user.snippet}
                          </span>
                        )}
                      </div>
                    </CommandItem>
                  ))}
                </CommandGroup>
              )}
            </CommandList>
          </Command>
        </div>
      )}
    </div>
  );
}
