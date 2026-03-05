import type { PayloadAction } from "@reduxjs/toolkit";
import { createSlice } from "@reduxjs/toolkit";

import type { SquadDetail } from "@/types/squad";

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
