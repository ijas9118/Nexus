import CategoryScroll from "@/components/normal/squads/CategoryScroll";
import { CreateSquadDialog } from "@/components/normal/squads/CreateSquadDialog";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import Premium from "@/components/ui/icons/Premium";
import { Skeleton } from "@/components/ui/skeleton";
import CategoryService from "@/services/admin/categoryService";
import SquadService from "@/services/user/squadService";
import { setSquadsByCategory } from "@/store/slices/squadSlice";
import { addUserSquad } from "@/store/slices/userSquadsSlice";
import { RootState } from "@/store/store";
import { Category } from "@/types/category";
import { Squad } from "@/types/squad";
import { Plus } from "lucide-react";
import { FC, useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";

const Squads: FC = () => {
  const dispatch = useDispatch();
  const { squadsByCategory } = useSelector((state: RootState) => state.squads);
  const { user } = useSelector((state: RootState) => state.auth);
  const [categories, setCategories] = useState<string[]>([]);
  const [selectedCategory, setSelectedCategory] = useState(categories[0]);
  const [squads, setSquads] = useState<Squad[]>([]);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [showAlert, setShowAlert] = useState(false);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchCategory = async () => {
      try {
        const data = await CategoryService.getAllCategory();
        const categoryList = data.map((category: Category) => category.name);
        if (categoryList.length > 0) {
          setSelectedCategory(categoryList[0]);
        } else {
          setLoading(false);
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
      setLoading(true);

      const cachedSquads = squadsByCategory[selectedCategory];
      if (cachedSquads) {
        setSquads(cachedSquads); // Use cached squads from Redux
        setLoading(false);
        return;
      }
      try {
        const squadsData =
          await SquadService.getSquadsByCategory(selectedCategory);
        console.log(squadsData);
        dispatch(
          setSquadsByCategory({
            category: selectedCategory,
            squads: squadsData,
          }),
        ); // Store squads in Redux
        setSquads(squadsData);
      } catch (error) {
        console.error("Error fetching squads:", error);
      }
      setLoading(false);
    };

    fetchSquads();
  }, [dispatch, selectedCategory, squadsByCategory, squads]);

  const handleJoinSquad = async (squad: Squad) => {
    if (squad.isPremium && !user?.isPremium) {
      toast.error("This squad is for premium members only. Upgrade to join!");
      return;
    }

    try {
      await SquadService.joinSquad(squad._id);

      dispatch(addUserSquad(squad));

      setSquads((prevSquads) =>
        prevSquads.map((s) =>
          s._id === squad._id ? { ...s, isJoined: true } : s,
        ),
      );
      toast.success("Successfully joined the squad!");
    } catch (error) {
      console.error("Error joining squad:", error);
      toast.error("Failed to join squad!");
    }
  };

  const handleViewSquad = async (squadId: string) => {
    console.log(squadId);
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
            <Button
              onClick={() => {
                if (user?.isPremium) setIsDialogOpen(true);
                else setShowAlert(true);
              }}
            >
              <Plus className="mr-2 h-4 w-4" />
              New Squad
            </Button>
          </div>
          <AlertDialog open={showAlert} onOpenChange={setShowAlert}>
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>
                  Unlock Squad Creation <Premium />
                </AlertDialogTitle>
                <AlertDialogDescription>
                  Only premium members can create squads. Upgrade now and start
                  building your own squad today!
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel>Close</AlertDialogCancel>
                <AlertDialogAction
                  onClick={() => {
                    navigate("/getPremium");
                  }}
                >
                  Upgrade to Premium
                </AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        </div>
      </header>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3 ">
        {loading ? (
          <>
            {[...Array(6)].map((_, index) => (
              <Card key={index} className="p-5">
                <div className="flex justify-between items-center pb-2">
                  <Skeleton className="rounded-full h-14 w-14" />
                  <Skeleton className="h-8 w-24 rounded" />
                </div>
                <Skeleton className="h-6 w-3/4 rounded" />
                <Skeleton className="h-8 w-full mt-2 rounded" />
                <Skeleton className="h-4 w-1/2 mt-2 rounded" />
              </Card>
            ))}
          </>
        ) : squads.length > 0 ? (
          squads.map((squad) => (
            <Card key={squad._id} className="p-5">
              <div className="flex justify-between items-center pb-2">
                <img
                  src={squad.logo || "/placeholder.svg"}
                  alt={squad.name}
                  className="rounded-full h-14 w-14"
                />
                {squad.isJoined ? (
                  <Button
                    variant="outline"
                    onClick={() => handleViewSquad(squad._id)}
                  >
                    View Squad
                  </Button>
                ) : (
                  <Button
                    variant="outline"
                    onClick={() => handleJoinSquad(squad)}
                  >
                    Join Squad
                  </Button>
                )}
              </div>
              <h2 className="font-semibold text-xl">{squad.name}</h2>
              <p className="text-sm line-clamp-2 overflow-hidden text-ellipsis">
                {squad.description}
              </p>
              <div className="pt-2 text-xs flex justify-between items-center">
                <p>
                  {squad.handle} • {squad.members.length} members
                </p>
                {squad.isPremium && <Premium />}
              </div>
            </Card>
          ))
        ) : (
          <div className="col-span-full flex flex-col items-center justify-center text-center py-10">
            <img src="/images/no-data.svg" alt="No squads" className="h-48" />
            <p className="text-lg font-semibold mt-4">
              No squads found in this category
            </p>
            <p className="text-sm">
              Be the first to create a squad and invite others to join!
            </p>
          </div>
        )}
      </div>
      <CreateSquadDialog
        open={isDialogOpen}
        onOpenChange={setIsDialogOpen}
        onSquadCreated={(newSquad: Squad) =>
          setSquads((prev) => [newSquad, ...prev])
        }
      />
    </div>
  );
};

export default Squads;
