import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Navbar from './components/layout/Navbar';
import Footer from './components/layout/Footer';
import LandingPage from './pages/LandingPage';
import EventDiscovery from './pages/EventDiscovery';
import EventDetail from './pages/EventDetail';
import CreateEvent from './pages/CreateEvent';
import Checkout from './pages/Checkout';
import UserDashboard from './pages/UserDashboard';
import OrganizerDashboard from './pages/OrganizerDashboard';
import Login from './pages/Login';
import Register from './pages/Register';
import { useSelector } from 'react-redux';

function App() {
   const { user } = useSelector(state => state.auth);
  return (
    <Router>
      <div className="min-h-screen bg-gray-50 font-inter">
        <Navbar />
        <main>
          <Routes>
            <Route path="/" element={<LandingPage />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/events" element={<EventDiscovery />} />
            <Route path="/event/:id" element={<EventDetail />} />
            <Route path="/checkout/:eventId" element={<Checkout />} />

{user &&(
  <>
            <Route path="/create-event" element={<CreateEvent />} />
            <Route path="/dashboard" element={<UserDashboard />} />
            <Route path="/organizer-dashboard" element={<OrganizerDashboard />} />
            </>
          )}
          </Routes>
        </main>
        <Footer />
      </div>
    </Router>
  );
}

export default App;