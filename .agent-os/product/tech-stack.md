# Technical Stack

## Frontend Architecture

- **Application Framework:** Next.js 15.4.6
- **JavaScript Framework:** React 19.1.0
- **TypeScript:** 5.x
- **CSS Framework:** Tailwind CSS 4
- **UI Component Library:** Custom components with shadcn/ui patterns
- **State Management:** Zustand 5.0.7 (for cart) + React Context
- **Form Handling:** React Hook Form 7.62.0 with Hookform Resolvers 5.2.1
- **Validation:** Zod 4.0.17
- **Animation Library:** Framer Motion 12.23.12
- **3D Graphics:** React Three Fiber 9.3.0 + React Three Drei 10.6.1
- **Icons:** Lucide React 0.539.0
- **Fonts Provider:** Google Fonts (Geist Sans, Geist Mono)

## Planned Backend & Database

- **Database System:** PostgreSQL (planned)
- **ORM:** Prisma or Drizzle (to be decided)
- **Content Management:** Sanity CMS (planned for products/music)
- **Authentication:** NextAuth.js (planned for Phase 3)
- **File Storage:** AWS S3 or Cloudinary (planned)
- **Email Service:** SendGrid or Resend (planned)
- **Payment Processing:** Stripe (planned)

## Development Tools

- **Package Manager:** npm
- **Linting:** ESLint 9 with Next.js config
- **Code Repository:** Git (GitHub planned)
- **Build Tool:** Next.js built-in (Turbopack)
- **CSS Processing:** PostCSS with Tailwind CSS 4

## Deployment & Hosting

- **Application Hosting:** Vercel (recommended) or Netlify
- **Database Hosting:** Vercel Postgres, Supabase, or Railway
- **Asset Hosting:** Vercel Edge Network or AWS CloudFront
- **Domain:** Custom domain (to be configured)

## Third-Party Integrations (Planned)

- **Analytics:** Google Analytics 4
- **Music Platforms:** Spotify API, Apple Music API, YouTube API
- **Social Media:** Instagram Basic Display API
- **Maps:** Google Maps API (for venue locations)
- **Email Marketing:** Mailchimp or ConvertKit
- **Monitoring:** Sentry for error tracking

## Current Development Status

- **Phase:** Phase 2 - Core Features Development
- **Environment:** Development (local)
- **Data Layer:** Mock data (transitioning to CMS/database)
- **Testing:** Not yet implemented (planned test suite with Jest/Vitest)
- **CI/CD:** Not yet configured (GitHub Actions planned)

## Architecture Decisions

- **Import Strategy:** Node.js modules (standard Next.js)
- **Styling Approach:** Utility-first with Tailwind CSS
- **Component Architecture:** Modular, reusable components with TypeScript interfaces
- **Data Fetching:** Next.js App Router patterns (server components + client components)
- **State Management:** Minimal global state (Zustand for cart, Context for app-wide state)
- **File Organization:** Feature-based organization within app directory structure
