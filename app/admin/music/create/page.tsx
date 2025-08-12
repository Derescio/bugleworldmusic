'use client';

import { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import Image from 'next/image';
import { Button } from '../../../components/ui/button';
import { Input } from '../../../components/ui/input';
import { Textarea } from '../../../components/ui/textarea';
import { Label } from '../../../components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../../../components/ui/tabs';
import { UploadDropzone } from '../../../lib/uploadthing';

// Form schema - only validate the fields we need from the form
const musicFormSchema = z.object({
  title: z.string().min(1, 'Title is required'),
  description: z.string().optional(),
  releaseDate: z.string().optional(),
  duration: z.coerce.number().optional(),
  coverImageUrl: z.string().optional(),
  label: z.string().optional(),
  isActive: z.boolean().optional(),
});

interface Genre {
  id: number;
  name: string;
}

interface Tag {
  id: number;
  name: string;
}

interface Track {
  title: string;
  duration?: number | undefined;
  position: number;
}

export default function CreateMusicPage() {
  const [genres, setGenres] = useState<Genre[]>([]);
  const [tags, setTags] = useState<Tag[]>([]);
  const [selectedGenres, setSelectedGenres] = useState<number[]>([]);
  const [selectedTags, setSelectedTags] = useState<number[]>([]);
  const [links, setLinks] = useState([{ platform: '', url: '' }]);
  const [isActive, setIsActive] = useState(true);
  const [tracks, setTracks] = useState<Track[]>([{ title: '', duration: undefined, position: 0 }]);
  const [isLoading, setIsLoading] = useState(false);
  const [uploadedImageUrl, setUploadedImageUrl] = useState<string>('');

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm({
    resolver: zodResolver(musicFormSchema),
    defaultValues: {
      title: '',
      isActive: true,
    },
  });

  // Fetch genres and tags on component mount
  useEffect(() => {
    const fetchData = async () => {
      try {
        const [genresRes, tagsRes] = await Promise.all([fetch('/api/genres'), fetch('/api/tags')]);

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
      }
    };

    fetchData();
  }, []);

  const addLinkField = () => {
    setLinks([...links, { platform: '', url: '' }]);
  };

  const removeLinkField = (index: number) => {
    setLinks(links.filter((_, i) => i !== index));
  };

  const updateLink = (index: number, field: 'platform' | 'url', value: string) => {
    const updatedLinks = links.map((link, i) => (i === index ? { ...link, [field]: value } : link));
    setLinks(updatedLinks);
  };

  const onSubmit = async (data: z.infer<typeof musicFormSchema>) => {
    setIsLoading(true);

    try {
      const formData = {
        ...data,
        duration: data.duration ? Number(data.duration) : undefined,
        coverImageUrl: uploadedImageUrl || data.coverImageUrl,
        genres: selectedGenres,
        tags: selectedTags,
        links: links.filter(link => link.platform && link.url),
        isActive,
        tracks: showTracklist
          ? tracks
              .filter(t => t.title.trim())
              .map((track, index) => ({
                title: track.title.trim(),
                duration: track.duration || undefined,
                position: index,
              }))
          : undefined,
      };

      console.log('Submitting form data:', formData);
      console.log('Tracks being sent:', formData.tracks);

      const response = await fetch('/api/music', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        const result = await response.json();
        console.log('Music created:', result);
        alert('Music created successfully!');
        reset({
          title: '',
          isActive: true,
        });
        setSelectedGenres([]);
        setSelectedTags([]);
        setLinks([{ platform: '', url: '' }]);
        setUploadedImageUrl('');
        setIsActive(true);
        setTracks([{ title: '', duration: undefined, position: 0 }]);
      } else {
        const error = await response.json();
        console.error('Error creating music:', error);
        alert('Error creating music: ' + (error.error || 'Unknown error'));
      }
    } catch (error) {
      console.error('Error:', error);
      alert('Error creating music');
    } finally {
      setIsLoading(false);
    }
  };

  // Helper: show tracklist if EP or Album tag is selected
  const epOrAlbumTagNames = ['EP', 'Album'];
  const showTracklist = tags
    .filter(tag => selectedTags.includes(tag.id))
    .some(tag => epOrAlbumTagNames.includes(tag.name));

  return (
    <div className="container mx-auto py-8 px-4">
      <h1 className="text-3xl font-bold mb-8">Create New Music</h1>

      <form onSubmit={handleSubmit(onSubmit)} className="max-w-4xl">
        <Tabs defaultValue="general" className="space-y-6">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="general">General Info</TabsTrigger>
            <TabsTrigger value="genres">Genres</TabsTrigger>
            <TabsTrigger value="tags">Tags</TabsTrigger>
            <TabsTrigger value="links">Platform Links</TabsTrigger>
          </TabsList>

          <TabsContent value="general" className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <Label htmlFor="title">Title *</Label>
                <Input id="title" {...register('title')} placeholder="Enter song title" />
                {errors.title && <p className="text-sm text-red-600">{errors.title.message}</p>}
              </div>

              <div className="space-y-2">
                <Label htmlFor="label">Label</Label>
                <Input id="label" {...register('label')} placeholder="Record label" />
              </div>

              <div className="space-y-2">
                <Label htmlFor="releaseDate">Release Date</Label>
                <Input id="releaseDate" type="date" {...register('releaseDate')} />
              </div>

              <div className="space-y-2">
                <Label htmlFor="duration">Duration (seconds)</Label>
                <Input
                  id="duration"
                  type="number"
                  {...register('duration', { valueAsNumber: true })}
                  placeholder="Track length in seconds"
                />
              </div>

              {/* isActive toggle */}
              <div className="space-y-2 md:col-span-2 flex items-center gap-4">
                <Label htmlFor="isActive">Active</Label>
                <input
                  id="isActive"
                  type="checkbox"
                  {...register('isActive')}
                  checked={isActive}
                  onChange={e => setIsActive(e.target.checked)}
                  className="h-5 w-5 accent-green-600"
                />
                <span className="text-sm text-gray-500">
                  (Toggle to set if this music is active/visible)
                </span>
              </div>

              <div className="space-y-2 md:col-span-2">
                <Label>Cover Image</Label>
                <div className="space-y-4">
                  {uploadedImageUrl ? (
                    <div className="space-y-2">
                      <div className="flex items-center space-x-4">
                        <Image
                          src={uploadedImageUrl}
                          alt="Uploaded cover"
                          className="h-20 w-20 rounded-md object-cover"
                          width={80}
                          height={80}
                        />
                        <div>
                          <p className="text-sm text-green-600 font-medium">
                            ✓ Image uploaded successfully
                          </p>
                          <Button
                            type="button"
                            variant="outline"
                            size="sm"
                            onClick={() => setUploadedImageUrl('')}
                          >
                            Remove
                          </Button>
                        </div>
                      </div>
                    </div>
                  ) : (
                    <div className="space-y-4">
                      <UploadDropzone
                        endpoint="imageUploader"
                        onClientUploadComplete={res => {
                          if (res?.[0]) {
                            setUploadedImageUrl(res[0].url);
                          }
                        }}
                        onUploadError={(error: Error) => {
                          alert(`Upload Error: ${error.message}`);
                        }}
                      />
                      <div className="text-center text-sm text-gray-500">
                        Or enter a URL manually:
                      </div>
                      <Input
                        {...register('coverImageUrl')}
                        placeholder="https://example.com/cover.jpg"
                      />
                    </div>
                  )}
                </div>
              </div>

              <div className="space-y-2 md:col-span-2">
                <Label htmlFor="description">Description</Label>
                <Textarea
                  id="description"
                  {...register('description')}
                  placeholder="Song description..."
                  rows={4}
                />
              </div>
            </div>
          </TabsContent>

          <TabsContent value="genres" className="space-y-4">
            <div>
              <Label className="text-lg font-semibold">Select Genres</Label>
              <p className="text-sm text-gray-600 mb-4">
                Choose all applicable genres for this track
              </p>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                {genres.map(genre => (
                  <label
                    key={genre.id}
                    className="flex items-center space-x-2 p-3 border rounded-lg cursor-pointer hover:bg-gray-50"
                  >
                    <input
                      type="checkbox"
                      checked={selectedGenres.includes(genre.id)}
                      onChange={e => {
                        if (e.target.checked) {
                          setSelectedGenres([...selectedGenres, genre.id]);
                        } else {
                          setSelectedGenres(selectedGenres.filter(id => id !== genre.id));
                        }
                      }}
                      className="rounded"
                    />
                    <span>{genre.name}</span>
                  </label>
                ))}
              </div>
            </div>
          </TabsContent>

          <TabsContent value="tags" className="space-y-4">
            <div>
              <Label className="text-lg font-semibold">Select Tags</Label>
              <p className="text-sm text-gray-600 mb-4">Choose the release type and other tags</p>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                {tags.map(tag => (
                  <label
                    key={tag.id}
                    className="flex items-center space-x-2 p-3 border rounded-lg cursor-pointer hover:bg-gray-50"
                  >
                    <input
                      type="checkbox"
                      checked={selectedTags.includes(tag.id)}
                      onChange={e => {
                        if (e.target.checked) {
                          setSelectedTags([...selectedTags, tag.id]);
                        } else {
                          setSelectedTags(selectedTags.filter(id => id !== tag.id));
                        }
                      }}
                      className="rounded"
                    />
                    <span>{tag.name}</span>
                  </label>
                ))}
              </div>
            </div>

            {/* Tracklist form for EP/Album */}
            {showTracklist && (
              <div className="mt-8">
                <Label className="text-lg font-semibold mb-2">Tracklist</Label>
                <p className="text-sm text-gray-600 mb-4">
                  Add tracks for this EP/Album. Drag to reorder if needed.
                </p>
                {tracks.map((track, idx) => (
                  <div key={idx} className="flex gap-2 items-end mb-2">
                    <div className="flex-1">
                      <Label htmlFor={`track-title-${idx}`}>Title</Label>
                      <Input
                        id={`track-title-${idx}`}
                        value={track.title}
                        onChange={e => {
                          const updated = [...tracks];
                          updated[idx].title = e.target.value;
                          setTracks(updated);
                        }}
                        placeholder={`Track ${idx + 1} title`}
                      />
                    </div>
                    <div className="w-32">
                      <Label htmlFor={`track-duration-${idx}`}>Duration (sec)</Label>
                      <Input
                        id={`track-duration-${idx}`}
                        type="number"
                        value={track.duration ? String(track.duration) : ''}
                        onChange={e => {
                          const updated = [...tracks];
                          const val = e.target.value;
                          updated[idx] = {
                            ...updated[idx],
                            duration: val === '' ? undefined : Number(val),
                            position: idx,
                          };
                          setTracks(updated);
                        }}
                        placeholder="e.g. 210"
                      />
                    </div>
                    <Button
                      type="button"
                      variant="outline"
                      onClick={() => setTracks(tracks.filter((_, i) => i !== idx))}
                      disabled={tracks.length === 1}
                    >
                      Remove
                    </Button>
                  </div>
                ))}
                <Button
                  type="button"
                  variant="outline"
                  className="mt-2"
                  onClick={() =>
                    setTracks([
                      ...tracks,
                      { title: '', duration: undefined, position: tracks.length },
                    ])
                  }
                >
                  Add Track
                </Button>
              </div>
            )}
          </TabsContent>

          <TabsContent value="links" className="space-y-4">
            <div>
              <Label className="text-lg font-semibold">Platform Links</Label>
              <p className="text-sm text-gray-600 mb-4">Add links to streaming platforms</p>

              {links.map((link, index) => (
                <div key={index} className="flex gap-4 items-end">
                  <div className="flex-1">
                    <Label htmlFor={`platform-${index}`}>Platform</Label>
                    <Input
                      id={`platform-${index}`}
                      value={link.platform}
                      onChange={e => updateLink(index, 'platform', e.target.value)}
                      placeholder="Spotify, YouTube, Apple Music, etc."
                    />
                  </div>
                  <div className="flex-2">
                    <Label htmlFor={`url-${index}`}>URL</Label>
                    <Input
                      id={`url-${index}`}
                      value={link.url}
                      onChange={e => updateLink(index, 'url', e.target.value)}
                      placeholder="https://..."
                    />
                  </div>
                  {links.length > 1 && (
                    <Button
                      type="button"
                      variant="outline"
                      onClick={() => removeLinkField(index)}
                      className="mb-0"
                    >
                      Remove
                    </Button>
                  )}
                </div>
              ))}

              <Button type="button" variant="outline" onClick={addLinkField} className="mt-2">
                Add Platform Link
              </Button>
            </div>
          </TabsContent>
        </Tabs>

        <div className="flex justify-end gap-4 mt-8 pt-6 border-t">
          <Button type="button" variant="outline" onClick={() => reset()}>
            Reset Form
          </Button>
          <Button type="submit" disabled={isLoading}>
            {isLoading ? 'Creating...' : 'Create Music'}
          </Button>
        </div>
      </form>
    </div>
  );
}
