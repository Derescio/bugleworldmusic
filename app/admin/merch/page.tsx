'use client';

import { useState, useEffect } from 'react';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import Image from 'next/image';
import Select from 'react-select';
import { Button } from '../../components/ui/button';
import { Input } from '../../components/ui/input';
import { Textarea } from '../../components/ui/textarea';
import { Label } from '../../components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../../components/ui/tabs';
import { UploadDropzone } from '../../lib/uploadthing';

// Form schema for merchandise
const merchandiseFormSchema = z.object({
  name: z.string().min(1, 'Name is required'),
  price: z.number().min(0, 'Price must be positive'),
  description: z.string().optional(),
  colors: z.array(z.string()).min(1, 'At least one color is required'),
  sizes: z.array(z.string()).min(1, 'At least one size is required'),
  isActive: z.boolean().default(true),
});

interface Merchandise {
  id: number;
  name: string;
  price: number;
  description: string | null;
  colors: string[];
  sizes: string[];
  imageUrls: string[];
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

interface MerchandiseOptions {
  sizes: string[];
  colors: string[];
}

export default function MerchandisePage() {
  const [merchandise, setMerchandise] = useState<Merchandise[]>([]);
  const [options, setOptions] = useState<MerchandiseOptions>({ sizes: [], colors: [] });
  const [isLoading, setIsLoading] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [uploadedImageUrls, setUploadedImageUrls] = useState<string[]>([]);
  const [isActive, setIsActive] = useState(true);

  const {
    register,
    handleSubmit,
    control,
    formState: { errors },
    reset,
  } = useForm({
    resolver: zodResolver(merchandiseFormSchema),
    defaultValues: {
      name: '',
      price: 0,
      description: '',
      colors: [],
      sizes: [],
      isActive: true,
    },
  });

  // Fetch merchandise and options on component mount
  useEffect(() => {
    fetchMerchandise();
    fetchOptions();
  }, []);

  const fetchMerchandise = async () => {
    setIsLoading(true);
    try {
      const response = await fetch('/api/merchandise');
      if (response.ok) {
        const data = await response.json();
        setMerchandise(data.merchandise);
      } else {
        console.error('Failed to fetch merchandise');
      }
    } catch (error) {
      console.error('Error fetching merchandise:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const fetchOptions = async () => {
    try {
      const response = await fetch('/merchandise-options.json');
      if (response.ok) {
        const data = await response.json();
        setOptions(data);
      } else {
        console.error('Failed to fetch options');
      }
    } catch (error) {
      console.error('Error fetching options:', error);
    }
  };

  const onSubmit = async (data: z.infer<typeof merchandiseFormSchema>) => {
    if (uploadedImageUrls.length === 0) {
      alert('Please upload at least one image');
      return;
    }

    setIsSubmitting(true);
    try {
      const formData = {
        ...data,
        price: Number(data.price),
        imageUrls: uploadedImageUrls,
        isActive,
      };

      const response = await fetch('/api/merchandise', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        const result = await response.json();
        console.log('Merchandise created:', result);
        alert('Merchandise created successfully!');
        reset();
        setUploadedImageUrls([]);
        setIsActive(true);
        fetchMerchandise(); // Refresh the merchandise list
      } else {
        const error = await response.json();
        console.error('Error creating merchandise:', error);
        alert('Error creating merchandise: ' + (error.error || 'Unknown error'));
      }
    } catch (error) {
      console.error('Error:', error);
      alert('Error creating merchandise');
    } finally {
      setIsSubmitting(false);
    }
  };

  const removeImage = (index: number) => {
    setUploadedImageUrls(uploadedImageUrls.filter((_, i) => i !== index));
  };

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
    }).format(price);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-semibold text-gray-900">Merchandise Management</h2>
          <p className="text-sm text-gray-600">Create and manage your merchandise catalog</p>
        </div>
      </div>

      <Tabs defaultValue="create" className="space-y-6">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="create">Create New Item</TabsTrigger>
          <TabsTrigger value="view">View All Items</TabsTrigger>
        </TabsList>

        <TabsContent value="create" className="space-y-6">
          <div className="bg-white shadow rounded-lg p-6">
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label htmlFor="name">Product Name *</Label>
                  <Input
                    id="name"
                    {...register('name')}
                    placeholder="e.g., Bugle World Music T-Shirt"
                    required
                  />
                  {errors.name && <p className="text-sm text-red-600">{errors.name.message}</p>}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="price">Price (USD) *</Label>
                  <Input
                    id="price"
                    type="number"
                    step="0.01"
                    min="0"
                    {...register('price', { valueAsNumber: true })}
                    placeholder="29.99"
                    required
                  />
                  {errors.price && <p className="text-sm text-red-600">{errors.price.message}</p>}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="colors">Colors *</Label>
                  <Controller
                    name="colors"
                    control={control}
                    render={({ field }) => (
                      <Select
                        isMulti
                        options={options.colors.map(color => ({ value: color, label: color }))}
                        value={field.value.map(value => ({ value, label: value }))}
                        onChange={selected => {
                          const values = selected ? selected.map(opt => opt.value) : [];
                          field.onChange(values);
                        }}
                        placeholder="Select colors..."
                        className="react-select-container"
                        classNamePrefix="react-select"
                        styles={{
                          control: base => ({
                            ...base,
                            minHeight: '42px',
                            borderColor: errors.colors ? '#dc2626' : '#d1d5db',
                            '&:hover': {
                              borderColor: errors.colors ? '#dc2626' : '#9ca3af',
                            },
                          }),
                        }}
                      />
                    )}
                  />
                  {errors.colors && <p className="text-sm text-red-600">{errors.colors.message}</p>}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="sizes">Sizes *</Label>
                  <Controller
                    name="sizes"
                    control={control}
                    render={({ field }) => (
                      <Select
                        isMulti
                        options={options.sizes.map(size => ({ value: size, label: size }))}
                        value={field.value.map(value => ({ value, label: value }))}
                        onChange={selected => {
                          const values = selected ? selected.map(opt => opt.value) : [];
                          field.onChange(values);
                        }}
                        placeholder="Select sizes..."
                        className="react-select-container"
                        classNamePrefix="react-select"
                        styles={{
                          control: base => ({
                            ...base,
                            minHeight: '42px',
                            borderColor: errors.sizes ? '#dc2626' : '#d1d5db',
                            '&:hover': {
                              borderColor: errors.sizes ? '#dc2626' : '#9ca3af',
                            },
                          }),
                        }}
                      />
                    )}
                  />
                  {errors.sizes && <p className="text-sm text-red-600">{errors.sizes.message}</p>}
                </div>

                <div className="space-y-2 md:col-span-2">
                  <Label htmlFor="description">Description</Label>
                  <Textarea
                    id="description"
                    {...register('description')}
                    placeholder="Product description..."
                    rows={3}
                  />
                </div>

                {/* isActive toggle */}
                <div className="space-y-2 md:col-span-2 flex items-center gap-4">
                  <Label htmlFor="isActive">Active</Label>
                  <input
                    id="isActive"
                    type="checkbox"
                    checked={isActive}
                    onChange={e => setIsActive(e.target.checked)}
                    className="h-5 w-5 accent-green-600"
                  />
                  <span className="text-sm text-gray-500">
                    (Toggle to set if this item is active/visible)
                  </span>
                </div>

                {/* Image Upload Section */}
                <div className="space-y-4 md:col-span-2">
                  <Label>Product Images *</Label>
                  <p className="text-sm text-gray-600 mb-4">
                    Upload one or more images for this product
                  </p>

                  {uploadedImageUrls.length > 0 && (
                    <div className="space-y-4">
                      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                        {uploadedImageUrls.map((url, index) => (
                          <div key={index} className="relative group">
                            <Image
                              src={url}
                              alt={`Product image ${index + 1}`}
                              className="h-24 w-24 rounded-md object-cover"
                              width={96}
                              height={96}
                            />
                            <button
                              type="button"
                              onClick={() => removeImage(index)}
                              className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center text-sm opacity-0 group-hover:opacity-100 transition-opacity"
                            >
                              ×
                            </button>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  <div className="space-y-4">
                    <UploadDropzone
                      endpoint="imageUploader"
                      onClientUploadComplete={res => {
                        if (res) {
                          const newUrls = res.map(file => file.url);
                          setUploadedImageUrls(prev => [...prev, ...newUrls]);
                        }
                      }}
                      onUploadError={(error: Error) => {
                        alert(`Upload Error: ${error.message}`);
                      }}
                    />
                    <div className="text-center text-sm text-gray-500">
                      {uploadedImageUrls.length === 0
                        ? 'Upload at least one image to continue'
                        : `${uploadedImageUrls.length} image(s) uploaded`}
                    </div>
                  </div>
                </div>
              </div>

              <div className="flex justify-end gap-4 pt-6 border-t">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => {
                    reset({
                      name: '',
                      price: 0,
                      description: '',
                      colors: [],
                      sizes: [],
                      isActive: true,
                    });
                    setUploadedImageUrls([]);
                    setIsActive(true);
                  }}
                >
                  Reset Form
                </Button>
                <Button type="submit" disabled={isSubmitting || uploadedImageUrls.length === 0}>
                  {isSubmitting ? 'Creating Item...' : 'Create Item'}
                </Button>
              </div>
            </form>
          </div>
        </TabsContent>

        <TabsContent value="view" className="space-y-6">
          <div className="bg-white shadow rounded-lg">
            <div className="px-6 py-4 border-b border-gray-200">
              <h3 className="text-lg font-medium text-gray-900">All Merchandise Items</h3>
            </div>

            {isLoading ? (
              <div className="p-6 text-center">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900 mx-auto"></div>
                <p className="mt-2 text-sm text-gray-600">Loading merchandise...</p>
              </div>
            ) : merchandise.length === 0 ? (
              <div className="p-6 text-center">
                <p className="text-gray-500">No merchandise found. Create your first item above!</p>
              </div>
            ) : (
              <div className="overflow-hidden">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Product
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Details
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Price
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Status
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Created
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {merchandise.map(item => (
                      <tr key={item.id} className="hover:bg-gray-50">
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex items-center">
                            {item.imageUrls.length > 0 && (
                              <Image
                                src={item.imageUrls[0]}
                                alt={item.name}
                                className="h-12 w-12 rounded-md object-cover mr-4"
                                width={48}
                                height={48}
                              />
                            )}
                            <div>
                              <div className="text-sm font-medium text-gray-900">{item.name}</div>
                              <div className="text-sm text-gray-500">{item.description}</div>
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm text-gray-900">
                            <span className="font-medium">Colors:</span> {item.colors.join(', ')}
                          </div>
                          <div className="text-sm text-gray-900">
                            <span className="font-medium">Sizes:</span> {item.sizes.join(', ')}
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 font-medium">
                          {formatPrice(item.price)}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span
                            className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                              item.isActive
                                ? 'bg-green-100 text-green-800'
                                : 'bg-red-100 text-red-800'
                            }`}
                          >
                            {item.isActive ? 'Active' : 'Inactive'}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {formatDate(item.createdAt)}
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
