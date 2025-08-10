import Image from 'next/image';
import { Button } from '../components/ui/button';
import { Download, Award, Calendar, MapPin } from 'lucide-react';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'About',
  description: 'Learn about Bugle World Music - biography, career highlights, and press resources.',
};

// Mock data - will be replaced with real data later
const careerHighlights = [
  {
    year: '2020',
    title: 'Debut Album Release',
    description: "Released first studio album 'Rising Rhythms' to critical acclaim",
  },
  {
    year: '2021',
    title: 'International Tour',
    description: 'Completed successful 25-city international tour across North America and Europe',
  },
  {
    year: '2022',
    title: 'Music Awards Recognition',
    description: 'Nominated for Best New Artist at the International Music Awards',
  },
  {
    year: '2023',
    title: 'Collaboration Success',
    description: 'Featured collaboration reached #1 on streaming charts',
  },
  {
    year: '2024',
    title: 'Latest Release',
    description: "New single 'Rising Up' breaks streaming records in first week",
  },
];

const pressKitItems = [
  {
    title: 'High-Resolution Photos',
    description: 'Professional press photos in various formats',
    fileSize: '25 MB',
    type: 'image' as const,
  },
  {
    title: 'Artist Biography',
    description: 'Complete professional biography and fact sheet',
    fileSize: '2 MB',
    type: 'document' as const,
  },
  {
    title: 'Technical Rider',
    description: 'Stage and technical requirements for live performances',
    fileSize: '1.5 MB',
    type: 'document' as const,
  },
  {
    title: 'Promotional Video',
    description: 'Latest promotional video and behind-the-scenes footage',
    fileSize: '150 MB',
    type: 'video' as const,
  },
];

export default function AboutPage() {
  return (
    <div className="flex flex-col">
      {/* Hero Section */}
      <section className="relative py-24 sm:py-32 bg-gradient-to-br from-primary/5 to-secondary/10">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div className="order-2 lg:order-1">
              <div className="aspect-square relative rounded-2xl overflow-hidden">
                <Image
                  src="/images/Bugle_2.png"
                  alt="Bugle World Music Artist"
                  fill
                  className="object-cover"
                  priority
                />
              </div>
            </div>

            <div className="order-1 lg:order-2 space-y-6">
              <div>
                <h1 className="text-4xl sm:text-5xl font-bold tracking-tight mb-4">
                  About Bugle World Music
                </h1>
                <p className="text-xl text-muted-foreground">
                  Authentic music that transcends boundaries and connects souls across the globe.
                </p>
              </div>

              <div className="flex flex-col sm:flex-row gap-4">
                <Button size="lg">
                  <Download className="mr-2 h-5 w-5" />
                  Download Press Kit
                </Button>
                <Button variant="outline" size="lg">
                  <Calendar className="mr-2 h-5 w-5" />
                  Book Performance
                </Button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Biography Section */}
      <section className="py-16 sm:py-24">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-3xl sm:text-4xl font-bold mb-8 text-center">Artist Biography</h2>

            <div className="prose prose-lg max-w-none text-muted-foreground space-y-6">
              <p>
                Bugle World Music represents the evolution of contemporary sound, blending
                traditional rhythms with modern innovation to create music that speaks to the heart
                of diverse audiences worldwide. Born from a passion for authentic expression and
                cultural fusion, this musical journey began with a simple mission: to create music
                that moves both body and soul.
              </p>

              <p>
                The artistic vision behind Bugle World Music emerged from years of studying various
                musical traditions, from reggae and dancehall to hip-hop and R&B. This rich
                foundation has allowed for the creation of a unique sound that honors the past while
                boldly stepping into the future of music.
              </p>

              <p>
                With a commitment to lyrical depth and musical excellence, Bugle World Music has
                garnered attention from fans and critics alike. Each release tells a story, whether
                it&apos;s about personal growth, social consciousness, or the universal language of
                love and unity that music provides.
              </p>

              <p>
                The live performance experience is where Bugle World Music truly comes alive. Known
                for high-energy shows that blend intimate storytelling with explosive musical
                moments, audiences leave feeling not just entertained, but inspired and connected to
                something larger than themselves.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Career Timeline */}
      <section className="py-16 sm:py-24 bg-muted/30">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-3xl sm:text-4xl font-bold mb-12 text-center">Career Highlights</h2>

            <div className="space-y-8">
              {careerHighlights.map((highlight, index) => (
                <div key={highlight.year} className="flex gap-6 items-start">
                  <div className="flex flex-col items-center">
                    <div className="w-12 h-12 rounded-full bg-primary text-primary-foreground flex items-center justify-center font-bold">
                      {highlight.year.slice(-2)}
                    </div>
                    {index < careerHighlights.length - 1 && (
                      <div className="w-0.5 h-16 bg-border mt-4"></div>
                    )}
                  </div>

                  <div className="flex-1 pb-8">
                    <div className="bg-background rounded-lg p-6 shadow-sm">
                      <div className="flex items-center gap-2 mb-2">
                        <span className="text-sm font-medium text-muted-foreground">
                          {highlight.year}
                        </span>
                        <Award className="h-4 w-4 text-primary" />
                      </div>
                      <h3 className="text-xl font-semibold mb-2">{highlight.title}</h3>
                      <p className="text-muted-foreground">{highlight.description}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Press Kit Section */}
      <section className="py-16 sm:py-24">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <div className="text-center mb-12">
              <h2 className="text-3xl sm:text-4xl font-bold mb-4">Press Kit & Resources</h2>
              <p className="text-muted-foreground text-lg">
                Professional resources for media, venues, and industry professionals.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {pressKitItems.map((item, index) => (
                <div
                  key={index}
                  className="bg-card rounded-lg p-6 border hover:shadow-md transition-shadow"
                >
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex items-center gap-3">
                      {item.type === 'image' && (
                        <Image
                          className="h-6 w-6 text-primary"
                          width={24}
                          height={24}
                          src="/images/Bugle_1.png"
                          alt=""
                        />
                      )}
                      {item.type === 'document' && <Download className="h-6 w-6 text-primary" />}
                      {item.type === 'video' && <Calendar className="h-6 w-6 text-primary" />}
                      <div>
                        <h3 className="font-semibold">{item.title}</h3>
                        <p className="text-sm text-muted-foreground">{item.fileSize}</p>
                      </div>
                    </div>
                  </div>

                  <p className="text-muted-foreground mb-4">{item.description}</p>

                  <Button size="sm" className="w-full">
                    <Download className="mr-2 h-4 w-4" />
                    Download
                  </Button>
                </div>
              ))}
            </div>

            <div className="mt-12 text-center">
              <div className="bg-muted/50 rounded-lg p-8">
                <h3 className="text-xl font-semibold mb-4">Need Something Specific?</h3>
                <p className="text-muted-foreground mb-6">
                  For custom press materials, interview requests, or booking inquiries, please
                  contact our management team.
                </p>
                <div className="flex flex-col sm:flex-row gap-4 justify-center">
                  <Button>
                    <MapPin className="mr-2 h-4 w-4" />
                    Contact Management
                  </Button>
                  <Button variant="outline">
                    <Calendar className="mr-2 h-4 w-4" />
                    Booking Inquiry
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
