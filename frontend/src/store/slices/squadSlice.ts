import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { Squad } from "@/types/squad";

interface SquadState {
  squadsByCategory: { [key: string]: Squad[] };
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
      action: PayloadAction<{ category: string; squads: Squad[] }>
    ) => {
      const { category, squads } = action.payload;
      state.squadsByCategory[category] = squads;
    },
  },
});

export const { setSquadsByCategory } = squadSlice.actions;
export default squadSlice.reducer;
