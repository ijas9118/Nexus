import CategoryScroll from "@/components/normal/squads/CategoryScroll";
import { CreateSquadDialog } from "@/components/normal/squads/CreateSquadDialog";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { toast } from "@/hooks/use-toast";
import CategoryService from "@/services/admin/categoryService";
import SquadService from "@/services/user/squadService";
import { Category } from "@/types/category";
import { Squad } from "@/types/squad";
import { Plus } from "lucide-react";
import { FC, useEffect, useState } from "react";

const Squads: FC = () => {
  const [categories, setCategories] = useState<string[]>([]);
  const [selectedCategory, setSelectedCategory] = useState(categories[0]);
  const [squads, setSquads] = useState<Squad[]>([]);
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  useEffect(() => {
    const fetchCategory = async () => {
      try {
        const data = await CategoryService.getAllCategory();
        let categoryList = data.map((category: Category) => category.name);
        if (categoryList.length > 0) {
          setSelectedCategory(categoryList[0]);
        }
        setCategories(categoryList);
      } catch (error) {
        console.error("Error fetching categories:", error);
      }
    };

    fetchCategory();
  }, []);

  useEffect(() => {
    if (!selectedCategory) return;

    const fetchSquads = async () => {
      try {
        const squadsData = await SquadService.getSquadsByCategory(selectedCategory);
        setSquads(squadsData);
      } catch (error) {
        console.error("Error fetching squads:", error);
      }
    };

    fetchSquads();
  }, [selectedCategory]);

  const handleJoinSquad = async (squadId: string) => {
    try {
      await SquadService.joinSquad(squadId);

      toast({ description: "Successfully joined the squad!" });
    } catch (error) {
      console.error("Error joining squad:", error);
      toast({ description: "Failed to join squad!", variant: "destructive" });
    }
  };

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
            <Button onClick={() => setIsDialogOpen(true)}>
              <Plus className="mr-2 h-4 w-4" />
              New Squad
            </Button>
          </div>
        </div>
      </header>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3 ">
        {squads.map((squad) => (
          <Card key={squad._id} className="p-5">
            <div className="flex justify-between items-center pb-2">
              <img
                src={squad.logo || "/placeholder.svg"}
                alt={squad.name}
                className="rounded-full h-14 w-14"
              />
              <Button variant="outline" onClick={() => handleJoinSquad(squad._id)}>
                Join Squad
              </Button>
            </div>
            <h2 className="font-semibold text-xl">{squad.name}</h2>
            <p className="text-sm line-clamp-2 overflow-hidden text-ellipsis">
              {squad.description}
            </p>
            <div className="pt-2 text-xs">
              <p>
                {squad.handle} • {squad.membersCount} members
              </p>
            </div>
          </Card>
        ))}
      </div>
      <CreateSquadDialog
        open={isDialogOpen}
        onOpenChange={setIsDialogOpen}
        onSquadCreated={(newSquad: Squad) => setSquads((prev) => [newSquad, ...prev])}
      />
    </div>
  );
};

export default Squads;
