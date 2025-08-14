'use client';
import React, { useState } from 'react';
import { toast } from 'sonner';
//import { toast } from "sonner";

const initialState = {
  name: '',
  email: '',
  phone: '',
  eventType: '',
  date: '',
  message: '',
};

const eventTypes = ['Concert', 'Private Event', 'Corporate Event', 'Festival', 'Other'];

export default function BookingPage() {
  const [form, setForm] = useState(initialState);
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState('');

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setSuccess(false);
    try {
      // Simulate email send with a delay
      await new Promise(res => setTimeout(res, 1200));
      setSuccess(true);
      setForm(initialState);
      toast.success('Booking request sent! Our team will contact you soon.');
    } catch {
      setError('Something went wrong. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-[70vh] flex flex-col items-center justify-center bg-gradient-to-br from-purple-900 via-slate-900 to-black py-12 px-4">
      <div className="w-full max-w-lg bg-white/90 rounded-xl shadow-xl p-8">
        <h1 className="text-3xl font-bold text-center text-purple-900 mb-2">Book Bugle</h1>
        <p className="text-center text-gray-700 mb-8">
          Fill out the form below to inquire about booking Bugle for your next event. Our management
          team will get back to you promptly.
        </p>
        <form className="space-y-5" onSubmit={handleSubmit}>
          <div>
            <label htmlFor="name" className="block text-sm font-medium text-gray-700">
              Name
            </label>
            <input
              type="text"
              id="name"
              name="name"
              required
              value={form.name}
              onChange={handleChange}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-purple-500 focus:ring focus:ring-purple-200 focus:ring-opacity-50"
              placeholder="Your Name"
            />
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700">
                Email
              </label>
              <input
                type="email"
                id="email"
                name="email"
                required
                value={form.email}
                onChange={handleChange}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-purple-500 focus:ring focus:ring-purple-200 focus:ring-opacity-50"
                placeholder="you@email.com"
              />
            </div>
            <div>
              <label htmlFor="phone" className="block text-sm font-medium text-gray-700">
                Phone
              </label>
              <input
                type="tel"
                id="phone"
                name="phone"
                value={form.phone}
                onChange={handleChange}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-purple-500 focus:ring focus:ring-purple-200 focus:ring-opacity-50"
                placeholder="(555) 123-4567"
              />
            </div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label htmlFor="eventType" className="block text-sm font-medium text-gray-700">
                Event Type
              </label>
              <select
                id="eventType"
                name="eventType"
                required
                value={form.eventType}
                onChange={handleChange}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-purple-500 focus:ring focus:ring-purple-200 focus:ring-opacity-50"
              >
                <option value="">Select an event type</option>
                {eventTypes.map(type => (
                  <option key={type} value={type}>
                    {type}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label htmlFor="date" className="block text-sm font-medium text-gray-700">
                Event Date
              </label>
              <input
                type="date"
                id="date"
                name="date"
                required
                value={form.date}
                onChange={handleChange}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-purple-500 focus:ring focus:ring-purple-200 focus:ring-opacity-50"
              />
            </div>
          </div>
          <div>
            <label htmlFor="message" className="block text-sm font-medium text-gray-700">
              Additional Details
            </label>
            <textarea
              id="message"
              name="message"
              rows={4}
              value={form.message}
              onChange={handleChange}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-purple-500 focus:ring focus:ring-purple-200 focus:ring-opacity-50"
              placeholder="Tell us more about your event, venue, or any special requests."
            />
          </div>
          {error && <div className="text-red-600 text-sm text-center">{error}</div>}
          {success && (
            <div className="text-green-600 text-sm text-center">
              Thank you! Your booking request has been sent. Our team will contact you soon.
            </div>
          )}
          <button
            type="submit"
            disabled={loading}
            className="w-full py-2 px-4 bg-purple-700 hover:bg-purple-800 text-white font-semibold rounded-md shadow transition-all disabled:opacity-60"
          >
            {loading ? 'Sending...' : 'Send Booking Request'}
          </button>
        </form>
      </div>
    </div>
  );
}
