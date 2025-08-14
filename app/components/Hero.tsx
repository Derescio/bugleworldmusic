'use client';

import Image from 'next/image';
import { Button } from './ui/button';
import { useState, useRef } from 'react';
import { Calendar, Music, Volume2, VolumeX } from 'lucide-react';
import Link from 'next/link';

export function Hero() {
  const [isMuted, setIsMuted] = useState(true);
  const videoRef = useRef<HTMLVideoElement>(null);

  const toggleSound = () => {
    if (videoRef.current) {
      videoRef.current.muted = !videoRef.current.muted;
      setIsMuted(videoRef.current.muted);
    }
  };

  return (
    <>
      <section className="relative min-h-screen flex items-center justify-center overflow-hidden bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
        {/* Background Video */}
        <div className="absolute inset-0 w-full h-full">
          <video
            ref={videoRef}
            autoPlay
            muted
            loop
            playsInline
            className="absolute inset-0 w-full h-full object-cover"
          >
            <source
              src="https://gz7g5ew6dp.ufs.sh/f/lkr2dvBPbLaAd5aL9vMCIxnwEMRLgoseNjV6BF1X58h7tOvu"
              type="video/mp4"
            />
            Your browser does not support the video tag.
          </video>
        </div>

        {/* Dark overlay for better text readability */}
        <div className="absolute inset-0 bg-black/40" />

        {/* Content */}
        <div className="relative z-10 container mx-auto px-4">
          <div className="flex flex-col items-center justify-center text-center space-y-12">
            {/* Main Hero Content */}
            <div className="space-y-8 max-w-5xl">
              <div className="space-y-6">
                {/* Animated Music Stats */}
                <div className="flex justify-center items-center gap-8 mb-8 text-white/80">
                  <div className="text-center">
                    <div className="text-3xl font-bold text-orange-400">5M+</div>
                    <div className="text-sm">Global Streams</div>
                  </div>
                  <div className="text-center">
                    <div className="text-3xl font-bold text-orange-400">120+</div>
                    <div className="text-sm">Countries Reached</div>
                  </div>
                  <div className="text-center">
                    <div className="text-3xl font-bold text-orange-400">400k+</div>
                    <div className="text-sm">Monthly Listeners</div>
                  </div>
                </div>

                <h1 className="text-5xl sm:text-8xl font-bold text-white leading-tight">
                  Music That{' '}
                  <span className="block bg-gradient-to-r from-orange-400 to-yellow-500 bg-clip-text text-transparent">
                    Moves Souls
                  </span>
                </h1>

                <p className="text-2xl sm:text-3xl text-white/90 max-w-4xl mx-auto leading-relaxed">
                  From the heart of reggae to the pulse of the world.
                  <span className="block mt-2 text-orange-400 font-semibold">
                    Bugle&apos;s sound transcends borders and unites cultures.
                  </span>
                </p>
              </div>
            </div>

            {/* Floating Artist Card */}
            <div className="relative">
              <div className="bg-white/10 backdrop-blur-lg rounded-3xl p-8 shadow-2xl border border-white/20 max-w-md mx-auto">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-6">
                    <div className="relative w-20 h-20 rounded-full overflow-hidden ring-4 ring-orange-400/50">
                      <Image
                        src="/images/Bugle_1.png"
                        alt="Bugle"
                        fill
                        className="object-cover"
                        priority
                      />
                    </div>
                    <div className="text-left">
                      <h3 className="text-2xl font-bold text-white">Bugle</h3>
                      <p className="text-orange-400 font-semibold">Reggae Icon</p>
                      <div className="flex items-center mt-2">
                        <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse mr-2"></div>
                        <span className="text-white/70 text-sm">Now Playing Worldwide</span>
                      </div>
                    </div>
                  </div>

                  {/* Sound Control Button */}
                  <button
                    onClick={toggleSound}
                    className="p-3 rounded-full bg-orange-500/20 hover:bg-orange-500/30 border border-orange-400/30 transition-all duration-300 group"
                    aria-label={isMuted ? 'Unmute video' : 'Mute video'}
                  >
                    {isMuted ? (
                      <VolumeX className="h-6 w-6 text-orange-400 group-hover:text-orange-300" />
                    ) : (
                      <Volume2 className="h-6 w-6 text-orange-400 group-hover:text-orange-300" />
                    )}
                  </button>
                </div>

                {/* Mini Music Visualizer */}
                <div className="flex items-center justify-center space-x-1 mt-6">
                  {[25, 15, 35, 20, 30, 12, 28, 18, 32, 22, 26, 16].map((height, i) => (
                    <div
                      key={i}
                      className={`bg-gradient-to-t from-orange-500 to-yellow-400 rounded-full transition-opacity duration-300 ${
                        isMuted ? 'animate-pulse opacity-50' : 'animate-pulse opacity-100'
                      }`}
                      style={{
                        width: '4px',
                        height: `${height}px`,
                        animationDelay: `${i * 0.1}s`,
                        animationDuration: `${0.6 + (i % 3) * 0.2}s`,
                      }}
                    />
                  ))}
                </div>

                {/* Sound Status Text */}
                <div className="text-center mt-3">
                  <span className="text-white/60 text-xs">
                    {isMuted ? 'Click to enable sound' : 'Sound is on'}
                  </span>
                </div>
              </div>
            </div>
            <div className="flex flex-col sm:flex-row gap-6 justify-center items-center mb-4">
              <Link href="/music">
                <Button
                  size="lg"
                  className="bg-gradient-to-r from-orange-500 to-red-600 hover:from-orange-600 hover:to-red-700 text-white px-10 py-4 text-xl font-semibold shadow-2xl transform hover:scale-105 transition-all duration-300"
                >
                  <Music className="mr-3 h-6 w-6" />
                  Listen Now
                </Button>
              </Link>
              <Link href="/shows">
                <Button
                  variant="outline"
                  size="lg"
                  className="border-2 border-white/30 text-black hover:bg-white/10 px-10 py-4 text-xl font-semibold backdrop-blur-sm"
                >
                  <Calendar className="mr-3 h-6 w-6" />
                  Tour Dates
                </Button>
              </Link>
            </div>
          </div>
        </div>

        {/* Scroll indicator */}
        {/* <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 animate-bounce">
          <div className="w-6 h-10 border-2 border-white/50 rounded-full flex justify-center">
            <div className="w-1 h-3 bg-white/50 rounded-full mt-2 animate-pulse"></div>
          </div>
        </div> */}
      </section>
    </>
  );
}
