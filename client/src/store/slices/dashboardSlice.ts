import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { DashboardState, DashboardData } from '../../types/dashboard';

const initialState: DashboardState = {
  data: null,
  isLoading: false,
  error: null,
  lastUpdated: null,
};

const dashboardSlice = createSlice({
  name: 'dashboard',
  initialState,
  reducers: {
    fetchDashboardStart: (state) => {
      state.isLoading = true;
      state.error = null;
    },
    fetchDashboardSuccess: (state, action: PayloadAction<DashboardData>) => {
      state.isLoading = false;
      state.data = action.payload;
      state.error = null;
      state.lastUpdated = new Date();
    },
    fetchDashboardFailure: (state, action: PayloadAction<string>) => {
      state.isLoading = false;
      state.error = action.payload;
    },
    updateMetrics: (state, action: PayloadAction<Partial<DashboardData>>) => {
      if (state.data) {
        state.data = { ...state.data, ...action.payload };
        state.lastUpdated = new Date();
      }
    },
    clearError: (state) => {
      state.error = null;
    },
    resetDashboard: (state) => {
      state.data = null;
      state.error = null;
      state.lastUpdated = null;
      state.isLoading = false;
    },
  },
});

export const {
  fetchDashboardStart,
  fetchDashboardSuccess,
  fetchDashboardFailure,
  updateMetrics,
  clearError,
  resetDashboard,
} = dashboardSlice.actions;

export default dashboardSlice.reducer;