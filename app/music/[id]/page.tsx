import Image from 'next/image';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { Button } from '../../components/ui/button';
import { getMusicReleaseById, getAllMusicReleases } from '../../lib/data/music';
import { Calendar, Clock, Music, Play, ArrowLeft, ExternalLink } from 'lucide-react';
import NotFound from './not-found';

interface MusicPageProps {
  params: Promise<{
    id: string;
  }>;
}

export async function generateStaticParams() {
  const releases = getAllMusicReleases();
  return releases.map(release => ({
    id: release.id,
  }));
}

export async function generateMetadata({ params }: MusicPageProps) {
  const { id } = await params;
  const release = getMusicReleaseById(id);

  if (!release) {
    return NotFound();
  }

  return {
    title: `${release.title} - Bugle World Music`,
    description: release.description,
    openGraph: {
      title: `${release.title} - Bugle World Music`,
      description: release.description,
      images: [release.image],
    },
  };
}

export default async function MusicPage({ params }: MusicPageProps) {
  const { id } = await params;
  const release = getMusicReleaseById(id);

  if (!release) {
    notFound();
  }

  const releaseDate = new Date(release.releaseDate);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
      <div className="container mx-auto px-4 py-8">
        {/* Back Button */}
        <div className="mb-8">
          <Button asChild variant="ghost" className="text-white hover:bg-white/10">
            <Link href="/music">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Music
            </Link>
          </Button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-start">
          {/* Album Art */}
          <div className="relative">
            <div className="aspect-square relative rounded-2xl overflow-hidden bg-gradient-to-br from-primary/20 to-secondary/30 shadow-2xl">
              <Image
                src={release.image}
                alt={release.title}
                fill
                className="object-cover"
                priority
              />
            </div>
          </div>

          {/* Release Info */}
          <div className="space-y-8">
            <div className="space-y-4">
              <div className="flex items-center gap-2">
                <span className="px-3 py-1 bg-orange-500/20 text-orange-400 rounded-full text-sm font-medium capitalize">
                  {release.type}
                </span>
                <span className="text-white/60 text-sm">•</span>
                <span className="text-white/60 text-sm">{releaseDate.getFullYear()}</span>
              </div>

              <h1 className="text-4xl sm:text-5xl font-bold text-white">{release.title}</h1>

              <p className="text-white/80 text-lg leading-relaxed">{release.description}</p>
            </div>

            {/* Release Details */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="flex items-center text-white/70">
                <Calendar className="h-5 w-5 mr-3 text-orange-400" />
                <div>
                  <div className="text-sm text-white/50">Release Date</div>
                  <div className="font-medium">
                    {releaseDate.toLocaleDateString('en-US', {
                      year: 'numeric',
                      month: 'long',
                      day: 'numeric',
                    })}
                  </div>
                </div>
              </div>

              {release.duration && (
                <div className="flex items-center text-white/70">
                  <Clock className="h-5 w-5 mr-3 text-orange-400" />
                  <div>
                    <div className="text-sm text-white/50">Duration</div>
                    <div className="font-medium">{release.duration}</div>
                  </div>
                </div>
              )}
            </div>

            {/* Genres */}
            <div>
              <h3 className="text-white font-semibold mb-3">Genres</h3>
              <div className="flex flex-wrap gap-2">
                {release.genre.map(genre => (
                  <span
                    key={genre}
                    className="px-3 py-1 bg-white/10 text-white/80 rounded-full text-sm"
                  >
                    {genre}
                  </span>
                ))}
              </div>
            </div>

            {/* Streaming Links */}
            <div>
              <h3 className="text-white font-semibold mb-4">Listen Now</h3>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                {release.streamingLinks.spotify && (
                  <Button asChild className="bg-green-600 hover:bg-green-700">
                    <Link href={release.streamingLinks.spotify} target="_blank">
                      <Play className="h-4 w-4 mr-2" />
                      Spotify
                    </Link>
                  </Button>
                )}
                {release.streamingLinks.appleMusic && (
                  <Button
                    asChild
                    variant="outline"
                    className="border-white/20 text-white hover:bg-white/10"
                  >
                    <Link href={release.streamingLinks.appleMusic} target="_blank">
                      <Music className="h-4 w-4 mr-2" />
                      Apple Music
                    </Link>
                  </Button>
                )}
                {release.streamingLinks.youtube && (
                  <Button asChild className="bg-red-600 hover:bg-red-700">
                    <Link href={release.streamingLinks.youtube} target="_blank">
                      <Play className="h-4 w-4 mr-2" />
                      YouTube
                    </Link>
                  </Button>
                )}
                {release.streamingLinks.amazonMusic && (
                  <Button
                    asChild
                    variant="outline"
                    className="border-white/20 text-white hover:bg-white/10"
                  >
                    <Link href={release.streamingLinks.amazonMusic} target="_blank">
                      <ExternalLink className="h-4 w-4 mr-2" />
                      Amazon Music
                    </Link>
                  </Button>
                )}
                {release.streamingLinks.tidal && (
                  <Button
                    asChild
                    variant="outline"
                    className="border-white/20 text-white hover:bg-white/10"
                  >
                    <Link href={release.streamingLinks.tidal} target="_blank">
                      <ExternalLink className="h-4 w-4 mr-2" />
                      Tidal
                    </Link>
                  </Button>
                )}
              </div>
            </div>

            {/* Track List */}
            {release.tracks && release.tracks.length > 0 && (
              <div>
                <h3 className="text-white font-semibold mb-4">Track List</h3>
                <div className="bg-white/5 rounded-lg p-4">
                  <ol className="space-y-2">
                    {release.tracks.map((track, index) => (
                      <li key={index} className="flex items-center text-white/80">
                        <span className="w-8 text-orange-400 font-medium">
                          {(index + 1).toString().padStart(2, '0')}.
                        </span>
                        <span>{track}</span>
                      </li>
                    ))}
                  </ol>
                </div>
              </div>
            )}

            {/* Additional Info */}
            {(release.label || release.producers) && (
              <div className="pt-6 border-t border-white/10">
                {release.label && (
                  <div className="mb-2">
                    <span className="text-white/50 text-sm">Label: </span>
                    <span className="text-white/80">{release.label}</span>
                  </div>
                )}
                {release.producers && (
                  <div>
                    <span className="text-white/50 text-sm">Producers: </span>
                    <span className="text-white/80">{release.producers.join(', ')}</span>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
