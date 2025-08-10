'use client';
import Image from 'next/image';
import Link from 'next/link';
import { useState } from 'react';
import { Button } from '../components/ui/button';
import { getAllMusicReleases, getMusicReleasesByType, MusicRelease } from '../lib/data/music';
import { Calendar, Clock, Music, Play } from 'lucide-react';

type FilterType = 'all' | 'album' | 'single' | 'ep';

export default function MusicPage() {
  const allReleases = getAllMusicReleases();
  const albums = getMusicReleasesByType('album');
  const singles = getMusicReleasesByType('single');
  const eps = getMusicReleasesByType('ep');

  const [activeFilter, setActiveFilter] = useState<FilterType>('all');

  // Get filtered releases based on active filter
  const getFilteredReleases = (): MusicRelease[] => {
    switch (activeFilter) {
      case 'album':
        return albums;
      case 'single':
        return singles;
      case 'ep':
        return eps;
      default:
        return allReleases;
    }
  };

  const filteredReleases = getFilteredReleases();

  const ReleaseCard = ({ release }: { release: MusicRelease }) => {
    const releaseDate = new Date(release.releaseDate);

    return (
      <Link href={`/music/${release.id}`} className="group">
        <div className="bg-white/5 backdrop-blur-sm rounded-xl overflow-hidden hover:bg-white/10 transition-all duration-300 hover:scale-105">
          <div className="aspect-square relative">
            <Image
              src={release.image}
              alt={release.title}
              fill
              className="object-cover group-hover:scale-110 transition-transform duration-300"
            />
            <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-all duration-300 flex items-center justify-center">
              <Play className="h-12 w-12 text-white opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
            </div>
          </div>
          <div className="p-4">
            <div className="flex items-center gap-2 mb-2">
              <span className="px-2 py-1 bg-orange-500/20 text-orange-400 rounded text-xs font-medium capitalize">
                {release.type}
              </span>
              <span className="text-white/50 text-xs">{releaseDate.getFullYear()}</span>
            </div>
            <h3 className="text-white font-semibold mb-2 group-hover:text-orange-400 transition-colors">
              {release.title}
            </h3>
            <p className="text-white/70 text-sm line-clamp-2">{release.description}</p>
            {release.duration && (
              <div className="flex items-center mt-3 text-white/50 text-xs">
                <Clock className="h-3 w-3 mr-1" />
                {release.duration}
              </div>
            )}
          </div>
        </div>
      </Link>
    );
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
      {/* Hero Section */}
      <section className="py-16 sm:py-24">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h1 className="text-4xl sm:text-6xl font-bold text-white mb-6">Music Collection</h1>
            <p className="text-white/70 text-lg max-w-3xl mx-auto">
              Explore Bugle&apos;s complete discography featuring conscious reggae, dancehall
              anthems, and spiritual journeys. Each release tells a story of growth, struggle, and
              triumph.
            </p>
          </div>
        </div>
      </section>

      {/* Interactive Gallery */}
      {/* <AlbumGallery /> */}

      {/* All Releases Grid */}
      <section className="py-16 sm:py-24">
        <div className="container mx-auto px-4">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8 gap-4">
            <h2 className="text-3xl sm:text-4xl font-bold text-white">
              {activeFilter === 'all'
                ? 'All Releases'
                : activeFilter === 'album'
                  ? 'Albums'
                  : activeFilter === 'single'
                    ? 'Singles'
                    : 'EPs'}
              <span className="text-orange-400 ml-2">({filteredReleases.length})</span>
            </h2>
            <div className="flex flex-wrap gap-2">
              <Button
                variant={activeFilter === 'all' ? 'default' : 'outline'}
                size="sm"
                className={
                  activeFilter === 'all'
                    ? 'bg-orange-500 hover:bg-orange-600 text-white'
                    : 'border-white/20 text-white hover:bg-white/10'
                }
                onClick={() => setActiveFilter('all')}
              >
                All ({allReleases.length})
              </Button>
              <Button
                variant={activeFilter === 'album' ? 'default' : 'ghost'}
                size="sm"
                className={
                  activeFilter === 'album'
                    ? 'bg-orange-500 hover:bg-orange-600 text-white'
                    : 'text-white/70 hover:bg-white/10'
                }
                onClick={() => setActiveFilter('album')}
              >
                Albums ({albums.length})
              </Button>
              <Button
                variant={activeFilter === 'single' ? 'default' : 'ghost'}
                size="sm"
                className={
                  activeFilter === 'single'
                    ? 'bg-orange-500 hover:bg-orange-600 text-white'
                    : 'text-white/70 hover:bg-white/10'
                }
                onClick={() => setActiveFilter('single')}
              >
                Singles ({singles.length})
              </Button>
              <Button
                variant={activeFilter === 'ep' ? 'default' : 'ghost'}
                size="sm"
                className={
                  activeFilter === 'ep'
                    ? 'bg-orange-500 hover:bg-orange-600 text-white'
                    : 'text-white/70 hover:bg-white/10'
                }
                onClick={() => setActiveFilter('ep')}
              >
                EPs ({eps.length})
              </Button>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 transition-all duration-300">
            {filteredReleases.map((release, index) => (
              <div
                key={release.id}
                className="animate-fadeIn"
                style={{ animationDelay: `${index * 50}ms` }}
              >
                <ReleaseCard release={release} />
              </div>
            ))}
          </div>

          {/* Show message when no results */}
          {filteredReleases.length === 0 && (
            <div className="text-center py-12">
              <Music className="h-16 w-16 text-white/30 mx-auto mb-4" />
              <h3 className="text-white text-xl font-semibold mb-2">No releases found</h3>
              <p className="text-white/60">
                No {activeFilter === 'all' ? 'releases' : activeFilter + 's'} available at the
                moment.
              </p>
            </div>
          )}
        </div>
      </section>

      {/* Featured Sections */}
      <section className="py-16 sm:py-24 bg-black/20">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Albums */}
            <div>
              <h3 className="text-2xl font-bold text-white mb-6 flex items-center">
                <Music className="h-6 w-6 mr-3 text-orange-400" />
                Albums
              </h3>
              <div className="space-y-4">
                {albums.slice(0, 3).map(album => (
                  <Link
                    key={album.id}
                    href={`/music/${album.id}`}
                    className="flex items-center gap-4 p-3 bg-white/5 rounded-lg hover:bg-white/10 transition-colors group"
                  >
                    <div className="w-16 h-16 relative rounded overflow-hidden flex-shrink-0">
                      <Image src={album.image} alt={album.title} fill className="object-cover" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <h4 className="text-white font-medium group-hover:text-orange-400 transition-colors truncate">
                        {album.title}
                      </h4>
                      <p className="text-white/50 text-sm">
                        {new Date(album.releaseDate).getFullYear()}
                      </p>
                    </div>
                  </Link>
                ))}
              </div>
            </div>

            {/* Singles */}
            <div>
              <h3 className="text-2xl font-bold text-white mb-6 flex items-center">
                <Play className="h-6 w-6 mr-3 text-orange-400" />
                Latest Singles
              </h3>
              <div className="space-y-4">
                {singles.slice(0, 3).map(single => (
                  <Link
                    key={single.id}
                    href={`/music/${single.id}`}
                    className="flex items-center gap-4 p-3 bg-white/5 rounded-lg hover:bg-white/10 transition-colors group"
                  >
                    <div className="w-16 h-16 relative rounded overflow-hidden flex-shrink-0">
                      <Image src={single.image} alt={single.title} fill className="object-cover" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <h4 className="text-white font-medium group-hover:text-orange-400 transition-colors truncate">
                        {single.title}
                      </h4>
                      <p className="text-white/50 text-sm">
                        {new Date(single.releaseDate).getFullYear()}
                      </p>
                    </div>
                  </Link>
                ))}
              </div>
            </div>

            {/* EPs */}
            <div>
              <h3 className="text-2xl font-bold text-white mb-6 flex items-center">
                <Calendar className="h-6 w-6 mr-3 text-orange-400" />
                EPs & Collections
              </h3>
              <div className="space-y-4">
                {eps.slice(0, 3).map(ep => (
                  <Link
                    key={ep.id}
                    href={`/music/${ep.id}`}
                    className="flex items-center gap-4 p-3 bg-white/5 rounded-lg hover:bg-white/10 transition-colors group"
                  >
                    <div className="w-16 h-16 relative rounded overflow-hidden flex-shrink-0">
                      <Image src={ep.image} alt={ep.title} fill className="object-cover" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <h4 className="text-white font-medium group-hover:text-orange-400 transition-colors truncate">
                        {ep.title}
                      </h4>
                      <p className="text-white/50 text-sm">
                        {new Date(ep.releaseDate).getFullYear()}
                      </p>
                    </div>
                  </Link>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
