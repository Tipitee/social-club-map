
export interface RawClubData {
  id?: string;
  name: string;
  address: string | null;
  city: string | null;
  postal_code: string | null;
  status: string | null;
  latitude: number | null;
  longitude: number | null;
  membership_status: boolean | null;
  district: string | null;
  website: string | null;
  contact_email: string | null;
  contact_phone: string | null;
  description: string | null;
  additional_info: string | null;
}

export interface ClubDetailData {
  openingHours: { day: string; hours: string }[];
  memberCount: number;
  foundingDate: string;
  specialties: string[];
  facilities: string[];
  membershipFee: string;
  membershipWaitTime: string;
  strains: {
    name: string;
    thc: string;
    cbd: string;
    type: string;
  }[];
  events: {
    name: string;
    date: string;
    description: string;
  }[];
}
