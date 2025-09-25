import React, { useState } from 'react';
import { Calendar, Ticket, Clock, MapPin, Download, Share2, Star } from 'lucide-react';
import { useEffect } from 'react';
import axiosInstance from '../config/apiconfig';

const UserDashboard = () => {
  const [activeTab, setActiveTab] = useState('upcoming');
  const [myBookings, setMyBookings] = useState([])
  // Mock user tickets data
  const mockTickets = [
    {
      id: 1,
      eventTitle: "Tech Conference 2024",
      eventDate: "2024-03-15",
      eventTime: "09:00",
      venue: "Convention Center, San Francisco",
      ticketType: "VIP",
      quantity: 2,
      totalPaid: 1198,
      bookingId: "BK123456789",
      status: "confirmed",
      qrCode: "QR_CODE_DATA",
      image: "https://images.pexels.com/photos/2774556/pexels-photo-2774556.jpeg"
    },
    {
      id: 2,
      eventTitle: "Summer Music Festival",
      eventDate: "2024-07-20",
      eventTime: "18:00",
      venue: "Central Park, New York",
      ticketType: "General",
      quantity: 1,
      totalPaid: 125,
      bookingId: "BK123456790",
      status: "confirmed",
      qrCode: "QR_CODE_DATA",
      image: "https://images.pexels.com/photos/1190298/pexels-photo-1190298.jpeg"
    }
  ];

  useEffect(() => {

    const getBookings = async () => {
      try {
        const { data } = await axiosInstance.get("/booking");
        console.log("Orders ", data?.bookings?.formatted);
        setMyBookings(data?.bookings?.formatted)
      } catch (error) {
        console.error("Error creating order:", error);
      }
    };
    getBookings()
  }, []);

  const tabs = [
    { id: 'upcoming', label: 'Upcoming Events', count: 2 },
    { id: 'past', label: 'Past Events', count: 5 },
    { id: 'cancelled', label: 'Cancelled', count: 0 },
  ];

  return (
    <div className="min-h-screen bg-gray-50 pt-8">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">My Dashboard</h1>
          <p className="text-gray-600">Manage your tickets and event bookings</p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
            <div className="flex items-center space-x-3">
              <div className="w-12 h-12 bg-primary-100 rounded-lg flex items-center justify-center">
                <Ticket className="w-6 h-6 text-primary-600" />
              </div>
              <div>
                <div className="text-2xl font-bold text-gray-900">7</div>
                <div className="text-gray-600">Total Bookings</div>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
            <div className="flex items-center space-x-3">
              <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
                <Calendar className="w-6 h-6 text-green-600" />
              </div>
              <div>
                <div className="text-2xl font-bold text-gray-900">2</div>
                <div className="text-gray-600">Upcoming Events</div>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
            <div className="flex items-center space-x-3">
              <div className="w-12 h-12 bg-accent-100 rounded-lg flex items-center justify-center">
                <Star className="w-6 h-6 text-accent-600" />
              </div>
              <div>
                <div className="text-2xl font-bold text-gray-900">4.8</div>
                <div className="text-gray-600">Avg. Rating</div>
              </div>
            </div>
          </div>
        </div>

        {/* Tabs */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-100">
          <div className="border-b border-gray-200">
            <nav className="flex space-x-8 px-6">
              {tabs.map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`py-4 border-b-2 font-medium text-sm transition-colors ${activeTab === tab.id
                      ? 'border-primary-600 text-primary-600'
                      : 'border-transparent text-gray-500 hover:text-gray-700'
                    }`}
                >
                  {tab.label} ({tab.count})
                </button>
              ))}
            </nav>
          </div>

          <div className="p-6">
            {activeTab === 'upcoming' && (
              <div className="space-y-6">
                {myBookings?.map((ticket) => (
                  <div key={ticket?.bookingId} className="border border-gray-200 rounded-xl p-6 hover:shadow-md transition-shadow">
                    <div className="flex flex-col lg:flex-row gap-6">
                      <img
                        src={ticket?.image}
                        alt={ticket?.eventTitle}
                        className="w-full lg:w-48 h-32 object-cover rounded-lg"
                      />

                      <div className="flex-1 space-y-3">
                        <div>
                          <h3 className="text-xl font-semibold text-gray-900">{ticket?.eventTitle}</h3>
                          <div className="flex items-center space-x-4 text-gray-600 mt-2">
                            <div className="flex items-center space-x-1">
                              <Calendar className="w-4 h-4" />
                              <span>{ticket?.eventDate?.slice(0, 10)}</span>
                            </div>
                            <div className="flex items-center space-x-1">
                              <Clock className="w-4 h-4" />
                              <span>{ticket?.eventTime}</span>
                            </div>
                            <div className="flex items-center space-x-1">
                              <MapPin className="w-4 h-4" />
                              <span>{ticket?.venue}</span>
                            </div>
                          </div>
                        </div>

                        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 text-sm">
                          {ticket?.tickets && ticket.tickets.map((tkt, index) => (
                            <div key={index} className=" flex flex-col md:grid grid-cols-2 gap-4 text-sm">
                              <div className='bg-gray-200 flex gap-2'>  
                                <div className="text-gray-500">Ticket Type</div>
                                <div className="font-medium text-gray-900">{tkt.type.slice(0,8)}</div>
                              </div>
                              <div>
                                <div className="text-gray-500">Quantity</div>
                                <div className="font-medium text-gray-900">{tkt.quantity}</div>
                              </div>
                              <div>
                                <div className="text-gray-500">Total Paid</div>
                                <div className="font-medium text-gray-900">${tkt.price * tkt.quantity}</div>
                              </div>
                            </div>
                          ))}
                          <div className="text-gray-500">Booking ID</div>
                          <div className="font-medium text-gray-900">{ticket.bookingId}</div>
                        </div>
                        <div className="flex flex-wrap gap-3">
                          <button className="flex items-center space-x-2 px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors">
                            <Download className="w-4 h-4" />
                            <span>Download Ticket</span>
                          </button>
                          <button className="flex items-center space-x-2 px-4 py-2 border border-gray-200 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors">
                            <Share2 className="w-4 h-4" />
                            <span>Share</span>
                          </button>
                          <button className="flex items-center space-x-2 px-4 py-2 border border-gray-200 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors">
                            <Calendar className="w-4 h-4" />
                            <span>Add to Calendar</span>
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}

            {activeTab === 'past' && (
              <div className="text-center py-12">
                <Calendar className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                <h3 className="text-xl font-semibold text-gray-900 mb-2">No Past Events</h3>
                <p className="text-gray-600">Your attended events will appear here</p>
              </div>
            )}

            {activeTab === 'cancelled' && (
              <div className="text-center py-12">
                <Calendar className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                <h3 className="text-xl font-semibold text-gray-900 mb-2">No Cancelled Bookings</h3>
                <p className="text-gray-600">Any cancelled bookings will appear here</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default UserDashboard;