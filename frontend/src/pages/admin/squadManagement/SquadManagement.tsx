import { FC, useEffect, useState } from "react";
import { columns, Squad } from "./columns";
import { DataTable } from "./components/data-table";
import SquadService from "@/services/admin/squadService";

const SquadManagement: FC = () => {
  const [data, setData] = useState<Squad[]>([]);

  useEffect(() => {
    const fetchSquads = async () => {
      try {
        const squads = await SquadService.getAllSquads();
        
        setData(squads);
      } catch (error) {
        console.error("Error fetching users:", error);
      }
    };

    fetchSquads();
  }, []);

  const toggleSquadStatus = async (id: string) => {
    setData((prevData) =>
      prevData.map((squad) =>
        squad._id === id ? { ...squad, isActive: !squad.isActive } : squad
      )
    );

    try {
      await SquadService.toggleStatus(id);
    } catch (error) {
      console.error("Failed to update squad status:", error);

      setData((prevData) =>
        prevData.map((squad) =>
          squad._id === id ? { ...squad, isActive: !squad.isActive } : squad
        )
      );
    }
  };

  return (
    <div className="container mx-auto px-4 sm:px-8 md:px-10 xl:px-18 py-8">
      <DataTable columns={columns(toggleSquadStatus)} data={data} />
    </div>
  );
};

export default SquadManagement;
