import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import apiClient from '../../config/apiconfig';

// Mock data for initial development
const mockEvents = [
  {
    id: 1,
    title: "Tech Conference 2024",
    description: "The biggest tech conference of the year featuring industry leaders and cutting-edge innovations.",
    category: "Technology",
    date: "2024-03-15",
    time: "09:00",
    venue: "Convention Center, San Francisco",
    image: "https://images.pexels.com/photos/2774556/pexels-photo-2774556.jpeg",
    price: 299,
    organizer: {
      name: "TechEvents Inc",
      avatar: "https://images.pexels.com/photos/220453/pexels-photo-220453.jpeg"
    },
    tickets: [
      { type: "General", price: 299, available: 150 },
      { type: "VIP", price: 599, available: 50 },
      { type: "Student", price: 149, available: 100 }
    ],
    rating: 4.8,
    attendees: 1250,
    featured: true
  },
  {
    id: 2,
    title: "Summer Music Festival",
    description: "Three days of amazing music with top artists from around the world.",
    category: "Music",
    date: "2024-07-20",
    time: "18:00",
    venue: "Central Park, New York",
    image: "https://images.pexels.com/photos/1190298/pexels-photo-1190298.jpeg",
    price: 125,
    organizer: {
      name: "Music Events Co",
      avatar: "https://images.pexels.com/photos/415829/pexels-photo-415829.jpeg"
    },
    tickets: [
      { type: "General", price: 125, available: 500 },
      { type: "VIP", price: 350, available: 100 }
    ],
    rating: 4.9,
    attendees: 2500,
    featured: true
  },
  {
    id: 3,
    title: "Startup Pitch Night",
    description: "Watch innovative startups pitch their ideas to investors and industry experts.",
    category: "Business",
    date: "2024-02-28",
    time: "19:00",
    venue: "Innovation Hub, Austin",
    image: "https://images.pexels.com/photos/3184465/pexels-photo-3184465.jpeg",
    price: 45,
    organizer: {
      name: "Startup Network",
      avatar: "https://images.pexels.com/photos/1043471/pexels-photo-1043471.jpeg"
    },
    tickets: [
      { type: "General", price: 45, available: 200 }
    ],
    rating: 4.6,
    attendees: 180,
    featured: false
  }
];

export const fetchEvents = createAsyncThunk(
  'events/fetchEvents',
  async (filters = {}, { rejectWithValue }) => {
    try {
      // For now, return mock data
      // Later, replace with: const response = await apiClient.get('/events', { params: filters });
      return mockEvents;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to fetch events');
    }
  }
);

export const fetchEventById = createAsyncThunk(
  'events/fetchEventById',
  async (eventId, { rejectWithValue }) => {
    try {
      // For now, return mock data
      const event = mockEvents.find(e => e.id === parseInt(eventId));
      if (!event) throw new Error('Event not found');
      return event;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to fetch event');
    }
  }
);

const eventsSlice = createSlice({
  name: 'events',
  initialState: {
    events: [],
    featuredEvents: [],
    currentEvent: null,
    categories: ['All', 'Technology', 'Music', 'Business', 'Sports', 'Arts', 'Food', 'Health'],
    filters: {
      category: 'All',
      priceRange: [0, 1000],
      date: null,
      location: '',
      search: ''
    },
    isLoading: false,
    error: null,
  },
  reducers: {
    setFilters: (state, action) => {
      state.filters = { ...state.filters, ...action.payload };
    },
    clearCurrentEvent: (state) => {
      state.currentEvent = null;
    },
    setSearch: (state, action) => {
      state.filters.search = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchEvents.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchEvents.fulfilled, (state, action) => {
        state.isLoading = false;
        state.events = action.payload;
        state.featuredEvents = action.payload.filter(event => event.featured);
      })
      .addCase(fetchEvents.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      })
      .addCase(fetchEventById.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(fetchEventById.fulfilled, (state, action) => {
        state.isLoading = false;
        state.currentEvent = action.payload;
      })
      .addCase(fetchEventById.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      });
  },
});

export const { setFilters, clearCurrentEvent, setSearch } = eventsSlice.actions;
export default eventsSlice.reducer;