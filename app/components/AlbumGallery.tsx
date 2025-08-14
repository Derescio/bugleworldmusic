'use client';
import dynamic from 'next/dynamic';
import Link from 'next/link';

import { Button } from './ui/button';
import { Music } from 'lucide-react';
import { getAllMusicReleases } from '../lib/data/music';

const CircularGallery = dynamic(() => import('./CircularGallery'), {
  ssr: false,
});

// Get album data from the music data
const musicReleases = getAllMusicReleases();
const albumItems = musicReleases.map(release => ({
  image: release.image,
  text: release.title,
  id: release.id,
  url: `/music/${release.id}`, // Add direct URL for navigation
}));

export default function AlbumGallery() {
  return (
    <section className="py-16 sm:py-24 bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-3xl sm:text-4xl font-bold text-white mb-4">Albums & Releases</h2>
          <p className="text-white/70 text-lg max-w-2xl mx-auto">
            Explore Bugle&apos;s musical journey through his acclaimed albums and chart-topping
            releases.
            <br />
            <span className="text-orange-400 font-medium">Click anywhere to explore all music</span>
          </p>
        </div>

        <div className="relative">
          <div style={{ height: '600px', position: 'relative' }}>
            <CircularGallery
              items={albumItems}
              bend={3}
              textColor="#ffffff"
              borderRadius={0.05}
              scrollEase={0.02}
              font="bold 24px Figtree"
              scrollSpeed={1.5}
            />
          </div>

          {/* Instructions & CTA */}
          <div className="text-center mt-8 space-y-4">
            <p className="text-white/60 text-sm">
              Scroll horizontally or drag to explore albums • Click anywhere to view all music
            </p>
            <div className="flex  flex-col sm:flex-row gap-4 justify-center items-center">
              <Button
                asChild
                size="lg"
                className=" bg-gradient-to-r from-orange-500 to-red-600 hover:from-orange-600 hover:to-red-700 text-white px-8 py-3 shadow-xl"
              >
                <Link href="/music" className="flex items-center ">
                  <Music className="mr-2 h-5 w-5" />
                  View All Music
                </Link>
              </Button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
