export interface DashboardData {
  overview: OverviewMetrics;
  energy: EnergyMetrics;
  water: WaterMetrics;
  waste: WasteMetrics;
  mobility: MobilityMetrics;
  netZeroProgress: NetZeroProgress;
  aiRecommendations: AIRecommendation[];
  recentActivities: Activity[];
}

export interface OverviewMetrics {
  totalCarbonFootprint: number;
  carbonReduction: number;
  sustainabilityScore: number;
  netZeroProgress: number;
  lastUpdated: Date;
}

export interface EnergyMetrics {
  totalConsumption: number;
  renewablePercentage: number;
  costSavings: number;
  carbonFootprint: number;
  trends: DataPoint[];
  breakdown: {
    electricity: number;
    heating: number;
    cooling: number;
  };
}

export interface WaterMetrics {
  totalConsumption: number;
  conservationRate: number;
  costSavings: number;
  recycledPercentage: number;
  trends: DataPoint[];
  breakdown: {
    potable: number;
    irrigation: number;
    cooling: number;
  };
}

export interface WasteMetrics {
  totalWaste: number;
  recyclingRate: number;
  diversionRate: number;
  costSavings: number;
  trends: DataPoint[];
  breakdown: {
    general: number;
    recyclable: number;
    organic: number;
    hazardous: number;
  };
}

export interface MobilityMetrics {
  totalEmissions: number;
  ecoFriendlyPercentage: number;
  carbonSaved: number;
  averageCommute: number;
  trends: DataPoint[];
  breakdown: {
    walking: number;
    cycling: number;
    public_transit: number;
    personal_vehicle: number;
    electric_vehicle: number;
  };
}

export interface NetZeroProgress {
  currentEmissions: number;
  targetEmissions: number;
  reductionPercentage: number;
  targetDate: Date;
  projectedDate: Date;
  milestones: Milestone[];
}

export interface Milestone {
  title: string;
  target: number;
  achieved: boolean;
  date: Date;
}

export interface AIRecommendation {
  id: string;
  title: string;
  description: string;
  category: 'energy' | 'water' | 'waste' | 'mobility';
  impact: 'high' | 'medium' | 'low';
  effort: 'high' | 'medium' | 'low';
  savings: string;
  priority: number;
  createdAt: Date;
}

export interface Activity {
  id: string;
  type: 'data_entry' | 'goal_achieved' | 'badge_earned' | 'challenge_completed';
  title: string;
  description: string;
  timestamp: Date;
  user?: {
    id: string;
    displayName: string;
  };
}

export interface DataPoint {
  date: Date;
  value: number;
  label?: string;
}

export interface ChartData {
  labels: string[];
  datasets: ChartDataset[];
}

export interface ChartDataset {
  label: string;
  data: number[];
  backgroundColor?: string | string[];
  borderColor?: string | string[];
  borderWidth?: number;
  fill?: boolean;
}

export interface DashboardState {
  data: DashboardData | null;
  isLoading: boolean;
  error: string | null;
  lastUpdated: Date | null;
}