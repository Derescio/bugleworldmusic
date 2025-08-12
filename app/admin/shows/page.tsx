'use client';

import { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Button } from '../../components/ui/button';
import { Input } from '../../components/ui/input';
import { Label } from '../../components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../../components/ui/tabs';

// Form schema for shows
const showFormSchema = z.object({
  date: z.string().min(1, 'Date is required'),
  country: z.string().min(1, 'Country is required'),
  city: z.string().min(1, 'City is required'),
  venue: z.string().min(1, 'Venue is required'),
  ticketUrl: z.string().url().optional().or(z.literal('')),
});

type ShowFormData = z.infer<typeof showFormSchema>;

interface Show {
  id: number;
  date: string;
  country: string;
  city: string;
  venue: string;
  ticketUrl: string | null;
  createdAt: string;
  updatedAt: string;
}

export default function ShowsPage() {
  const [shows, setShows] = useState<Show[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<ShowFormData>({
    resolver: zodResolver(showFormSchema),
    defaultValues: {
      date: '',
      country: '',
      city: '',
      venue: '',
      ticketUrl: '',
    },
  });

  // Fetch shows on component mount
  useEffect(() => {
    fetchShows();
  }, []);

  const fetchShows = async () => {
    setIsLoading(true);
    try {
      const response = await fetch('/api/shows');
      if (response.ok) {
        const data = await response.json();
        setShows(data.shows);
      } else {
        console.error('Failed to fetch shows');
      }
    } catch (error) {
      console.error('Error fetching shows:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const onSubmit = async (data: ShowFormData) => {
    setIsSubmitting(true);
    try {
      const response = await fetch('/api/shows', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      });

      if (response.ok) {
        const result = await response.json();
        console.log('Show created:', result);
        alert('Show created successfully!');
        reset();
        fetchShows(); // Refresh the shows list
      } else {
        const error = await response.json();
        console.error('Error creating show:', error);
        alert('Error creating show: ' + (error.error || 'Unknown error'));
      }
    } catch (error) {
      console.error('Error:', error);
      alert('Error creating show');
    } finally {
      setIsSubmitting(false);
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };

  const formatTime = (dateString: string) => {
    return new Date(dateString).toLocaleTimeString('en-US', {
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-semibold text-gray-900">Shows & Tours Management</h2>
          <p className="text-sm text-gray-600">Create and manage your upcoming shows and tours</p>
        </div>
      </div>

      <Tabs defaultValue="create" className="space-y-6">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="create">Create New Show</TabsTrigger>
          <TabsTrigger value="view">View All Shows</TabsTrigger>
        </TabsList>

        <TabsContent value="create" className="space-y-6">
          <div className="bg-white shadow rounded-lg p-6">
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label htmlFor="date">Show Date & Time *</Label>
                  <Input id="date" type="datetime-local" {...register('date')} required />
                  {errors.date && <p className="text-sm text-red-600">{errors.date.message}</p>}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="country">Country *</Label>
                  <Input
                    id="country"
                    {...register('country')}
                    placeholder="e.g., United States"
                    required
                  />
                  {errors.country && (
                    <p className="text-sm text-red-600">{errors.country.message}</p>
                  )}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="city">City *</Label>
                  <Input id="city" {...register('city')} placeholder="e.g., New York" required />
                  {errors.city && <p className="text-sm text-red-600">{errors.city.message}</p>}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="venue">Venue *</Label>
                  <Input
                    id="venue"
                    {...register('venue')}
                    placeholder="e.g., Madison Square Garden"
                    required
                  />
                  {errors.venue && <p className="text-sm text-red-600">{errors.venue.message}</p>}
                </div>

                <div className="space-y-2 md:col-span-2">
                  <Label htmlFor="ticketUrl">Ticket URL (Optional)</Label>
                  <Input
                    id="ticketUrl"
                    {...register('ticketUrl')}
                    placeholder="https://ticketmaster.com/event/..."
                    type="url"
                  />
                  {errors.ticketUrl && (
                    <p className="text-sm text-red-600">{errors.ticketUrl.message}</p>
                  )}
                </div>
              </div>

              <div className="flex justify-end gap-4 pt-6 border-t">
                <Button type="button" variant="outline" onClick={() => reset()}>
                  Reset Form
                </Button>
                <Button type="submit" disabled={isSubmitting}>
                  {isSubmitting ? 'Creating Show...' : 'Create Show'}
                </Button>
              </div>
            </form>
          </div>
        </TabsContent>

        <TabsContent value="view" className="space-y-6">
          <div className="bg-white shadow rounded-lg">
            <div className="px-6 py-4 border-b border-gray-200">
              <h3 className="text-lg font-medium text-gray-900">All Shows</h3>
            </div>

            {isLoading ? (
              <div className="p-6 text-center">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900 mx-auto"></div>
                <p className="mt-2 text-sm text-gray-600">Loading shows...</p>
              </div>
            ) : shows.length === 0 ? (
              <div className="p-6 text-center">
                <p className="text-gray-500">No shows found. Create your first show above!</p>
              </div>
            ) : (
              <div className="overflow-hidden">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Date & Time
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Location
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Venue
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Tickets
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {shows.map(show => (
                      <tr key={show.id} className="hover:bg-gray-50">
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div>
                            <div className="text-sm font-medium text-gray-900">
                              {formatDate(show.date)}
                            </div>
                            <div className="text-sm text-gray-500">{formatTime(show.date)}</div>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div>
                            <div className="text-sm font-medium text-gray-900">{show.city}</div>
                            <div className="text-sm text-gray-500">{show.country}</div>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                          {show.venue}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {show.ticketUrl ? (
                            <a
                              href={show.ticketUrl}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="text-indigo-600 hover:text-indigo-900 underline"
                            >
                              Buy Tickets
                            </a>
                          ) : (
                            <span className="text-gray-400">No link</span>
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}
