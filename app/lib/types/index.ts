// Common types for the Bugle World Music application

export interface NavItem {
  title: string;
  href: string;
  description?: string;
  external?: boolean;
}

export interface SiteConfig {
  name: string;
  description: string;
  url: string;
  ogImage: string;
  links: {
    twitter: string;
    instagram: string;
    spotify: string;
    appleMusic: string;
    youtube: string;
  };
}

export interface Event {
  id: string;
  title: string;
  date: string;
  venue: string;
  location: string;
  ticketUrl?: string;
  image?: string;
  description?: string;
}

export interface Release {
  id: string;
  title: string;
  type: 'single' | 'album' | 'ep';
  releaseDate: string;
  image: string;
  streamingLinks: {
    spotify?: string;
    appleMusic?: string;
    youtube?: string;
  };
}

export interface PressKitItem {
  title: string;
  description: string;
  downloadUrl: string;
  fileSize: string;
  type: 'image' | 'document' | 'video';
}
