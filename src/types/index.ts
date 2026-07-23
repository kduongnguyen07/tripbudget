export interface ActivityItem {
  id: string;
  name: string;
  cost: number;
  category: 'stay' | 'food' | 'transport' | 'activities';
  duration_hrs: number;
  score: number;
  image?: string;
}

export interface TravelTipItem {
  id?: string;
  title: string;
  content: string;
}

export interface Destination {
  id: string;
  name: string;
  region: string;
  coordinates: [number, number]; // [longitude, latitude]
  hero_image: string;
  gallery_images: string[];
  satisfaction_scores: {
    stay: number;
    food: number;
    transport: number;
    activities: number;
  };
  activities: ActivityItem[];
  travel_tips?: TravelTipItem[];
}

export interface CategoryAllocation {
  amount: number;
  percentage: number;
  daily: number;
}

export interface OptimizationParams {
  total_budget: number;
  num_days: number;
  daily_budget: number;
  tier: string;
}

export interface DailyItineraryDay {
  day: number;
  title: string;
  stay_cost: number;
  food_cost: number;
  transport_cost: number;
  activities_cost: number;
  daily_total: number;
  suggested_items: ActivityItem[];
}

export interface OptimizationResult {
  status: string;
  solver: string;
  destination: Destination;
  params: OptimizationParams;
  summary: {
    total_allocated: number;
    satisfaction_index: number;
    allocations: {
      stay: CategoryAllocation;
      food: CategoryAllocation;
      transport: CategoryAllocation;
      activities: CategoryAllocation;
    };
  };
  daily_itinerary: DailyItineraryDay[];
}

export interface UserPreferences {
  stay: number;
  food: number;
  transport: number;
  activities: number;
}

export interface JourneySlide {
  id: string;
  category: string;
  title: string;
  titleHighlight: string;
  description: string;
  image: string;
  imageCaptionTitle: string;
  imageCaptionSub: string;
  features: string[];
}

export interface HeroConfig {
  badge: string;
  titleLine1: string;
  titleLine2: string;
  titleHighlight: string;
  backgroundImage: string;
  ctaButtonText: string;
}
