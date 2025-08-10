# Database Setup Instructions

## Prerequisites

1. You need to have your Neon database URL ready
2. Sign up for UploadThing at [https://uploadthing.com](https://uploadthing.com) and get your API keys
3. Create a `.env` file in the root directory with your credentials:

```env
# Database
DATABASE_URL="your_neon_database_url_here"

# NextAuth.js (for future authentication)
NEXTAUTH_URL="http://localhost:3000"
NEXTAUTH_SECRET="your_nextauth_secret_here"

# UploadThing (for file uploads)
UPLOADTHING_SECRET="your_uploadthing_secret_here"
UPLOADTHING_APP_ID="your_uploadthing_app_id_here"
```

## Setup Steps

1. **Generate Prisma Client**

   ```bash
   npm run db:generate
   ```

2. **Run Database Migration**

   ```bash
   npm run db:migrate
   ```

   This will create all the tables in your Neon database.

3. **Seed the Database**

   ```bash
   npm run db:seed
   ```

   This will populate your database with:
   - Sample users (regular user and admin)
   - Sample genres (Reggae, Dancehall, Hip Hop)
   - Sample tags (Single, Album, EP)
   - Sample music tracks (Toxicity, Apex, LifeSpan)

4. **Start the Development Server**
   ```bash
   npm run dev
   ```

## Admin Access

Once set up, you can access the admin interface at:

- **Admin Dashboard**: `http://localhost:3000/admin`
- **Create Music**: `http://localhost:3000/admin/music/create`

## Database Management

- **Prisma Studio**: `npm run db:studio` - Visual database browser
- **Reset Database**: `npm run db:reset` - Reset and re-seed database

## What's Been Created

### Database Schema

- **Users**: User accounts with admin/regular roles
- **Music**: Main music table with all track details
- **Genres**: Music genres (many-to-many with music)
- **Tags**: Release types and other tags (many-to-many with music)
- **Links**: Platform streaming links for each track

### Admin Interface

- **Tabbed Dashboard**: Music, Merchandise, and Digital Files management
- **Music Management**:
  - List view with search and filtering by genre/type
  - Tabbed creation form with file upload support
  - **General Info Tab**: Title, description, release date, duration, etc.
  - **Genres Tab**: Multi-select genre assignment
  - **Tags Tab**: Release type and tag selection
  - **Platform Links Tab**: Add Spotify, YouTube, Apple Music links
- **File Upload**: Drag-and-drop image upload using UploadThing

### API Endpoints

- `GET /api/music` - Fetch all music with pagination
- `POST /api/music` - Create new music track
- `GET /api/genres` - Fetch all genres
- `GET /api/tags` - Fetch all tags

## Next Steps

1. Set up your `.env` file with the Neon database URL
2. Run the setup commands above
3. Visit `/admin/music/create` to start adding music!

The admin form handles all the complexity of the normalized database structure - just fill out the tabs and it will properly create all the relationships behind the scenes.
