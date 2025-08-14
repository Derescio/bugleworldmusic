import { getAllMusicReleases, getMusicReleasesByType } from '../lib/data/music-db';
import MusicPageClient from './MusicPageClient';

export default async function MusicPage() {
  // Fetch data from database
  const allReleases = await getAllMusicReleases();
  const albums = await getMusicReleasesByType('album');
  const singles = await getMusicReleasesByType('single');
  const eps = await getMusicReleasesByType('ep');

  return <MusicPageClient allReleases={allReleases} albums={albums} singles={singles} eps={eps} />;
}
