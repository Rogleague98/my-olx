import React, { useState, useRef } from 'react';
import { useAuth } from '../context/AuthContext';
import { uploadImages } from '../api/upload';
import { createListing, updateListing } from '../api/listings';
import { useNavigate, useParams } from 'react-router-dom';
import { useListings } from '../context/ListingContext';
import { categories, bulgarianCities } from '../constants';
import * as LucideIcons from 'lucide-react';
import { MapPin, Upload, Plus, Edit, Sparkles } from 'lucide-react';
import { Button, Input, Card, Container, LoadingSpinner } from '../components/ui';
import { useToast } from '../toast/ToastProvider';

export default function AddEditListing() {
  const { token, user } = useAuth();
  const { refresh } = useListings();
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [price, setPrice] = useState('');
  const [category, setCategory] = useState('');
  const [subcategory, setSubcategory] = useState('');
  const [location, setLocation] = useState('');
  const [images, setImages] = useState<FileList | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [imagePreview, setImagePreview] = useState<string[]>([]);
  const toast = useToast();

  const navigate = useNavigate();
  const { id } = useParams();

  const [dragActive, setDragActive] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const removeImage = (index: number) => {
    setImagePreview(prev => prev.filter((_, i) => i !== index));
    if (images) {
      const dt = new DataTransfer();
      Array.from(images).forEach((file, i) => {
        if (i !== index) dt.items.add(file);
      });
      setImages(dt.files.length ? dt.files : null);
    }
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files) {
      setImages(files);
      const previews: string[] = [];
      Array.from(files).forEach(file => {
        const reader = new FileReader();
        reader.onload = (e) => {
          previews.push(e.target?.result as string);
          setImagePreview([...previews]);
        };
        reader.readAsDataURL(file);
      });
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    // Validation
    if (!title || !description || !price || !category || !subcategory || !location) {
      setError('Please fill in all required fields.');
      setLoading(false);
      return;
    }

    try {
      let imageUrls: string[] = [];
      if (images && images.length > 0) {
        imageUrls = await uploadImages(images);
      }

      const listingData = {
        title,
        description,
        price: Number(price),
        category,
        subcategory,
        location,
        images: imageUrls,
        seller: user?.id || "",
      };

      if (id) {
        await updateListing(id, listingData, token!);
        await refresh();
        toast.addToast('Listing updated successfully!', 'success');
        navigate('/');
      } else {
        await createListing(
          listingData,
          token!
        );
        await refresh();
        toast.addToast('Listing created successfully!', 'success');
        navigate('/');
      }
    } catch (err: any) {
      setError(err?.message || 'An error occurred. Please try again.');
      toast.addToast('Failed to save listing', 'error');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-[#101624] via-[#1a2236] to-[#0a0e17]">
      <div className="max-w-4xl w-full mx-auto p-8 glass-strong rounded-3xl shadow-xl border border-blue-700 bg-[#23272f]/80 backdrop-blur-xl text-white animate-fade-in">
      <Container className="py-8">
        <Card variant="elevated" className="max-w-2xl mx-auto animate-scale-in relative overflow-hidden">
          {/* Card background decoration */}
            <div className="absolute inset-0 bg-gradient-to-br from-white/10 to-white/70 backdrop-blur-xl"></div>
          <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-primary-500/10 to-secondary-500/10 rounded-full blur-2xl"></div>
          <div className="absolute bottom-0 left-0 w-24 h-24 bg-gradient-to-br from-accent-500/10 to-blush-500/10 rounded-full blur-2xl"></div>
          
          <div className="relative z-10">
            {/* Header */}
            <div className="text-center mb-8">
                <div className="w-20 h-20 bg-gradient-to-r from-[#60a5fa] to-[#FFD700] rounded-none mx-auto mb-6 flex items-center justify-center shadow-xl animate-pulse-glow">
                {id ? <Edit className="w-10 h-10 text-white" /> : <Plus className="w-10 h-10 text-white" />}
              </div>
                <h1 className="text-4xl font-bold bg-gradient-to-r from-[#60a5fa] to-[#FFD700] bg-clip-text text-transparent mb-3">{id ? 'Edit' : 'Create New'} Listing</h1>
                <p className="text-white text-lg">Share your item with the community</p>
              <div className="flex items-center justify-center gap-2 mt-4">
                  <Sparkles className="w-5 h-5 text-white" />
                  <span className="text-sm text-white font-medium">Fast & Easy Listing Creation</span>
                  <Sparkles className="w-5 h-5 text-white" />
              </div>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6">
              {error && (
                  <div className="bg-white/10 border border-white text-white px-4 py-3 rounded-none animate-fade-in flex items-center gap-2">
                    <div className="w-2 h-2 bg-white rounded-none animate-pulse"></div>
                  {error}
                </div>
              )}

              {/* Title */}
              <Input
                label="Listing Title"
                type="text"
                value={title}
                onChange={e => setTitle(e.target.value)}
                placeholder="Enter a descriptive title for your item"
                required
                  className="bg-white/20 text-white placeholder-white border border-white backdrop-blur-sm rounded-none"
              />

              {/* Description */}
              <div className="space-y-2">
                  <label className="block text-sm font-semibold text-white">Description</label>
                <textarea
                    className="w-full px-4 py-3 bg-white/20 text-white placeholder-white backdrop-blur-sm border border-white rounded-none focus:outline-none focus:ring-2 focus:ring-white focus:border-white transition-all duration-300 resize-none"
                  value={description}
                  onChange={e => setDescription(e.target.value)}
                  rows={4}
                  placeholder="Describe your item in detail..."
                  required
                />
              </div>

              {/* Price */}
              <Input
                label="Price"
                type="number"
                value={price}
                onChange={e => setPrice(e.target.value)}
                placeholder="0.00"
                min="0"
                step="0.01"
                required
                  className="bg-white/20 text-white placeholder-white border border-white backdrop-blur-sm rounded-none"
              />

                {/* Category & Subcategory Selection */}
              <div className="space-y-3">
                  <label className="block text-sm font-semibold text-white">Category</label>
                  <div className="relative">
                    {/* Icon for Category */}
                    <svg className="absolute left-3 top-1/2 transform -translate-y-1/2 text-white w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><rect x="3" y="3" width="7" height="7" rx="1"/><rect x="14" y="3" width="7" height="7" rx="1"/><rect x="14" y="14" width="7" height="7" rx="1"/><rect x="3" y="14" width="7" height="7" rx="1"/></svg>
                    <select
                      className="w-full pl-12 pr-4 py-3 bg-white text-black placeholder:text-gray-500 backdrop-blur-sm border border-white/30 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-400 focus:border-primary-400 transition-all duration-300"
                      value={category}
                      onChange={e => {
                        setCategory(e.target.value);
                          setSubcategory('');
                        }}
                      required
                      >
                      <option value="">Select category...</option>
                      {categories.map(cat => (
                        <option key={cat.name} value={cat.name}>{cat.name}</option>
                      ))}
                    </select>
                  </div>
                </div>
                <div className="space-y-3">
                  <label className="block text-sm font-semibold text-white">Subcategory</label>
                  <div className="relative">
                    {/* Icon for Subcategory */}
                    <svg className="absolute left-3 top-1/2 transform -translate-y-1/2 text-white w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path d="M3 6h18M3 12h18M3 18h18"/></svg>
                    <select
                      className="w-full pl-12 pr-4 py-3 bg-white text-black placeholder:text-gray-500 backdrop-blur-sm border border-white/30 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-400 focus:border-primary-400 transition-all duration-300"
                      value={subcategory}
                      onChange={e => setSubcategory(e.target.value)}
                      required
                      disabled={!category}
                    >
                      <option value="">Select subcategory...</option>
                      {category &&
                        categories.find(cat => cat.name === category)?.subcategories.map(sub => (
                          <option key={sub} value={sub}>{sub}</option>
                    ))}
                    </select>
                  </div>
                </div>

              {/* Location */}
                <div className="space-y-3">
                  <label className="block text-sm font-semibold text-white">Location</label>
                <div className="relative">
                    <MapPin className="absolute left-3 top-1/2 transform -translate-y-1/2 text-white w-5 h-5" />
                  <input
                    type="text"
                      className="w-full pl-12 pr-4 py-3 bg-white text-black placeholder:text-gray-500 backdrop-blur-sm border border-white/30 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-400 focus:border-primary-400 transition-all duration-300"
                    value={location}
                    onChange={e => setLocation(e.target.value)}
                    list="city-list"
                    placeholder="Select or type a city..."
                    autoComplete="off"
                    required
                  />
                  <datalist id="city-list">
                    {bulgarianCities.map(city => (
                      <option key={city} value={city} />
                    ))}
                  </datalist>
                </div>
              </div>

              {/* Image Upload */}
              <div className="space-y-3">
                  <label className="block text-sm font-semibold text-white">Images</label>
                  {/* Modern Drag-and-Drop Area */}
                  <div
                    className={`relative flex flex-col items-center justify-center border-2 border-dashed border-white rounded-xl p-8 text-center transition-all duration-300 cursor-pointer bg-white/10 backdrop-blur-md shadow-lg ${dragActive ? 'ring-2 ring-amber-400 border-amber-400' : 'hover:border-amber-400'}`}
                    onDragOver={e => { e.preventDefault(); setDragActive(true); }}
                    onDragLeave={e => { e.preventDefault(); setDragActive(false); }}
                    onDrop={e => {
                      e.preventDefault();
                      setDragActive(false);
                      if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
                        setImages(e.dataTransfer.files);
                        const previews: string[] = [];
                        Array.from(e.dataTransfer.files).forEach(file => {
                          const reader = new FileReader();
                          reader.onload = (ev) => {
                            previews.push(ev.target?.result as string);
                            setImagePreview([...previews]);
                          };
                          reader.readAsDataURL(file);
                        });
                      }
                    }}
                    onClick={() => fileInputRef.current?.click()}
                    tabIndex={0}
                    role="button"
                    aria-label="Upload images"
                  >
                    <Upload className="w-12 h-12 text-white mx-auto mb-3" />
                    <span className="block text-white font-bold text-lg">Drag & drop images here</span>
                    <span className="block text-white/70 text-sm mb-2">or click to upload</span>
                  <input
                    type="file"
                    id="images"
                      name="images"
                      accept="image/*"
                    multiple
                      className="hidden"
                      ref={fileInputRef}
                    onChange={handleImageChange}
                  />
                </div>
                  {/* Image Previews with Remove Buttons */}
                {imagePreview.length > 0 && (
                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 mt-4 animate-fade-in">
                    {imagePreview.map((preview, index) => (
                        <div key={index} className="relative aspect-square rounded-xl overflow-hidden border border-white/30 group">
                        <img src={preview} alt={`Preview ${index + 1}`} className="w-full h-full object-cover" />
                          <button
                            type="button"
                            className="absolute top-2 right-2 bg-black/60 text-white rounded-full p-1 opacity-80 hover:opacity-100 transition"
                            aria-label="Remove image"
                            onClick={e => { e.stopPropagation(); removeImage(index); }}
                          >
                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-5 h-5">
                              <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                            </svg>
                          </button>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* Submit Button */}
              <Button
                type="submit"
                loading={loading}
                className="w-full shadow-xl hover:shadow-2xl transform hover:scale-105 transition-all duration-300"
                variant="solid"
                color="primary"
                icon={id ? Edit : Plus}
              >
                {loading ? 'Saving...' : id ? 'Update Listing' : 'Create Listing'}
              </Button>
            </form>
          </div>
        </Card>
      </Container>
      </div>
    </div>
  );
} 