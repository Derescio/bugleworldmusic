'use client';

import { useState, useEffect } from 'react';
import { Calendar, MapPin, ExternalLink, Music, Clock, Users } from 'lucide-react';

interface Show {
  id: string;
  date: string;
  country: string;
  city: string;
  venue: string;
  ticketUrl?: string;
}

export default function ShowsPage() {
  const [shows, setShows] = useState<Show[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchShows();
  }, []);

  const fetchShows = async () => {
    try {
      setLoading(true);
      const response = await fetch('/api/shows');
      if (!response.ok) {
        throw new Error('Failed to fetch shows');
      }
      const data = await response.json();
      setShows(data.shows || []);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch shows');
    } finally {
      setLoading(false);
    }
  };

  const getUpcomingShows = () => {
    const now = new Date();
    return shows
      .filter(show => new Date(show.date) > now)
      .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
  };

  const getPastShows = () => {
    const now = new Date();
    return shows
      .filter(show => new Date(show.date) <= now)
      .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
      .slice(0, 5); // Show only last 5 past shows
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };

  const formatTime = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleTimeString('en-US', {
      hour: 'numeric',
      minute: '2-digit',
      hour12: true,
    });
  };

  const upcomingShows = getUpcomingShows();
  const pastShows = getPastShows();

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
        <div className="container mx-auto px-4 py-16">
          <div className="text-center">
            <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-purple-400 mx-auto"></div>
            <p className="text-white text-xl mt-4">Loading shows...</p>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
        <div className="container mx-auto px-4 py-16">
          <div className="text-center">
            <div className="bg-red-500/20 border border-red-500/50 rounded-lg p-6 max-w-md mx-auto">
              <p className="text-red-400 text-lg">Error loading shows</p>
              <p className="text-red-300 text-sm mt-2">{error}</p>
              <button
                onClick={fetchShows}
                className="mt-4 px-4 py-2 bg-red-500 hover:bg-red-600 text-white rounded-lg transition-colors"
              >
                Try Again
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
      {/* Hero Section */}
      <div className="relative overflow-hidden">
        <div className="absolute inset-0 bg-black/40 z-10"></div>
        <div className="relative z-20 container mx-auto px-4 py-24 text-center">
          <h1 className="text-5xl md:text-7xl font-bold text-white mb-6">Live Shows</h1>
          <p className="text-xl md:text-2xl text-purple-200 mb-8 max-w-3xl mx-auto">
            Experience the energy of Bugle World Music live on stage. Join us for unforgettable
            performances around the world.
          </p>
          <div className="flex flex-wrap justify-center gap-4 text-purple-200">
            <div className="flex items-center gap-2">
              <Music className="w-5 h-5" />
              <span>Live Music</span>
            </div>
            <div className="flex items-center gap-2">
              <Users className="w-5 h-5" />
              <span>Community</span>
            </div>
            <div className="flex items-center gap-2">
              <Clock className="w-5 h-5" />
              <span>Unforgettable Moments</span>
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-16">
        {/* Upcoming Shows Section */}
        <div className="mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-8 text-center">
            {upcomingShows.length > 0 ? 'Upcoming Shows' : 'No Upcoming Shows'}
          </h2>

          {upcomingShows.length > 0 ? (
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              {upcomingShows.map(show => (
                <div
                  key={show.id}
                  className="bg-white/10 backdrop-blur-sm border border-white/20 rounded-xl p-6 hover:bg-white/20 transition-all duration-300 hover:scale-105"
                >
                  <div className="flex items-center gap-3 mb-4">
                    <div className="bg-purple-500 p-2 rounded-lg">
                      <Calendar className="w-5 h-5 text-white" />
                    </div>
                    <div>
                      <p className="text-white font-semibold">{formatDate(show.date)}</p>
                      <p className="text-purple-200 text-sm">{formatTime(show.date)}</p>
                    </div>
                  </div>

                  <div className="space-y-3">
                    <div className="flex items-center gap-2 text-purple-200">
                      <MapPin className="w-4 h-4" />
                      <span>{show.venue}</span>
                    </div>
                    <p className="text-white/80 text-sm">
                      {show.city}, {show.country}
                    </p>
                  </div>

                  {show.ticketUrl && (
                    <a
                      href={show.ticketUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="mt-4 inline-flex items-center gap-2 bg-purple-600 hover:bg-purple-700 text-white px-4 py-2 rounded-lg transition-colors"
                    >
                      Get Tickets
                      <ExternalLink className="w-4 h-4" />
                    </a>
                  )}
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-16">
              <div className="bg-white/10 backdrop-blur-sm border border-white/20 rounded-2xl p-12 max-w-2xl mx-auto">
                <div className="bg-purple-500/20 p-6 rounded-full w-24 h-24 mx-auto mb-6 flex items-center justify-center">
                  <Music className="w-12 h-12 text-purple-400" />
                </div>
                <h3 className="text-2xl font-bold text-white mb-4">Stay Tuned for Future Shows!</h3>
                <p className="text-purple-200 mb-6">
                  We are working on bringing you amazing live performances. Follow us on social
                  media and join our mailing list to be the first to know about new shows.
                </p>
                <div className="space-y-4">
                  <button className="w-full bg-purple-600 hover:bg-purple-700 text-white px-6 py-3 rounded-lg transition-colors font-semibold">
                    Join Mailing List
                  </button>
                  <button className="w-full bg-white/10 hover:bg-white/20 text-white px-6 py-3 rounded-lg transition-colors border border-white/20">
                    Follow on Social Media
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Past Shows Section */}
        {pastShows.length > 0 && (
          <div className="mb-16">
            <h3 className="text-2xl font-bold text-white mb-6 text-center">Recent Shows</h3>
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              {pastShows.map(show => (
                <div
                  key={show.id}
                  className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-lg p-4 opacity-75 hover:opacity-100 transition-opacity"
                >
                  <div className="flex items-center gap-2 mb-2">
                    <Calendar className="w-4 h-4 text-purple-300" />
                    <span className="text-purple-200 text-sm">{formatDate(show.date)}</span>
                  </div>
                  <p className="text-white font-medium">{show.venue}</p>
                  <p className="text-white/60 text-sm">
                    {show.city}, {show.country}
                  </p>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Call to Action Section */}
        <div className="text-center py-16">
          <div className="bg-gradient-to-r from-purple-600/20 to-blue-600/20 border border-purple-500/30 rounded-2xl p-12 max-w-4xl mx-auto">
            <h3 className="text-3xl font-bold text-white mb-6">Want to Book Bugle World Music?</h3>
            <p className="text-purple-200 text-lg mb-8 max-w-2xl mx-auto">
              Whether you are planning a festival, corporate event, or private party, we would love
              to bring our unique sound to your venue.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <a
                href="/booking"
                className="bg-purple-600 hover:bg-purple-700 text-white px-8 py-3 rounded-lg transition-colors font-semibold text-lg"
              >
                Book for Your Event
              </a>
              <a
                href="/contact"
                className="bg-white/10 hover:bg-white/20 text-white px-8 py-3 rounded-lg transition-colors border border-white/20 font-semibold text-lg"
              >
                Get in Touch
              </a>
            </div>
          </div>
        </div>

        {/* Newsletter Signup */}
        <div className="text-center py-16">
          <div className="bg-white/5 backdrop-blur-sm border border-white/20 rounded-2xl p-12 max-w-2xl mx-auto">
            <h3 className="text-2xl font-bold text-white mb-4">Never Miss a Show</h3>
            <p className="text-purple-200 mb-6">
              Subscribe to our newsletter for exclusive updates, early ticket access, and
              behind-the-scenes content.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 max-w-md mx-auto">
              <input
                type="email"
                placeholder="Enter your email"
                className="flex-1 px-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white placeholder-white/50 focus:outline-none focus:border-purple-500"
              />
              <button className="bg-purple-600 hover:bg-purple-700 text-white px-6 py-3 rounded-lg transition-colors font-semibold">
                Subscribe
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
