
import type { LucideIcon } from 'lucide-react';

export interface SocialLink {
  platform: string;
  url: string;
  Icon?: LucideIcon; // Optional: specific icon for the platform
}

export interface ScheduleItem {
  time: string;
  activity: string;
}

export interface Event {
  id: string;
  name: string;
  date: string; // ISO string format for dates
  shortDescription: string;
  fullDescription: string;
  location: {
    address: string;
    lat?: number; // Optional latitude
    lng?: number; // Optional longitude
  };
  gpxRouteUrl?: string; // URL to the GPX file
  organizerName: string;
  organizerSocial: SocialLink[];
  schedule: ScheduleItem[];
  imageUrl: string;
  category?: string; // e.g., "Road", "MTB", "Family"
}

export const mockEvents: Event[] = [
  {
    id: '1',
    name: 'Vuelta al Sarapiquí Clásica',
    date: '2024-08-15T08:00:00Z',
    shortDescription: 'Experience the classic Sarapiquí route with stunning jungle views.',
    fullDescription: 'Join us for the annual Vuelta al Sarapiquí Clásica, a challenging yet rewarding ride through the heart of the rainforest. This event is perfect for seasoned cyclists looking for an adventure. Includes hydration points and mechanical support.',
    location: {
      address: 'Central Park, Puerto Viejo de Sarapiquí',
      lat: 10.4550,
      lng: -84.0100,
    },
    gpxRouteUrl: '/gpx/vuelta-sarapiqui.gpx', // Example path
    organizerName: 'Club Ciclismo Sarapiquí',
    organizerSocial: [
      { platform: 'Facebook', url: 'https://facebook.com/ccsarapiqui' },
      { platform: 'Instagram', url: 'https://instagram.com/ccsarapiqui' },
    ],
    schedule: [
      { time: '07:00 AM', activity: 'Registration & Kit Pickup' },
      { time: '08:00 AM', activity: 'Race Start' },
      { time: '12:00 PM', activity: 'Lunch & Awards Ceremony' },
    ],
    imageUrl: 'https://placehold.co/600x400.png',
    category: 'Road Cycling',
  },
  {
    id: '2',
    name: 'Ruta del Chocolate MTB Challenge',
    date: '2024-09-05T09:00:00Z',
    shortDescription: 'A sweet and muddy MTB adventure through cocoa plantations.',
    fullDescription: 'Get ready to get muddy! The Ruta del Chocolate MTB Challenge takes you on an exciting off-road journey through local cocoa plantations. Enjoy beautiful trails, river crossings, and a taste of local chocolate at the finish line.',
    location: {
      address: 'La Virgen de Sarapiquí Community Center',
      lat: 10.4185,
      lng: -84.0890
    },
    gpxRouteUrl: '/gpx/ruta-chocolate-mtb.gpx',
    organizerName: 'Sarapiquí Aventuras MTB',
    organizerSocial: [
      { platform: 'Website', url: 'https://sarapiquiaventuras.com' },
      { platform: 'Twitter', url: 'https://twitter.com/sarapiquimtb' },
    ],
    schedule: [
      { time: '08:00 AM', activity: 'Final Registrations' },
      { time: '09:00 AM', activity: 'MTB Challenge Start' },
      { time: '01:00 PM', activity: 'Post-Race Gathering & Chocolate Tasting' },
    ],
    imageUrl: 'https://placehold.co/600x400.png',
    category: 'MTB',
  },
  {
    id: '3',
    name: 'Paseo Familiar Sarapiquí Verde',
    date: '2024-09-22T10:00:00Z',
    shortDescription: 'A fun and easy ride for the whole family along the Sarapiquí river.',
    fullDescription: 'Bring your family and friends for a leisurely bike ride along the scenic Sarapiquí river. This event is designed for all ages and skill levels, with a mostly flat route and plenty of stops for photos and refreshments.',
    location: {
      address: 'Sarapiquí Riverbanks Park, Horquetas',
      lat: 10.3231,
      lng: -83.9645
    },
    organizerName: 'Municipalidad de Sarapiquí',
    organizerSocial: [
      { platform: 'Facebook', url: 'https://facebook.com/munisarapiqui' },
    ],
    schedule: [
      { time: '09:00 AM', activity: 'Meetup and Bike Checks' },
      { time: '10:00 AM', activity: 'Ride Starts' },
      { time: '12:00 PM', activity: 'Picnic and Activities by the River' },
    ],
    imageUrl: 'https://placehold.co/600x400.png',
    category: 'Family Ride',
  },
  {
    id: '4',
    name: 'Amanecer en la Montaña Gravel Ride',
    date: '2024-10-12T06:00:00Z',
    shortDescription: 'Early morning gravel ride to witness the sunrise over Sarapiquí mountains.',
    fullDescription: 'An unforgettable experience for gravel enthusiasts. Start before dawn and ride up to scenic viewpoints to watch the sunrise. Route includes mixed terrain, paved and gravel roads. Strong lights and good fitness required.',
    location: {
      address: 'Mirador San Ramón, Sarapiquí',
      lat: 10.3500,
      lng: -84.1000,
    },
    gpxRouteUrl: '/gpx/amanecer-gravel.gpx',
    organizerName: 'Graveleros CR',
    organizerSocial: [
      { platform: 'Instagram', url: 'https://instagram.com/graveleroscr' },
      { platform: 'Strava', url: 'https://strava.com/clubs/graveleroscr' },
    ],
    schedule: [
      { time: '05:30 AM', activity: 'Briefing and Coffee' },
      { time: '06:00 AM', activity: 'Ride Departs' },
      { time: '09:00 AM', activity: 'Breakfast at Summit (approx.)' },
      { time: '11:00 AM', activity: 'Return to Start Point' },
    ],
    imageUrl: 'https://placehold.co/600x400.png',
    category: 'Gravel',
  },
];

export const getEvents = async (): Promise<Event[]> => {
  // Simulate API call
  return new Promise(resolve => {
    setTimeout(() => {
      resolve(mockEvents.sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime()));
    }, 500);
  });
};

export const getEventById = async (id: string): Promise<Event | undefined> => {
  // Simulate API call
  return new Promise(resolve => {
    setTimeout(() => {
      resolve(mockEvents.find(event => event.id === id));
    }, 300);
  });
};
