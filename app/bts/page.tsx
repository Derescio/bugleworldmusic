'use client';
import React, { useState } from 'react';
import Image from 'next/image';

// You can add or fetch these dynamically if needed
const images = [
  '/images/Bugle_2.png',
  '/images/bugle_stefflondon.png',
  '/images/Screenshot 2025-08-08 225825.png',
  '/images/Screenshot 2025-08-14 185122.png',
  '/images/Screenshot 2025-08-14 185157.png',
  '/images/Screenshot 2025-08-14 185229.png',
  // Add more as needed
];

export default function GalleryPage() {
  const [selected, setSelected] = useState<string | null>(null);

  return (
    <div className="min-h-[70vh] bg-gradient-to-br from-purple-900 via-slate-900 to-black py-12 px-4">
      <h1 className="text-3xl font-bold text-center text-white mb-8">Gallery</h1>
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4 max-w-5xl mx-auto">
        {images.map((src, i) => (
          <button
            key={src}
            className="group relative aspect-square overflow-hidden rounded-lg shadow-lg border-2 border-white/10 hover:scale-105 transition-transform"
            onClick={() => setSelected(src)}
            aria-label={`View image ${i + 1}`}
          >
            <Image
              src={src}
              alt={`Gallery image ${i + 1}`}
              fill
              className="object-cover group-hover:brightness-75 transition-all"
              sizes="(max-width: 768px) 50vw, (max-width: 1200px) 25vw, 20vw"
              priority={i < 4}
            />
          </button>
        ))}
      </div>

      {/* Lightbox Modal */}
      {selected && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm"
          onClick={() => setSelected(null)}
        >
          <div
            className="relative w-full max-w-2xl aspect-video"
            onClick={e => e.stopPropagation()}
          >
            <Image
              src={selected}
              alt="Selected gallery image"
              fill
              className="object-contain rounded-lg shadow-2xl"
              sizes="100vw"
            />
            <button
              className="absolute top-2 right-2 bg-white/80 hover:bg-white text-black rounded-full p-2 shadow"
              onClick={() => setSelected(null)}
              aria-label="Close"
            >
              &times;
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
