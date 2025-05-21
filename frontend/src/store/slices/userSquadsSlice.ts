// userSquadsSlice.ts
import { SquadDetail } from "@/types/squad";
import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface UserSquadsState {
  squads: SquadDetail[];
}

const initialState: UserSquadsState = {
  squads: [],
};

const userSquadsSlice = createSlice({
  name: "userSquads",
  initialState,
  reducers: {
    setUserSquads: (state, action: PayloadAction<SquadDetail[]>) => {
      state.squads = action.payload;
    },
    addUserSquad: (state, action: PayloadAction<SquadDetail>) => {
      state.squads = [...state.squads, action.payload];
    },
    removeUserSquad: (state, action: PayloadAction<string>) => {
      state.squads = state.squads.filter(
        (squad) => squad._id !== action.payload,
      );
    },
  },
});

export const { setUserSquads, addUserSquad, removeUserSquad } =
  userSquadsSlice.actions;
export default userSquadsSlice.reducer;
