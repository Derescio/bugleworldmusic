import { describe, it, expect } from 'vitest';
import { getAllMusicReleases, getMusicReleaseById, getMusicReleasesByType } from '../music';

describe('Music Data Functions', () => {
  describe('getAllMusicReleases', () => {
    it('should return all music releases', () => {
      const releases = getAllMusicReleases();
      expect(releases).toBeInstanceOf(Array);
      expect(releases.length).toBeGreaterThan(0);
    });

    it('should return releases with required properties', () => {
      const releases = getAllMusicReleases();
      const firstRelease = releases[0];

      expect(firstRelease).toHaveProperty('id');
      expect(firstRelease).toHaveProperty('title');
      expect(firstRelease).toHaveProperty('type');
      expect(firstRelease).toHaveProperty('releaseDate');
      expect(firstRelease).toHaveProperty('image');
      expect(firstRelease).toHaveProperty('description');
      expect(firstRelease).toHaveProperty('streamingLinks');
      expect(firstRelease).toHaveProperty('genre');
    });

    it('should have valid release types', () => {
      const releases = getAllMusicReleases();
      const validTypes = ['album', 'single', 'ep'];

      releases.forEach(release => {
        expect(validTypes).toContain(release.type);
      });
    });
  });

  describe('getMusicReleaseById', () => {
    it('should return release by valid ID', () => {
      const release = getMusicReleaseById('patience-god-and-time');
      expect(release).toBeDefined();
      expect(release?.id).toBe('patience-god-and-time');
      expect(release?.title).toBe('Patience God & Time');
      expect(release?.type).toBe('album');
    });

    it('should return undefined for invalid ID', () => {
      const release = getMusicReleaseById('non-existent-id');
      expect(release).toBeUndefined();
    });
  });

  describe('getMusicReleasesByType', () => {
    it('should return albums only', () => {
      const albums = getMusicReleasesByType('album');
      expect(albums).toBeInstanceOf(Array);
      expect(albums.length).toBeGreaterThan(0);

      albums.forEach(release => {
        expect(release.type).toBe('album');
      });
    });

    it('should return singles only', () => {
      const singles = getMusicReleasesByType('single');
      expect(singles).toBeInstanceOf(Array);
      expect(singles.length).toBeGreaterThan(0);

      singles.forEach(release => {
        expect(release.type).toBe('single');
      });
    });

    it('should return EPs only', () => {
      const eps = getMusicReleasesByType('ep');
      expect(eps).toBeInstanceOf(Array);
      expect(eps.length).toBeGreaterThan(0);

      eps.forEach(release => {
        expect(release.type).toBe('ep');
      });
    });

    it('should return empty array for invalid type', () => {
      // @ts-expect-error Testing invalid type
      const releases = getMusicReleasesByType('invalid-type');
      expect(releases).toEqual([]);
    });
  });

  describe('Music Release Data Validation', () => {
    it('should have valid streaming links structure', () => {
      const releases = getAllMusicReleases();

      releases.forEach(release => {
        expect(release.streamingLinks).toBeTypeOf('object');

        // Check that streaming links are either strings or undefined
        if (release.streamingLinks.spotify) {
          expect(release.streamingLinks.spotify).toBeTypeOf('string');
        }
        if (release.streamingLinks.appleMusic) {
          expect(release.streamingLinks.appleMusic).toBeTypeOf('string');
        }
        if (release.streamingLinks.youtube) {
          expect(release.streamingLinks.youtube).toBeTypeOf('string');
        }
      });
    });

    it('should have valid release dates', () => {
      const releases = getAllMusicReleases();

      releases.forEach(release => {
        const releaseDate = new Date(release.releaseDate);
        expect(releaseDate).toBeInstanceOf(Date);
        expect(releaseDate.getTime()).not.toBeNaN();
      });
    });

    it('should have genre arrays', () => {
      const releases = getAllMusicReleases();

      releases.forEach(release => {
        expect(release.genre).toBeInstanceOf(Array);
        expect(release.genre.length).toBeGreaterThan(0);

        release.genre.forEach(genre => {
          expect(genre).toBeTypeOf('string');
          expect(genre.length).toBeGreaterThan(0);
        });
      });
    });

    it('should have track listings for albums', () => {
      const albums = getMusicReleasesByType('album');

      albums.forEach(album => {
        if (album.tracks) {
          expect(album.tracks).toBeInstanceOf(Array);
          expect(album.tracks.length).toBeGreaterThan(0);

          album.tracks.forEach(track => {
            expect(track).toBeTypeOf('string');
            expect(track.length).toBeGreaterThan(0);
          });
        }
      });
    });
  });
});
