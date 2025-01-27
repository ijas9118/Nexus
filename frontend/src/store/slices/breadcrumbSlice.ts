import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface Breadcrumb {
  title: string;
  url: string;
}

interface BreadcrumbState {
  breadcrumbs: Breadcrumb[];
}

const initialState: BreadcrumbState = {
  breadcrumbs: [{ title: "Home", url: "/" }],
};

const breadcrumbSlice = createSlice({
  name: "breadcrumb",
  initialState,
  reducers: {
    setBreadcrumbs(state, action: PayloadAction<Breadcrumb[]>) {
      state.breadcrumbs = action.payload;
    },
  },
});

export default breadcrumbSlice.reducer;
export const { setBreadcrumbs } = breadcrumbSlice.actions;
