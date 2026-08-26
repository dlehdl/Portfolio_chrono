export interface FuryState {
  current: number;
  max: number;
  isDecaying: boolean;
  lastHitTime: number;
}

export interface MechanicNodeProps {
  title: string;
  subtitle: string;
  icon: React.ReactNode;
  isActive: boolean;
  description: string;
  side?: 'left' | 'right' | 'center';
}
