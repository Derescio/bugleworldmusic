'use client';

import { useState, useEffect } from 'react';
import { toast } from 'sonner';
import Link from 'next/link';
import Image from 'next/image';
import { Button } from '../../components/ui/button';
import { ConfirmDialog } from '../../components/ConfirmDialog';
import { Input } from '../../components/ui/input';
import { Label } from '../../components/ui/label';

interface Music {
  id: string;
  title: string;
  description?: string;
  releaseDate?: string;
  duration?: number;
  coverImageUrl?: string;
  label?: string;
  createdAt: string;
  genres: Array<{
    genre: {
      id: number;
      name: string;
    };
  }>;
  tags: Array<{
    tag: {
      id: number;
      name: string;
    };
  }>;
  links: Array<{
    id: number;
    platform: string;
    url: string;
  }>;
}

export default function MusicManagement() {
  const [music, setMusic] = useState<Music[]>([]);
  const [filteredMusic, setFilteredMusic] = useState<Music[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedGenre, setSelectedGenre] = useState('');
  const [selectedTag, setSelectedTag] = useState('');
  const [genres, setGenres] = useState<Array<{ id: number; name: string }>>([]);
  const [tags, setTags] = useState<Array<{ id: number; name: string }>>([]);

  // Fetch music data
  useEffect(() => {
    const fetchData = async () => {
      try {
        const [musicRes, genresRes, tagsRes] = await Promise.all([
          fetch('/api/music?limit=50'),
          fetch('/api/genres'),
          fetch('/api/tags'),
        ]);

        if (musicRes.ok) {
          const musicData = await musicRes.json();
          setMusic(musicData.music);
          setFilteredMusic(musicData.music);
        }

        if (genresRes.ok) {
          const genresData = await genresRes.json();
          setGenres(genresData);
        }

        if (tagsRes.ok) {
          const tagsData = await tagsRes.json();
          setTags(tagsData);
        }
      } catch (error) {
        console.error('Error fetching data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  // Filter music based on search and filters
  useEffect(() => {
    let filtered = music;

    // Search filter
    if (searchTerm) {
      filtered = filtered.filter(
        track =>
          track.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
          track.description?.toLowerCase().includes(searchTerm.toLowerCase()) ||
          track.label?.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // Genre filter
    if (selectedGenre) {
      filtered = filtered.filter(track => track.genres.some(g => g.genre.name === selectedGenre));
    }

    // Tag filter
    if (selectedTag) {
      filtered = filtered.filter(track => track.tags.some(t => t.tag.name === selectedTag));
    }

    setFilteredMusic(filtered);
  }, [music, searchTerm, selectedGenre, selectedTag]);

  const formatDuration = (seconds?: number) => {
    if (!seconds) return 'N/A';
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`;
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center py-12">
        <div className="text-gray-500">Loading music...</div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header with Create Button */}
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-xl font-semibold text-gray-900">Music Catalog</h2>
          <p className="text-sm text-gray-500 mt-1">
            {filteredMusic.length} track{filteredMusic.length !== 1 ? 's' : ''} found
          </p>
        </div>
        <Link href="/admin/music/create">
          <Button>Create New Track</Button>
        </Link>
      </div>

      {/* Filters */}
      <div className="bg-white p-6 rounded-lg shadow">
        <h3 className="text-lg font-medium mb-4">Filters</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <Label htmlFor="search">Search</Label>
            <Input
              id="search"
              placeholder="Search by title, description, or label..."
              value={searchTerm}
              onChange={e => setSearchTerm(e.target.value)}
            />
          </div>
          <div>
            <Label htmlFor="genre">Genre</Label>
            <select
              id="genre"
              className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
              value={selectedGenre}
              onChange={e => setSelectedGenre(e.target.value)}
            >
              <option value="">All Genres</option>
              {genres.map(genre => (
                <option key={genre.id} value={genre.name}>
                  {genre.name}
                </option>
              ))}
            </select>
          </div>
          <div>
            <Label htmlFor="tag">Release Type</Label>
            <select
              id="tag"
              className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
              value={selectedTag}
              onChange={e => setSelectedTag(e.target.value)}
            >
              <option value="">All Types</option>
              {tags.map(tag => (
                <option key={tag.id} value={tag.name}>
                  {tag.name}
                </option>
              ))}
            </select>
          </div>
        </div>
        {(searchTerm || selectedGenre || selectedTag) && (
          <div className="mt-4">
            <Button
              variant="outline"
              size="sm"
              onClick={() => {
                setSearchTerm('');
                setSelectedGenre('');
                setSelectedTag('');
              }}
            >
              Clear Filters
            </Button>
          </div>
        )}
      </div>

      {/* Music List */}
      <div className="bg-white shadow rounded-lg">
        {filteredMusic.length === 0 ? (
          <div className="text-center py-12">
            <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <span className="text-2xl">♪</span>
            </div>
            <h3 className="text-lg font-medium text-gray-900 mb-2">
              {music.length === 0 ? 'No music tracks yet' : 'No tracks match your filters'}
            </h3>
            <p className="text-gray-500 mb-6">
              {music.length === 0
                ? 'Get started by creating your first track'
                : 'Try adjusting your search or filter criteria'}
            </p>
            {music.length === 0 && (
              <Link href="/admin/music/create">
                <Button>Create Your First Track</Button>
              </Link>
            )}
          </div>
        ) : (
          <div className="overflow-hidden">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Track
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Genres
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Type
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Duration
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Release Date
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {filteredMusic.map(track => (
                  <tr key={track.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        {track.coverImageUrl && (
                          <Image
                            className="h-10 w-10 rounded-md object-cover mr-4"
                            src={track.coverImageUrl}
                            alt={track.title}
                            width={40}
                            height={40}
                          />
                        )}
                        <div>
                          <div className="text-sm font-medium text-gray-900">{track.title}</div>
                          {track.label && (
                            <div className="text-sm text-gray-500">{track.label}</div>
                          )}
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex flex-wrap gap-1">
                        {track.genres.map(genre => (
                          <span
                            key={genre.genre.id}
                            className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800"
                          >
                            {genre.genre.name}
                          </span>
                        ))}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex flex-wrap gap-1">
                        {track.tags.map(tag => (
                          <span
                            key={tag.tag.id}
                            className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800"
                          >
                            {tag.tag.name}
                          </span>
                        ))}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {formatDuration(track.duration)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {track.releaseDate ? new Date(track.releaseDate).toLocaleDateString() : 'N/A'}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      <div className="flex space-x-2">
                        <Link href={`/admin/music/${track.id}/edit`}>
                          <Button variant="outline" size="sm">
                            Edit
                          </Button>
                        </Link>
                        <ConfirmDialog
                          title={`Delete '${track.title}'?`}
                          description="This action cannot be undone. This will permanently delete this track and all its data."
                          confirmLabel="Delete"
                          cancelLabel="Cancel"
                          trigger={
                            <Button variant="outline" size="sm">
                              Delete
                            </Button>
                          }
                          onConfirm={async () => {
                            try {
                              const res = await fetch(`/api/music/${track.id}`, {
                                method: 'DELETE',
                              });
                              if (res.ok) {
                                setMusic(prev => prev.filter(m => m.id !== track.id));
                                toast.success(`'${track.title}' deleted successfully.`);
                              } else {
                                const data = await res.json();
                                toast.error(data.error || 'Failed to delete track.');
                              }
                            } catch {
                              toast.error('Failed to delete track.');
                            }
                          }}
                        />
                        {/* <Link href={`/admin/music/${track.id}`}>
                          <Button variant="outline" size="sm">
                            View
                          </Button>
                        </Link> */}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
