import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { CreditCard, Lock, User, Mail, Phone, ArrowLeft, Check } from 'lucide-react';
import { createBooking } from '../store/slices/bookingSlice';

const Checkout = () => {
  const { eventId } = useParams();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [currentStep, setCurrentStep] = useState(1);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    paymentMethod: 'card',
  });

  const { selectedTickets, totalAmount, isLoading } = useSelector(state => state.booking);
  const { currentEvent } = useSelector(state => state.events);

  const steps = [
    { id: 1, title: 'Attendee Info' },
    { id: 2, title: 'Payment' },
    { id: 3, title: 'Confirmation' },
  ];

  const handleInputChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (currentStep < 3) {
      setCurrentStep(currentStep + 1);
    } else {
      // Process payment and create booking
      dispatch(createBooking({
        eventId,
        tickets: selectedTickets,
        attendeeInfo: formData,
        totalAmount,
      }));
    }
  };

  if (!selectedTickets.length) {
    return (
      <div className="min-h-screen bg-gray-50 pt-8">
        <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="bg-white rounded-xl p-8 shadow-sm border border-gray-100">
            <h1 className="text-2xl font-bold text-gray-900 mb-4">No Tickets Selected</h1>
            <p className="text-gray-600 mb-6">Please select tickets before proceeding to checkout.</p>
            <button
              onClick={() => navigate(`/event/${eventId}`)}
              className="btn-primary"
            >
              Back to Event
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 pt-8">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-8">
          <button
            onClick={() => navigate(`/event/${eventId}`)}
            className="flex items-center space-x-2 text-gray-600 hover:text-gray-900 mb-4"
          >
            <ArrowLeft className="w-5 h-5" />
            <span>Back to Event</span>
          </button>
          <h1 className="text-3xl font-bold text-gray-900">Checkout</h1>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2">
            {/* Progress Steps */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 mb-6">
              <div className="flex items-center justify-between">
                {steps.map((step, index) => (
                  <div key={step.id} className="flex items-center">
                    <div className={`flex items-center justify-center w-10 h-10 rounded-full border-2 transition-all duration-200 ${
                      currentStep >= step.id
                        ? 'bg-primary-600 border-primary-600 text-white'
                        : currentStep > step.id
                        ? 'bg-green-600 border-green-600 text-white'
                        : 'bg-white border-gray-200 text-gray-400'
                    }`}>
                      {currentStep > step.id ? (
                        <Check className="w-5 h-5" />
                      ) : (
                        <span className="text-sm font-medium">{step.id}</span>
                      )}
                    </div>
                    {index < steps.length - 1 && (
                      <div className={`w-16 h-0.5 mx-4 transition-colors duration-200 ${
                        currentStep > step.id ? 'bg-green-600' : currentStep >= step.id ? 'bg-primary-600' : 'bg-gray-200'
                      }`}></div>
                    )}
                  </div>
                ))}
              </div>
              <div className="mt-4 flex justify-between">
                {steps.map((step) => (
                  <div key={step.id} className="text-center flex-1">
                    <div className={`text-sm font-medium transition-colors duration-200 ${
                      currentStep >= step.id ? 'text-primary-600' : 'text-gray-400'
                    }`}>
                      {step.title}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Form Content */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
              <form onSubmit={handleSubmit} className="space-y-6">
                {currentStep === 1 && (
                  <div className="space-y-6">
                    <h2 className="text-xl font-semibold text-gray-900">Attendee Information</h2>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Full Name *
                      </label>
                      <div className="relative">
                        <User className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                        <input
                          type="text"
                          name="name"
                          required
                          value={formData.name}
                          onChange={handleInputChange}
                          className="input-field pl-10"
                          placeholder="Enter your full name"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Email Address *
                      </label>
                      <div className="relative">
                        <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                        <input
                          type="email"
                          name="email"
                          required
                          value={formData.email}
                          onChange={handleInputChange}
                          className="input-field pl-10"
                          placeholder="Enter your email"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Phone Number *
                      </label>
                      <div className="relative">
                        <Phone className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                        <input
                          type="tel"
                          name="phone"
                          required
                          value={formData.phone}
                          onChange={handleInputChange}
                          className="input-field pl-10"
                          placeholder="Enter your phone number"
                        />
                      </div>
                    </div>
                  </div>
                )}

                {currentStep === 2 && (
                  <div className="space-y-6">
                    <h2 className="text-xl font-semibold text-gray-900">Payment Information</h2>
                    
                    <div className="space-y-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-3">
                          Payment Method
                        </label>
                        <div className="space-y-3">
                          {[
                            { id: 'card', label: 'Credit/Debit Card', icon: CreditCard },
                            { id: 'upi', label: 'UPI', icon: Phone },
                          ].map((method) => (
                            <label key={method.id} className="flex items-center space-x-3 p-4 border border-gray-200 rounded-lg cursor-pointer hover:bg-gray-50">
                              <input
                                type="radio"
                                name="paymentMethod"
                                value={method.id}
                                checked={formData.paymentMethod === method.id}
                                onChange={handleInputChange}
                                className="w-4 h-4 text-primary-600 focus:ring-primary-500"
                              />
                              <method.icon className="w-5 h-5 text-gray-600" />
                              <span className="font-medium text-gray-900">{method.label}</span>
                            </label>
                          ))}
                        </div>
                      </div>

                      {formData.paymentMethod === 'card' && (
                        <div className="space-y-4 p-4 bg-gray-50 rounded-lg">
                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                              Card Number
                            </label>
                            <input
                              type="text"
                              placeholder="1234 5678 9012 3456"
                              className="input-field"
                            />
                          </div>
                          <div className="grid grid-cols-2 gap-4">
                            <div>
                              <label className="block text-sm font-medium text-gray-700 mb-2">
                                Expiry Date
                              </label>
                              <input
                                type="text"
                                placeholder="MM/YY"
                                className="input-field"
                              />
                            </div>
                            <div>
                              <label className="block text-sm font-medium text-gray-700 mb-2">
                                CVV
                              </label>
                              <input
                                type="text"
                                placeholder="123"
                                className="input-field"
                              />
                            </div>
                          </div>
                        </div>
                      )}
                    </div>

                    <div className="flex items-center space-x-2 text-sm text-gray-600">
                      <Lock className="w-4 h-4" />
                      <span>Your payment information is secure and encrypted</span>
                    </div>
                  </div>
                )}

                {currentStep === 3 && (
                  <div className="text-center space-y-6">
                    <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto">
                      <Check className="w-10 h-10 text-green-600" />
                    </div>
                    <div>
                      <h2 className="text-2xl font-bold text-gray-900 mb-2">Booking Confirmed!</h2>
                      <p className="text-gray-600">Your tickets have been successfully booked.</p>
                    </div>
                    <div className="bg-gray-50 rounded-lg p-6 text-left">
                      <h3 className="font-medium text-gray-900 mb-4">Booking Details</h3>
                      <div className="space-y-2 text-sm text-gray-600">
                        <div>Booking ID: #BK{Date.now()}</div>
                        <div>Event: {currentEvent?.title}</div>
                        <div>Total Amount: ${totalAmount}</div>
                      </div>
                    </div>
                    <div className="flex space-x-4">
                      <button
                        type="button"
                        onClick={() => navigate('/dashboard')}
                        className="flex-1 btn-primary"
                      >
                        View My Tickets
                      </button>
                      <button
                        type="button"
                        onClick={() => navigate('/')}
                        className="flex-1 btn-secondary"
                      >
                        Back to Home
                      </button>
                    </div>
                  </div>
                )}

                {currentStep < 3 && (
                  <div className="flex justify-end">
                    <button
                      type="submit"
                      disabled={isLoading}
                      className="btn-primary disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      {currentStep === 2 ? 'Complete Payment' : 'Continue'}
                    </button>
                  </div>
                )}
              </form>
            </div>
          </div>

          {/* Order Summary */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 sticky top-24">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Order Summary</h3>
              
              {currentEvent && (
                <div className="mb-6">
                  <img
                    src={currentEvent.image}
                    alt={currentEvent.title}
                    className="w-full h-32 object-cover rounded-lg mb-3"
                  />
                  <h4 className="font-medium text-gray-900">{currentEvent.title}</h4>
                  <p className="text-sm text-gray-600">{currentEvent.date} at {currentEvent.time}</p>
                </div>
              )}

              <div className="space-y-3 mb-6">
                {selectedTickets.map((ticket, index) => (
                  <div key={index} className="flex justify-between items-center py-2 border-b border-gray-100">
                    <div>
                      <div className="font-medium text-gray-900">{ticket.type}</div>
                      <div className="text-sm text-gray-500">Qty: {ticket.quantity}</div>
                    </div>
                    <div className="text-gray-900 font-medium">
                      ${ticket.price * ticket.quantity}
                    </div>
                  </div>
                ))}
              </div>

              <div className="border-t border-gray-200 pt-4">
                <div className="flex justify-between items-center mb-2">
                  <span className="text-gray-600">Subtotal</span>
                  <span className="text-gray-900">${totalAmount}</span>
                </div>
                <div className="flex justify-between items-center mb-2">
                  <span className="text-gray-600">Service Fee</span>
                  <span className="text-gray-900">$2.99</span>
                </div>
                <div className="flex justify-between items-center text-lg font-bold pt-2 border-t border-gray-200">
                  <span className="text-gray-900">Total</span>
                  <span className="text-primary-600">${totalAmount + 2.99}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Checkout;