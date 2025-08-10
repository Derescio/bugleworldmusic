import Image from 'next/image';
import Link from 'next/link';
import { Button } from './components/ui/button';
import { Input } from './components/ui/input';
import { Calendar, Music, Users } from 'lucide-react';
import { Hero } from './components/Hero';
import AlbumGallery from './components/AlbumGallery';
// Mock data - will be replaced with real data later
const featuredEvents = [
  {
    id: '1',
    title: 'Live at Madison Square Garden',
    date: '2024-03-15',
    venue: 'Madison Square Garden',
    location: 'New York, NY',
    ticketUrl: '#',
    image: '/images/Bugle_1.png',
  },
  {
    id: '2',
    title: 'Summer Music Festival',
    date: '2024-06-20',
    venue: 'Central Park',
    location: 'New York, NY',
    ticketUrl: '#',
    image: '/images/Bugle_2.png',
  },
];

const latestReleases = [
  {
    id: '1',
    title: "New Single - 'Rising Up'",
    type: 'single' as const,
    releaseDate: '2024-02-01',
    image: '/images/Bugle_1.png',
    streamingLinks: {
      spotify: '#',
      appleMusic: '#',
      youtube: '#',
    },
  },
];

export default function Home() {
  return (
    <div className="flex flex-col">
      {/* Hero Section with Video Background */}
      <Hero />

      {/* Album Gallery */}
      <AlbumGallery />

      {/* Featured Events */}
      <section className="py-16 sm:py-24">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl sm:text-4xl font-bold mb-4">Upcoming Shows</h2>
            <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
              Don&apos;t miss out on the live experience. Check out our upcoming performances and
              get your tickets now.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
            {featuredEvents.map(event => (
              <div
                key={event.id}
                className="bg-card rounded-lg overflow-hidden shadow-lg hover:shadow-xl transition-shadow"
              >
                <div className="aspect-video relative">
                  <Image src={event.image} alt={event.title} fill className="object-cover" />
                </div>
                <div className="p-6">
                  <h3 className="text-xl font-semibold mb-2">{event.title}</h3>
                  <p className="text-muted-foreground mb-2">{event.venue}</p>
                  <p className="text-muted-foreground mb-4">{event.location}</p>
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-muted-foreground">
                      {new Date(event.date).toLocaleDateString()}
                    </span>
                    <Button asChild>
                      <Link href={event.ticketUrl}>Get Tickets</Link>
                    </Button>
                  </div>
                </div>
              </div>
            ))}
          </div>

          <div className="text-center">
            <Button variant="outline" asChild>
              <Link href="/shows">
                <Calendar className="mr-2 h-4 w-4" />
                View All Shows
              </Link>
            </Button>
          </div>
        </div>
      </section>

      {/* Latest Releases */}
      <section className="py-16 sm:py-24 bg-muted/30">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl sm:text-4xl font-bold mb-4">Latest Releases</h2>
            <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
              Stream the newest tracks and discover the sound that&apos;s taking the world by storm.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-8">
            {latestReleases.map(release => (
              <div
                key={release.id}
                className="bg-background rounded-lg overflow-hidden shadow-lg hover:shadow-xl transition-shadow"
              >
                <div className="aspect-square relative">
                  <Image src={release.image} alt={release.title} fill className="object-cover" />
                </div>
                <div className="p-6">
                  <h3 className="text-xl font-semibold mb-2">{release.title}</h3>
                  <p className="text-muted-foreground mb-4 capitalize">{release.type}</p>
                  <div className="flex gap-2">
                    <Button size="sm" asChild>
                      <Link href={release.streamingLinks.spotify || '#'}>
                        <Music className="mr-2 h-4 w-4" />
                        Spotify
                      </Link>
                    </Button>
                    <Button size="sm" variant="outline" asChild>
                      <Link href={release.streamingLinks.appleMusic || '#'}>Apple Music</Link>
                    </Button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Newsletter Signup */}
      <section className="py-16 sm:py-24">
        <div className="container mx-auto px-4">
          <div className="max-w-2xl mx-auto text-center">
            <div className="mb-8">
              <Users className="h-12 w-12 mx-auto mb-4 text-primary" />
              <h2 className="text-3xl sm:text-4xl font-bold mb-4">Stay Connected</h2>
              <p className="text-muted-foreground text-lg">
                Join our mailing list to get the latest updates on new releases, tour dates, and
                exclusive content.
              </p>
            </div>

            <form className="flex flex-col sm:flex-row gap-4 max-w-md mx-auto">
              <Input type="email" placeholder="Enter your email" className="flex-1" required />
              <Button type="submit">Subscribe</Button>
            </form>

            <p className="text-sm text-muted-foreground mt-4">
              We respect your privacy. Unsubscribe at any time.
            </p>
          </div>
        </div>
      </section>
    </div>
  );
}
