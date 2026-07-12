import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface Tab {
  title: string;
  path: string;
  formData?: Record<string, any>;
  isFormOpen?: boolean;
}

interface TabsState {
  tabs: Tab[];
  activeTab: string;
  isTabLimited: boolean;
  maxTabLimit: number;
}

const initialState: TabsState = {
  tabs: [],
  activeTab: "",
  isTabLimited: false,
  maxTabLimit: 7,
};

const tabsSlice = createSlice({
  name: "tabs",
  initialState,
  reducers: {

    addTab: (state, action: PayloadAction<Tab>) => {
      const exists = state.tabs.find((tab) => tab.path === action.payload.path);
      if (!exists && state.tabs.length >= state.maxTabLimit) {
        state.isTabLimited = true;
        return;
      }
      state.isTabLimited = false;
      if (!exists) {
        state.tabs.push(action.payload);
      }
      state.activeTab = action.payload.path;
    },

    removeTab: (state, action: PayloadAction<string>) => {
      state.tabs = state.tabs.filter((tab) => tab.path !== action.payload);
      if (state.activeTab === action.payload) {
        if (state.tabs.length > 0) {
          state.activeTab = state.tabs[state.tabs.length - 1].path;
        } else {
          state.activeTab = "";
        }
      }
    },

    setActiveTab: (state, action: PayloadAction<string>) => {
      state.activeTab = action.payload;
    },

    clearTabs: (state) => {
      state.tabs = [];
      state.activeTab = "";
    },

    updateTabFormData: (
      state,
      action: PayloadAction<{ path: string; data: Record<string, any> }>,
    ) => {
      const tab = state.tabs.find((t) => t.path === action.payload.path);
      if (tab) {
        tab.formData = { ...tab.formData, ...action.payload.data };
      }
    },

    setTabFormOpen: (
      state,
      action: PayloadAction<{ path: string; isOpen: boolean }>,
    ) => {
      const tab = state.tabs.find((t) => t.path === action.payload.path);
      if (tab) {
        tab.isFormOpen = action.payload.isOpen;
        if (!action.payload.isOpen) {
          tab.formData = {};
        }
      }
    },

    clearTabFormData: (state, action: PayloadAction<string>) => {
      const tab = state.tabs.find((t) => t.path === action.payload);
      if (tab) {
        tab.formData = {};
        tab.isFormOpen = false;
      }
    },

    clearTabLimited: (state) => {
      state.isTabLimited = false;
    },

    setMaxTabLimit: (state, action: PayloadAction<number>) => {
      state.maxTabLimit = action.payload;
    },

  },
});

export const {
  addTab,
  removeTab,
  setActiveTab,
  clearTabs,
  clearTabFormData,
  setTabFormOpen,
  updateTabFormData,
  clearTabLimited,
  setMaxTabLimit,
} = tabsSlice.actions;
export default tabsSlice.reducer;
