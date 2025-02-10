// userSquadsSlice.ts
import { Squad } from "@/types/squad";
import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface UserSquadsState {
  squads: Squad[];
}

const initialState: UserSquadsState = {
  squads: [],
};

const userSquadsSlice = createSlice({
  name: "userSquads",
  initialState,
  reducers: {
    setUserSquads: (state, action: PayloadAction<Squad[]>) => {
      state.squads = action.payload;
    },
    addUserSquad: (state, action: PayloadAction<Squad>) => {
      state.squads.push(action.payload);
    },
  },
});

export const { setUserSquads, addUserSquad } = userSquadsSlice.actions;
export default userSquadsSlice.reducer;
