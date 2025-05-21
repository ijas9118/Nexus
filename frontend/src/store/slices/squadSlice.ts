import { SquadDetail } from "@/types/squad";
import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface SquadState {
  squadsByCategory: { [key: string]: SquadDetail[] };
}

const initialState: SquadState = {
  squadsByCategory: {},
};

const squadSlice = createSlice({
  name: "squads",
  initialState,
  reducers: {
    setSquadsByCategory: (
      state,
      action: PayloadAction<{ category: string; squads: SquadDetail[] }>,
    ) => {
      const { category, squads } = action.payload;
      state.squadsByCategory[category] = squads;
    },
  },
});

export const { setSquadsByCategory } = squadSlice.actions;
export default squadSlice.reducer;
