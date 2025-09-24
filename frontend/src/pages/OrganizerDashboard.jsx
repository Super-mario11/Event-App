import React, { useEffect, useState } from 'react';
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
  Download
} from 'lucide-react';
import { Link } from 'react-router-dom';
import axiosInstance from '../config/apiconfig';
import Loader from '../components/Loader';

const OrganizerDashboard = () => {
  const [activeTab, setActiveTab] = useState('overview');
  const [loading, setLoading] = useState(false);
  const[ myEvents,setMyEvents]= useState([])

  useEffect(() => {
    const fetchOrganizerEvents = async () => {
      try {
        setLoading(true);
        const { data } = await axiosInstance.get("/organizer/events");
        console.log("Backend response:", data);
        setMyEvents(data.data.events);
      }
      catch (err) {
        console.error("Error get event:", err);
      } finally {
        setLoading(false);
      }
    }

    fetchOrganizerEvents()
  }, []);



  // Mock organizer data
  const stats = [
    { label: 'Total Events', value: '12', change: '+2 this month', icon: Calendar, color: 'primary' },
    { label: 'Total Revenue', value: '$24,580', change: '+15% this month', icon: DollarSign, color: 'green' },
    { label: 'Tickets Sold', value: '1,247', change: '+8% this month', icon: Users, color: 'blue' },
    { label: 'Avg. Rating', value: '4.8', change: '+0.2 this month', icon: TrendingUp, color: 'accent' },
  ];

  const recentEvents = [
    {
      id: 1,
      title: "Tech Conference 2024",
      date: "2024-03-15",
      status: "Published",
      ticketsSold: 245,
      totalTickets: 300,
      revenue: 12250,
      image: "https://images.pexels.com/photos/2774556/pexels-photo-2774556.jpeg"
    },
    {
      id: 2,
      title: "Summer Music Festival",
      date: "2024-07-20",
      status: "Draft",
      ticketsSold: 0,
      totalTickets: 500,
      revenue: 0,
      image: "https://images.pexels.com/photos/1190298/pexels-photo-1190298.jpeg"
    }
  ];

  const tabs = [
    { id: 'overview', label: 'Overview' },
    { id: 'events', label: 'My Events' },
    { id: 'analytics', label: 'Analytics' },
    { id: 'settings', label: 'Settings' },
  ];

  if(loading){
    return (
      <Loader/>
    )
  }
  return (
    <div className="min-h-screen bg-gray-50 pt-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
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

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {stats.map((stat, index) => (
            <div key={index} className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
              <div className="flex items-center justify-between mb-4">
                <div className={`w-12 h-12 rounded-lg flex items-center justify-center ${
                  stat.color === 'primary' ? 'bg-primary-100 text-primary-600' :
                  stat.color === 'green' ? 'bg-green-100 text-green-600' :
                  stat.color === 'blue' ? 'bg-blue-100 text-blue-600' :
                  'bg-accent-100 text-accent-600'
                }`}>
                  <stat.icon className="w-6 h-6" />
                </div>
              </div>
              <div>
                <div className="text-2xl font-bold text-gray-900 mb-1">{stat.value}</div>
                <div className="text-sm text-gray-600 mb-2">{stat.label}</div>
                <div className="text-xs text-green-600 font-medium">{stat.change}</div>
              </div>
            </div>
          ))}
        </div>

        {/* Tabs */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-100">
          <div className="border-b border-gray-200">
            <nav className="flex space-x-8 px-6">
              {tabs.map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`py-4 border-b-2 font-medium text-sm transition-colors ${
                    activeTab === tab.id
                      ? 'border-primary-600 text-primary-600'
                      : 'border-transparent text-gray-500 hover:text-gray-700'
                  }`}
                >
                  {tab.label}
                </button>
              ))}
            </nav>
          </div>

          <div className="p-6">
            {activeTab === 'overview' && (
              <div className="space-y-8">
                {/* Quick Actions */}
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">Quick Actions</h3>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
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

                {/* Recent Activity */}
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">Recent Activity</h3>
                  <div className="space-y-3">
                    <div className="flex items-center space-x-3 p-4 bg-gray-50 rounded-lg">
                      <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                      <span className="text-gray-700">New booking for Tech Conference 2024</span>
                      <span className="text-sm text-gray-500 ml-auto">2 hours ago</span>
                    </div>
                    <div className="flex items-center space-x-3 p-4 bg-gray-50 rounded-lg">
                      <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                      <span className="text-gray-700">Event "Summer Music Festival" published</span>
                      <span className="text-sm text-gray-500 ml-auto">1 day ago</span>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'events' && (
              <div className="space-y-6">
                <div className="flex items-center justify-between">
                  <h3 className="text-lg font-semibold text-gray-900">My Events</h3>
                  <Link to="/create-event" className="btn-primary inline-flex items-center space-x-2">
                    <Plus className="w-4 h-4" />
                    <span>New Event</span>
                  </Link>
                </div>

                <div className="space-y-4">
                  {myEvents.map((event) => (
                    <div key={event.id} className="border border-gray-200 rounded-xl p-6">
                      <div className="flex flex-col lg:flex-row gap-6">
                        <img
                          src={event.images[0]}
                          alt={event.title}
                          className="w-full lg:w-48 h-32 object-cover rounded-lg"
                        />
                        
                        <div className="flex-1">
                          <div className="flex items-start justify-between mb-4">
                            <div>
                              <h4 className="text-xl font-semibold text-gray-900">{event.title}</h4>
                              <p className="text-gray-600">{event.date}</p>
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
                                {Math.round((event.ticketsSold / event.totalTickets) * 100)}%
                              </div>
                            </div>
                          </div>

                          <div className="flex flex-wrap gap-2">
                            <button className="flex items-center space-x-1 px-3 py-1 text-sm bg-gray-100 text-gray-700 rounded-md hover:bg-gray-200">
                              <Eye className="w-4 h-4" />
                              <span>View</span>
                            </button>
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
              </div>
            )}

            {activeTab === 'analytics' && (
              <div className="text-center py-12">
                <BarChart3 className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                <h3 className="text-xl font-semibold text-gray-900 mb-2">Analytics Dashboard</h3>
                <p className="text-gray-600">Detailed analytics and reports coming soon</p>
              </div>
            )}

            {activeTab === 'settings' && (
              <div className="text-center py-12">
                <Settings className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                <h3 className="text-xl font-semibold text-gray-900 mb-2">Account Settings</h3>
                <p className="text-gray-600">Manage your organizer profile and preferences</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default OrganizerDashboard;