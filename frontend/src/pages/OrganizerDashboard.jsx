import React, { useEffect, useState } from "react";
import {
  BarChart3,
  Calendar,
  Users,
  DollarSign,
  Plus,
  TrendingUp,
  Eye,
  Edit,
  Settings,
  Download,
} from "lucide-react";
import { Link } from "react-router-dom";
import axiosInstance from "../config/apiconfig";
import Loader from "../components/Loader";
import EditProfile from "../components/EditProfile";
import AttendanceScanner from "../components/AttendanceScanner";

const OrganizerDashboard = () => {
  const [activeTab, setActiveTab] = useState("overview");
  const [loading, setLoading] = useState(false);
  const [myEvents, setMyEvents] = useState([]);
  const [bookings, setBookings] = useState([]);
  const [stats, setStats] = useState({});
  const [scannerEvent, setScannerEvent] = useState(null);

  useEffect(() => {
    const getDashboard = async () => {
      try {
        setLoading(true);
        const { data } = await axiosInstance.get("/organizer/dashboard");

        // Enrich events
        const enrichedEvents = data.data.recentEvents.map((event) => {
          const eventBookings = data.data.recentBookings.filter(
            (b) => b.eventId === event._id
          );
          const ticketsSold = eventBookings.reduce(
            (sum, b) => sum + (b.quantity || 0),
            0
          );
          const totalTickets = event.totalTickets || 100;
          const revenue = eventBookings.reduce(
            (sum, b) => sum + (b.totalPrice || 0),
            0
          );
          return {
            ...event,
            ticketsSold,
            totalTickets,
            revenue,
            status: event.status || "Draft",
          };
        });

        setMyEvents(enrichedEvents);
        setBookings(data.data.recentBookings);
        setStats(data.data.stats);
      } catch (err) {
        console.error("Error fetching dashboard:", err);
      } finally {
        setLoading(false);
      }
    };

    getDashboard();
  }, []);

  const statCards = [
    {
      label: "Total Events",
      value: stats.totalEvents || 0,
      icon: Calendar,
      color: "primary",
    },
    {
      label: "Total Revenue",
      value: `$${stats.totalRevenue || 0}`,
      icon: DollarSign,
      color: "green",
    },
    {
      label: "Tickets Sold",
      value: stats.ticketsSold || 0,
      icon: Users,
      color: "blue",
    },
    {
      label: "Avg. Rating",
      value: stats.avgRating || 0,
      icon: TrendingUp,
      color: "accent",
    },
  ];

  if (loading) return <Loader />;

  return (
    <div className="min-h-screen bg-gray-50 pt-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
 
        <div className="mb-8 flex flex-col lg:flex-row lg:items-center lg:justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">
              Organizer Dashboard
            </h1>
            <p className="text-gray-600">
              Manage your events and track performance
            </p>
          </div>
          <Link
            to="/create-event"
            className="btn-primary inline-flex items-center space-x-2 mt-4 lg:mt-0"
          >
            <Plus className="w-5 h-5" />
            <span>Create New Event</span>
          </Link>
        </div>
 
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {statCards.map((stat, i) => (
            <div
              key={i}
              className="bg-white rounded-xl p-6 shadow-sm border border-gray-100"
            >
              <div
                className={`w-12 h-12 rounded-lg flex items-center justify-center mb-4 ${
                  stat.color === "primary"
                    ? "bg-primary-100 text-primary-600"
                    : stat.color === "green"
                    ? "bg-green-100 text-green-600"
                    : stat.color === "blue"
                    ? "bg-blue-100 text-blue-600"
                    : "bg-accent-100 text-accent-600"
                }`}
              >
                <stat.icon className="w-6 h-6" />
              </div>
              <div className="text-2xl font-bold text-gray-900 mb-1">
                {stat.value}
              </div>
              <div className="text-sm text-gray-600">{stat.label}</div>
            </div>
          ))}
        </div>
 
        <div className="bg-white rounded-xl shadow-sm border border-gray-100">
          <div className="border-b border-gray-200">
            <nav className="flex space-x-8 px-6">
              {["overview", "events", "analytics", "settings"].map((tab) => (
                <button
                  key={tab}
                  onClick={() => setActiveTab(tab)}
                  className={`py-4 flex border-b-2 font-medium text-sm transition-colors ${
                    activeTab === tab
                      ? "border-primary-600 text-primary-600"
                      : "border-transparent text-gray-500 hover:text-gray-700"
                  }`}
                >
                  {tab === "settings" && (
                    <Settings className="w-5 h-5 mr-2 text-primary-600" />
                  )}
                  {tab.charAt(0).toUpperCase() + tab.slice(1)}
                </button>
              ))}
            </nav>
          </div>

          <div className="p-6"> 
            {activeTab === "overview" && (
              <div className="space-y-8">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
                  <Link
                    to="/create-event"
                    className="flex items-center space-x-3 p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
                  >
                    <Plus className="w-8 h-8 text-primary-600" />
                    <div>
                      <div className="font-medium text-gray-900">
                        Create Event
                      </div>
                      <div className="text-sm text-gray-600">
                        Start planning your next event
                      </div>
                    </div>
                  </Link>
                  <button className="flex items-center space-x-3 p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors">
                    <BarChart3 className="w-8 h-8 text-green-600" />
                    <div>
                      <div className="font-medium text-gray-900">
                        View Analytics
                      </div>
                      <div className="text-sm text-gray-600">
                        Check your performance
                      </div>
                    </div>
                  </button>
                  <button className="flex items-center space-x-3 p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors">
                    <Download className="w-8 h-8 text-blue-600" />
                    <div>
                      <div className="font-medium text-gray-900">
                        Export Data
                      </div>
                      <div className="text-sm text-gray-600">
                        Download reports
                      </div>
                    </div>
                  </button>
                </div>
              </div>
            )}
 
            {activeTab === "events" && (
              <div className="space-y-6">
                {myEvents.map((event) => (
                  <div
                    key={event._id}
                    className="border border-gray-200 rounded-xl p-6"
                  >
                    <div className="flex flex-col lg:flex-row gap-6">
                      <img
                        src={event?.images?.[0] || ""}
                        alt={event.title}
                        className="w-full lg:w-48 h-32 object-cover rounded-lg"
                      />
                      <div className="flex-1">
                        <div className="flex items-start justify-between mb-4">
                          <div>
                            <h4 className="text-xl font-semibold text-gray-900">
                              {event.title}
                            </h4>
                            <p className="text-gray-600">
                              {event.date?.slice(0, 10)}
                            </p>
                            <p className="text-gray-600">
                              {event.date?.slice(11, 16)}
                            </p>
                          </div>
                          <span
                            className={`px-3 py-1 rounded-full text-sm font-medium ${
                              event.status === "Published"
                                ? "bg-green-100 text-green-800"
                                : "bg-yellow-100 text-yellow-800"
                            }`}
                          >
                            {event.status}
                          </span>
                        </div>
 
                        <div className="grid grid-cols-2 lg:grid-cols-3 gap-4 mb-4">
                          <div>
                            <div className="text-sm text-gray-500">
                              Tickets Sold
                            </div>
                            <div className="font-semibold text-gray-900">
                              {event.ticketsSold}/{event.totalTickets}
                            </div>
                          </div>
                          <div>
                            <div className="text-sm text-gray-500">
                              Revenue
                            </div>
                            <div className="font-semibold text-gray-900">
                              ${event.revenue}
                            </div>
                          </div>
                          <div>
                            <div className="text-sm text-gray-500">
                              Completion
                            </div>
                            <div className="font-semibold text-gray-900">
                              {event.totalTickets > 0
                                ? Math.round(
                                    (event.ticketsSold / event.totalTickets) *
                                      100
                                  )
                                : 0}
                              %
                            </div>
                          </div>
                        </div>
 
                        <div className="flex flex-wrap gap-2">
                          <Link
                            to={`/event/${event._id}`}
                            className="flex items-center space-x-1 px-3 py-1 text-sm bg-gray-100 text-gray-700 rounded-md hover:bg-gray-200"
                          >
                            <Eye className="w-4 h-4" />
                            <span>View</span>
                          </Link>
                          <button className="flex items-center space-x-1 px-3 py-1 text-sm bg-gray-100 text-gray-700 rounded-md hover:bg-gray-200">
                            <Edit className="w-4 h-4" />
                            <span>Edit</span>
                          </button>
                          <button className="flex items-center space-x-1 px-3 py-1 text-sm bg-gray-100 text-gray-700 rounded-md hover:bg-gray-200">
                            <BarChart3 className="w-4 h-4" />
                            <span>Analytics</span>
                          </button> 
                          <button
                            onClick={() => setScannerEvent(event._id)}
                            className="flex items-center space-x-1 px-3 py-1 text-sm bg-blue-100 text-blue-700 rounded-md hover:bg-blue-200"
                          >
                            <Users className="w-4 h-4" />
                            <span>Take Attendance</span>
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
 
            {activeTab === "analytics" && (
              <div className="text-center py-12">
                <BarChart3 className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                <h3 className="text-xl font-semibold text-gray-900 mb-2">
                  Analytics Dashboard
                </h3>
                <p className="text-gray-600">
                  Detailed analytics and reports coming soon
                </p>
              </div>
            )}

           
            {activeTab === "settings" && <EditProfile />}
          </div>
        </div>
      </div>
 
      {scannerEvent && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <AttendanceScanner
            eventId={scannerEvent}
            onClose={() => setScannerEvent(null)}
          />
        </div>
      )}
    </div>
  );
};

export default OrganizerDashboard; 
  
 


{/* 
  last code 


  import React, { useEffect, useState } from 'react';
import { 
  BarChart3, Calendar, Users, DollarSign, Plus, TrendingUp,
  Eye, Edit, Settings, Download
} from 'lucide-react';
import { Link } from 'react-router-dom';
import axiosInstance from '../config/apiconfig';
import Loader from '../components/Loader';
import EditProfile from '../components/EditProfile';

const OrganizerDashboard = () => {
  const [activeTab, setActiveTab] = useState('overview');
  const [loading, setLoading] = useState(false);
  const [myEvents, setMyEvents] = useState([]);
  const [bookings, setBookings] = useState([]);
  const [stats, setStats] = useState({});

  useEffect(() => {
    const getDashboard = async () => {
      try {
        setLoading(true);
        const { data } = await axiosInstance.get("/organizer/dashboard");

        // Enrich recentEvents with ticketsSold, revenue, etc.
        const enrichedEvents = data.data.recentEvents.map((event) => {
          const eventBookings = data.data.recentBookings.filter(
            (b) => b.eventId === event._id
          );
          const ticketsSold = eventBookings.reduce((sum, b) => sum + (b.quantity || 0), 0);
          const totalTickets = event.totalTickets || 100; // fallback default
          const revenue = eventBookings.reduce((sum, b) => sum + (b.totalPrice || 0), 0);
          return {
            ...event,
            ticketsSold,
            totalTickets,
            revenue,
            status: event.status || "Draft",
          };
        });

        setMyEvents(enrichedEvents);
        setBookings(data.data.recentBookings);
        setStats(data.data.stats);
      } catch (err) {
        console.error("Error fetching dashboard:", err);
      } finally {
        setLoading(false);
      }
    };

    getDashboard();
  }, []);

  const statCards = [
    { label: 'Total Events', value: stats.totalEvents || 0, icon: Calendar, color: 'primary' },
    { label: 'Total Revenue', value: `$${stats.totalRevenue || 0}`, icon: DollarSign, color: 'green' },
    { label: 'Tickets Sold', value: stats.ticketsSold || 0, icon: Users, color: 'blue' },
    { label: 'Avg. Rating', value: stats.avgRating || 0, icon: TrendingUp, color: 'accent' },
  ];

  if (loading) return <Loader />;

  return (
    <div className="min-h-screen bg-gray-50 pt-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
 
        <div className="mb-8 flex flex-col lg:flex-row lg:items-center lg:justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">Organizer Dashboard</h1>
            <p className="text-gray-600">Manage your events and track performance</p>
          </div>
          <Link to="/create-event" className="btn-primary inline-flex items-center space-x-2 mt-4 lg:mt-0">
            <Plus className="w-5 h-5" />
            <span>Create New Event</span>
          </Link>
        </div>
 
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {statCards.map((stat, i) => (
            <div key={i} className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
              <div className={`w-12 h-12 rounded-lg flex items-center justify-center mb-4 ${
                  stat.color === 'primary' ? 'bg-primary-100 text-primary-600' :
                  stat.color === 'green' ? 'bg-green-100 text-green-600' :
                  stat.color === 'blue' ? 'bg-blue-100 text-blue-600' :
                  'bg-accent-100 text-accent-600'
              }`}>
                <stat.icon className="w-6 h-6" />
              </div>
              <div className="text-2xl font-bold text-gray-900 mb-1">{stat.value}</div>
              <div className="text-sm text-gray-600">{stat.label}</div>
            </div>
          ))}
        </div>
 
        <div className="bg-white rounded-xl shadow-sm border border-gray-100">
          <div className="border-b border-gray-200">
            <nav className="flex space-x-8 px-6">
              {['overview', 'events', 'analytics', 'settings'].map((tab) => (
               <>
             
                <button
                  key={tab}
                  onClick={() => setActiveTab(tab)}
                  className={`py-4 flex border-b-2 font-medium text-sm transition-colors ${
                    activeTab === tab
                      ? 'border-primary-600 text-primary-600'
                      : 'border-transparent text-gray-500 hover:text-gray-700'
                  }`}
                >
                    {tab==="settings" &&(
                            <Settings className="w-10 h-5 text-primary-600" />
               )}
                  {tab.charAt(0).toUpperCase() + tab.slice(1)}
                
                </button>
               </>
              ))}
            </nav>
          </div>

          <div className="p-6">
            {activeTab === 'overview' && (
              <div className="space-y-8">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
                  <Link to="/create-event" className="flex items-center space-x-3 p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors">
                    <Plus className="w-8 h-8 text-primary-600" />
                    <div>
                      <div className="font-medium text-gray-900">Create Event</div>
                      <div className="text-sm text-gray-600">Start planning your next event</div>
                    </div>
                  </Link>
                  <button className="flex items-center space-x-3 p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors">
                    <BarChart3 className="w-8 h-8 text-green-600" />
                    <div>
                      <div className="font-medium text-gray-900">View Analytics</div>
                      <div className="text-sm text-gray-600">Check your performance</div>
                    </div>
                  </button>
                  <button className="flex items-center space-x-3 p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors">
                    <Download className="w-8 h-8 text-blue-600" />
                    <div>
                      <div className="font-medium text-gray-900">Export Data</div>
                      <div className="text-sm text-gray-600">Download reports</div>
                    </div>
                  </button>
                </div>
              </div>
            )}

            {activeTab === 'events' && (
              <div className="space-y-6">
                {myEvents.map((event) => (
                  <div key={event._id} className="border border-gray-200 rounded-xl p-6">
                    <div className="flex flex-col lg:flex-row gap-6">
                      <img
                        src={event?.images?.[0] || ''}
                        alt={event.title}
                        className="w-full lg:w-48 h-32 object-cover rounded-lg"
                      />
                      <div className="flex-1">
                        <div className="flex items-start justify-between mb-4">
                          <div>
                            <h4 className="text-xl font-semibold text-gray-900">{event.title}</h4>
                            <p className="text-gray-600">{event.date?.slice(0,10)}</p>
                            <p className="text-gray-600">{event.date?.slice(11,16)}</p>
                          </div>
                          <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                              event.status === 'Published' 
                                ? 'bg-green-100 text-green-800' 
                                : 'bg-yellow-100 text-yellow-800'
                          }`}>
                            {event.status}
                          </span>
                        </div>
                        <div className="grid grid-cols-2 lg:grid-cols-3 gap-4 mb-4">
                          <div>
                            <div className="text-sm text-gray-500">Tickets Sold</div>
                            <div className="font-semibold text-gray-900">
                              {event.ticketsSold}/{event.totalTickets}
                            </div>
                          </div>
                          <div>
                            <div className="text-sm text-gray-500">Revenue</div>
                            <div className="font-semibold text-gray-900">${event.revenue}</div>
                          </div>
                          <div>
                            <div className="text-sm text-gray-500">Completion</div>
                            <div className="font-semibold text-gray-900">
                              {event.totalTickets > 0 
                                ? Math.round((event.ticketsSold / event.totalTickets) * 100)
                                : 0}%
                            </div>
                          </div>
                        </div>
                        <div className="flex flex-wrap gap-2">
                          <Link to={`/event/${event._id}`} className="flex items-center space-x-1 px-3 py-1 text-sm bg-gray-100 text-gray-700 rounded-md hover:bg-gray-200">
                            <Eye className="w-4 h-4" />
                            <span>View</span>
                          </Link>
                          <button className="flex items-center space-x-1 px-3 py-1 text-sm bg-gray-100 text-gray-700 rounded-md hover:bg-gray-200">
                            <Edit className="w-4 h-4" />
                            <span>Edit</span>
                          </button>
                          <button className="flex items-center space-x-1 px-3 py-1 text-sm bg-gray-100 text-gray-700 rounded-md hover:bg-gray-200">
                            <BarChart3 className="w-4 h-4" />
                            <span>Analytics</span>
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}

            {activeTab === 'analytics' && (
              <div className="text-center py-12">
                <BarChart3 className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                <h3 className="text-xl font-semibold text-gray-900 mb-2">Analytics Dashboard</h3>
                <p className="text-gray-600">Detailed analytics and reports coming soon</p>
              </div>
            )}

            {activeTab === 'settings' &&
            <>
            <EditProfile/>  
            </>
}
          </div>
        </div>
      </div>
    </div>
  );
};

export default OrganizerDashboard;
*/}




 