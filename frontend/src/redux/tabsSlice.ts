import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface Tab {
  title: string;
  path: string;
}

interface TabsState {
  tabs: Tab[];
  activeTab: string;
}

const initialState: TabsState = {
  tabs: [],
  activeTab: '',
};

const tabsSlice = createSlice({
  name: 'tabs',
  initialState,
  reducers: {
    addTab: (state, action: PayloadAction<Tab>) => {
      const exists = state.tabs.find((tab) => tab.path === action.payload.path);
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
          state.activeTab = '';
        }
      }
    },
    setActiveTab: (state, action: PayloadAction<string>) => {
      state.activeTab = action.payload;
    },
    clearTabs: (state) => {
      state.tabs = [];
      state.activeTab = '';
    },
  },
});

export const { addTab, removeTab, setActiveTab, clearTabs } = tabsSlice.actions;
export default tabsSlice.reducer;
