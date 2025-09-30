// Event-App/frontend/src/store/slices/uiSlice.js

import { createSlice } from '@reduxjs/toolkit';

const uiSlice = createSlice({
  name: 'ui',
  initialState: {
    isMobileMenuOpen: false,
    activeModal: null,
    toast: null,
    searchQuery: '',
    showLoginNotification: false, // New state for login pop-up
    notificationData: {          // New state for notification content
      newEvents: [],
      upcomingAlerts: []
    }
  },
  reducers: {
    toggleMobileMenu: (state) => {
      state.isMobileMenuOpen = !state.isMobileMenuOpen;
    },
    closeMobileMenu: (state) => {
      state.isMobileMenuOpen = false;
    },
    openModal: (state, action) => {
      state.activeModal = action.payload;
    },
    closeModal: (state) => {
      state.activeModal = null;
    },
    showToast: (state, action) => {
      state.toast = action.payload;
    },
    hideToast: (state) => {
      state.toast = null;
    },
    setSearchQuery: (state, action) => {
      state.searchQuery = action.payload;
    },
    setShowLoginNotification: (state, action) => {
        state.showLoginNotification = action.payload;
    },
    setNotificationData: (state, action) => {
        state.notificationData = action.payload;
    }
  },
});

export const { 
  toggleMobileMenu, 
  closeMobileMenu, 
  openModal, 
  closeModal, 
  showToast, 
  hideToast,
  setSearchQuery,
  setShowLoginNotification,
  setNotificationData 
} = uiSlice.actions;

export default uiSlice.reducer;