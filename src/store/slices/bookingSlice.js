import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import apiClient from '../../config/apiconfig';

export const createBooking = createAsyncThunk(
  'booking/create',
  async (bookingData, { rejectWithValue }) => {
    try {
      const response = await apiClient.post('/bookings', bookingData);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Booking failed');
    }
  }
);

const bookingSlice = createSlice({
  name: 'booking',
  initialState: {
    currentBooking: null,
    userBookings: [],
    selectedTickets: [],
    totalAmount: 0,
    isLoading: false,
    error: null,
  },
  reducers: {
    addTicket: (state, action) => {
      const existingTicket = state.selectedTickets.find(
        ticket => ticket.type === action.payload.type
      );
      
      if (existingTicket) {
        existingTicket.quantity += 1;
      } else {
        state.selectedTickets.push({ ...action.payload, quantity: 1 });
      }
      
      state.totalAmount = state.selectedTickets.reduce(
        (total, ticket) => total + (ticket.price * ticket.quantity), 0
      );
    },
    removeTicket: (state, action) => {
      const ticketIndex = state.selectedTickets.findIndex(
        ticket => ticket.type === action.payload.type
      );
      
      if (ticketIndex >= 0) {
        if (state.selectedTickets[ticketIndex].quantity > 1) {
          state.selectedTickets[ticketIndex].quantity -= 1;
        } else {
          state.selectedTickets.splice(ticketIndex, 1);
        }
      }
      
      state.totalAmount = state.selectedTickets.reduce(
        (total, ticket) => total + (ticket.price * ticket.quantity), 0
      );
    },
    clearBooking: (state) => {
      state.selectedTickets = [];
      state.totalAmount = 0;
      state.currentBooking = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(createBooking.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(createBooking.fulfilled, (state, action) => {
        state.isLoading = false;
        state.currentBooking = action.payload;
        state.selectedTickets = [];
        state.totalAmount = 0;
      })
      .addCase(createBooking.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      });
  },
});

export const { addTicket, removeTicket, clearBooking } = bookingSlice.actions;
export default bookingSlice.reducer;