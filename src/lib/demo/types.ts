export type DemoUser = {
  id: number;
  name: string;
  email: string;
  role: "musician" | "venue";
  city: string | null;
  state: string | null;
  headline: string | null;
  bio: string | null;
  instruments: string[];
  genres: string[];
  links: string | null;
  avatarUrl: string | null;
  createdAt: string;
};

export type DemoVenue = {
  id: number;
  ownerId: number;
  name: string;
  tagline: string | null;
  description: string | null;
  address: string | null;
  city: string | null;
  state: string | null;
  capacity: number | null;
  genres: string[];
  coverUrl: string | null;
  createdAt: string;
};

export type DemoGig = {
  id: number;
  venueId: number;
  title: string;
  description: string | null;
  requirements: string | null;
  gigDate: string;
  startTime: string | null;
  endTime: string | null;
  payAmount: number;
  payUnit: string;
  payNote: string | null;
  setsCount: number;
  gigType: string;
  genres: string[];
  lineupNeeded: string[];
  experience: string;
  backline: boolean;
  meals: boolean;
  tips: boolean;
  soundEngineer: boolean;
  address: string | null;
  city: string | null;
  state: string | null;
  status: string;
  featured: boolean;
  spots: number;
  createdAt: string;
};

export type DemoApplication = {
  id: number;
  gigId: number;
  musicianId: number;
  pitch: string | null;
  lineup: string | null;
  links: string | null;
  status: string;
  createdAt: string;
};

export type DemoBookmark = { id: number; musicianId: number; gigId: number };

export type Dataset = {
  users: DemoUser[];
  venues: DemoVenue[];
  gigs: DemoGig[];
  applications: DemoApplication[];
  bookmarks: DemoBookmark[];
};

export type GigRow = { gig: DemoGig; venue: DemoVenue | null; appCount: number };
export type AppRow = {
  application: DemoApplication;
  musician: DemoUser | null;
  gig: DemoGig | null;
};

export type GigFilters = {
  q?: string;
  city?: string;
  genres?: string[];
  lineup?: string[];
  dateFrom?: string;
  dateTo?: string;
  payMin?: number;
  gigType?: string;
  experience?: string;
  perks?: string[];
  status?: string;
  sort?: string;
};
