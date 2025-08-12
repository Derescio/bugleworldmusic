'use client';

import { useState, useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Button } from '@/app/components/ui/button';
import { Input } from '@/app/components/ui/input';
import { Textarea } from '@/app/components/ui/textarea';
import { Label } from '@/app/components/ui/label';

const musicFormSchema = z.object({
  title: z.string().min(1, 'Title is required'),
  description: z.string().optional(),
  releaseDate: z.string().optional(),
  duration: z.number().optional(),
  coverImageUrl: z.string().optional(),
  label: z.string().optional(),
});

type MusicFormData = z.infer<typeof musicFormSchema>;

export default function EditMusicPage() {
  const router = useRouter();
  const params = useParams();
  const { id } = params;
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<MusicFormData>({
    resolver: zodResolver(musicFormSchema),
  });

  useEffect(() => {
    const fetMusicById = async () => {
      try {
        const res = await fetch(`/api/music/${id}`);
        if (!res.ok) throw new Error('Failed to fetch music');
        const data = await res.json();
        reset({
          title: data.title,
          description: data.description || '',
          releaseDate: data.releaseDate || '',
          duration: data.duration || undefined,
          coverImageUrl: data.coverImageUrl || '',
          label: data.label || '',
        });
      } catch (err: unknown) {
        const errorMessage = err instanceof Error ? err.message : 'Unknown error';
        setError(errorMessage);
      } finally {
        setLoading(false);
      }
    };
    fetMusicById();
  }, [id, reset]);

  const onSubmit = async (formData: MusicFormData) => {
    setLoading(true);
    setError('');
    try {
      const res = await fetch(`/api/music/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });
      if (!res.ok) throw new Error('Failed to update music');
      router.push('/admin/music');
    } catch (err: unknown) {
      const errorMessage = err instanceof Error ? err.message : 'Unknown error';
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <div className="p-8 text-gray-500">Loading...</div>;
  if (error) return <div className="p-8 text-red-500">{error}</div>;

  return (
    <div className="container mx-auto py-8 px-4 max-w-2xl">
      <h1 className="text-2xl font-bold mb-6">Edit Music</h1>
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        <div>
          <Label htmlFor="title">Title *</Label>
          <Input id="title" {...register('title')} />
          {errors.title && <p className="text-sm text-red-600">{errors.title.message}</p>}
        </div>
        <div>
          <Label htmlFor="label">Label</Label>
          <Input id="label" {...register('label')} />
        </div>
        <div>
          <Label htmlFor="releaseDate">Release Date</Label>
          <Input id="releaseDate" type="date" {...register('releaseDate')} />
        </div>
        <div>
          <Label htmlFor="duration">Duration (seconds)</Label>
          <Input id="duration" type="number" {...register('duration', { valueAsNumber: true })} />
        </div>
        <div>
          <Label htmlFor="coverImageUrl">Cover Image URL</Label>
          <Input id="coverImageUrl" {...register('coverImageUrl')} />
        </div>
        <div>
          <Label htmlFor="description">Description</Label>
          <Textarea id="description" {...register('description')} rows={4} />
        </div>
        <div className="flex gap-4 justify-end">
          <Button type="button" variant="outline" onClick={() => router.back()}>
            Cancel
          </Button>
          <Button type="submit" disabled={loading}>
            {loading ? 'Saving...' : 'Save Changes'}
          </Button>
        </div>
      </form>
    </div>
  );
}
