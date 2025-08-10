import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Starting database seed...');

  // Create users
  const regularUser = await prisma.user.upsert({
    where: { email: 'fan@example.com' },
    update: {},
    create: {
      email: 'fan@example.com',
      name: 'Regular Fan',
      role: 'USER',
    },
  });

  const adminUser = await prisma.user.upsert({
    where: { email: 'admin@bugleworldmusic.com' },
    update: {},
    create: {
      email: 'admin@bugleworldmusic.com',
      name: 'Bugle Admin',
      role: 'ADMIN',
    },
  });

  console.log('✅ Users created:', { regularUser, adminUser });

  // Create genres
  const reggaeGenre = await prisma.genre.upsert({
    where: { name: 'Reggae' },
    update: {},
    create: { name: 'Reggae' },
  });

  const dancehallGenre = await prisma.genre.upsert({
    where: { name: 'Dancehall' },
    update: {},
    create: { name: 'Dancehall' },
  });

  const hipHopGenre = await prisma.genre.upsert({
    where: { name: 'Hip Hop' },
    update: {},
    create: { name: 'Hip Hop' },
  });

  console.log('✅ Genres created');

  // Create tags
  const singleTag = await prisma.tag.upsert({
    where: { name: 'Single' },
    update: {},
    create: { name: 'Single' },
  });

  const albumTag = await prisma.tag.upsert({
    where: { name: 'Album' },
    update: {},
    create: { name: 'Album' },
  });

  await prisma.tag.upsert({
    where: { name: 'EP' },
    update: {},
    create: { name: 'EP' },
  });

  console.log('✅ Tags created');

  // Create sample music tracks
  const toxicityTrack = await prisma.music.upsert({
    where: { id: 'toxicity-track' },
    update: {},
    create: {
      id: 'toxicity-track',
      title: 'Toxicity',
      description:
        'A powerful reggae track exploring themes of social consciousness and personal growth.',
      releaseDate: new Date('2023-06-15'),
      duration: 245, // 4:05 in seconds
      coverImageUrl: '/images/Albums/Toxicity.png',
      label: 'Bugle World Music',
      genres: {
        create: [
          { genre: { connect: { id: reggaeGenre.id } } },
          { genre: { connect: { id: dancehallGenre.id } } },
        ],
      },
      tags: {
        create: [{ tag: { connect: { id: singleTag.id } } }],
      },
      links: {
        create: [
          {
            platform: 'Spotify',
            url: 'https://open.spotify.com/track/toxicity',
          },
          {
            platform: 'YouTube',
            url: 'https://youtube.com/watch?v=toxicity',
          },
          {
            platform: 'Apple Music',
            url: 'https://music.apple.com/track/toxicity',
          },
        ],
      },
    },
  });

  const apexTrack = await prisma.music.upsert({
    where: { id: 'apex-track' },
    update: {},
    create: {
      id: 'apex-track',
      title: 'Apex',
      description: 'Reaching the pinnacle of artistic expression with this dynamic reggae anthem.',
      releaseDate: new Date('2023-08-20'),
      duration: 198, // 3:18 in seconds
      coverImageUrl: '/images/Albums/Apex.png',
      label: 'Bugle World Music',
      genres: {
        create: [{ genre: { connect: { id: reggaeGenre.id } } }],
      },
      tags: {
        create: [{ tag: { connect: { id: singleTag.id } } }],
      },
      links: {
        create: [
          {
            platform: 'Spotify',
            url: 'https://open.spotify.com/track/apex',
          },
          {
            platform: 'YouTube',
            url: 'https://youtube.com/watch?v=apex',
          },
        ],
      },
    },
  });

  const lifespanAlbum = await prisma.music.upsert({
    where: { id: 'lifespan-album' },
    update: {},
    create: {
      id: 'lifespan-album',
      title: 'LifeSpan',
      description:
        'A comprehensive album exploring the journey of life through reggae rhythms and conscious lyrics.',
      releaseDate: new Date('2022-11-10'),
      duration: 2400, // 40 minutes in seconds
      coverImageUrl: '/images/Albums/LifeSpan.png',
      label: 'Bugle World Music',
      genres: {
        create: [
          { genre: { connect: { id: reggaeGenre.id } } },
          { genre: { connect: { id: hipHopGenre.id } } },
        ],
      },
      tags: {
        create: [{ tag: { connect: { id: albumTag.id } } }],
      },
      links: {
        create: [
          {
            platform: 'Spotify',
            url: 'https://open.spotify.com/album/lifespan',
          },
          {
            platform: 'YouTube',
            url: 'https://youtube.com/playlist?list=lifespan',
          },
          {
            platform: 'Apple Music',
            url: 'https://music.apple.com/album/lifespan',
          },
        ],
      },
    },
  });

  console.log('✅ Sample music tracks created:', { toxicityTrack, apexTrack, lifespanAlbum });

  console.log('🎉 Database seeded successfully!');
}

main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async e => {
    console.error('❌ Seed failed:', e);
    await prisma.$disconnect();
    process.exit(1);
  });
