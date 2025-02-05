import CategoryScroll from "@/components/normal/squads/CategoryScroll";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Plus } from "lucide-react";
import { FC, useState } from "react";

const categories = [
  "Discover",
  "Featured",
  "Languages",
  "Web",
  "Mobile",
  "DevOps",
  "AI",
  "Games",
  "DevTools",
];

const squads = [
  {
    name: "Node.js developers",
    category: "Web",
    handle: "@nodejsdevelopers",
    members: "26.2K",
    logo: "/placeholder.svg",
    action: "View Squad",
  },
  {
    name: "PHP Dev",
    category: "Web",
    handle: "@phpdev",
    members: "15.6K",
    logo: "/placeholder.svg",
    action: "Join Squad",
  },
  {
    name: "Learn Python",
    category: "Languages",
    handle: "@lpython",
    members: "10.2K",
    logo: "/placeholder.svg",
    action: "Join Squad",
  },
  {
    name: "Rust Developers",
    category: "Languages",
    handle: "@rustdevs",
    members: "9.0K",
    logo: "/placeholder.svg",
    action: "Join Squad",
  },
  {
    name: "Angular",
    category: "Web",
    handle: "@angulardev",
    members: "7.1K",
    logo: "/placeholder.svg",
    action: "Join Squad",
  },
  {
    name: "Just Java",
    category: "Languages",
    handle: "@justjava",
    members: "5.6K",
    logo: "/placeholder.svg",
    action: "Join Squad",
  },
  {
    name: "Go Developers",
    category: "Languages",
    handle: "@golangnuts",
    members: "3.2K",
    logo: "/placeholder.svg",
    action: "Join Squad",
  },
  {
    name: "C/C++ Community",
    category: "Languages",
    handle: "@c_community",
    members: "2.4K",
    logo: "/placeholder.svg",
    action: "Join Squad",
  },
];

const Squads: FC = () => {
  const [selectedCategory, setSelectedCategory] = useState(categories[0]);

  return (
    <div className="container mx-auto px-4 sm:px-8 md:px-10 xl:px-24 py-8 space-y-8">
      <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container flex h-14 items-center">
          <CategoryScroll
            categories={categories}
            selectedCategory={selectedCategory}
            onCategorySelect={setSelectedCategory}
          />
          <div className="ml-auto flex items-center">
            <Button>
              <Plus className="mr-2 h-4 w-4" />
              New Squad
            </Button>
          </div>
        </div>
      </header>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3 ">
        <Card className="p-5">
          <div className="flex justify-between items-center pb-2">
            <img
              src="https://upload.wikimedia.org/wikipedia/commons/6/6a/JavaScript-logo.png"
              alt=""
              className="rounded-full h-14 w-14"
            />
            <Button variant="outline">View Squad</Button>
          </div>
          <h2 className="font-semibold text-xl">Learn JavaScript</h2>
          <p className="text-sm line-clamp-2 overflow-hidden text-ellipsis">
            Squad for those interested in learning JavaScript, and looking for interesting
            resources and materials.
          </p>

          <div className="pt-2 text-xs ">
            <p>@learn_javascript • 4.3K members</p>
          </div>
        </Card>
        <Card className="p-5">
          <div className="flex justify-between items-center pb-2">
            <img
              src="https://upload.wikimedia.org/wikipedia/commons/6/6a/JavaScript-logo.png"
              alt=""
              className="rounded-full h-14 w-14"
            />
            <Button variant="outline">View Squad</Button>
          </div>
          <h2 className="font-semibold text-xl">Learn JavaScript</h2>
          <p className="text-sm line-clamp-2 overflow-hidden text-ellipsis">
            Squad for those interested in learning JavaScript, and looking for interesting
            resources and materials.
          </p>

          <div className="pt-2 text-xs ">
            <p>@learn_javascript • 4.3K members</p>
          </div>
        </Card>
        <Card className="p-5">
          <div className="flex justify-between items-center pb-2">
            <img
              src="https://upload.wikimedia.org/wikipedia/commons/6/6a/JavaScript-logo.png"
              alt=""
              className="rounded-full h-14 w-14"
            />
            <Button variant="outline">View Squad</Button>
          </div>
          <h2 className="font-semibold text-xl">Learn JavaScript</h2>
          <p className="text-sm line-clamp-2 overflow-hidden text-ellipsis">
            Squad for those interested in learning JavaScript, and looking for interesting
            resources and materials.
          </p>

          <div className="pt-2 text-xs ">
            <p>@learn_javascript • 4.3K members</p>
          </div>
        </Card>
        <Card className="p-5">
          <div className="flex justify-between items-center pb-2">
            <img
              src="https://upload.wikimedia.org/wikipedia/commons/6/6a/JavaScript-logo.png"
              alt=""
              className="rounded-full h-14 w-14"
            />
            <Button variant="outline">View Squad</Button>
          </div>
          <h2 className="font-semibold text-xl">Learn JavaScript</h2>
          <p className="text-sm line-clamp-2 overflow-hidden text-ellipsis">
            Squad for those interested in learning JavaScript, and looking for interesting
            resources and materials.
          </p>

          <div className="pt-2 text-xs ">
            <p>@learn_javascript • 4.3K members</p>
          </div>
        </Card>
      </div>
    </div>
  );
};

export default Squads;
