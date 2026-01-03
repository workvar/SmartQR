export type DotType = 'dots' | 'rounded' | 'classy' | 'classy-rounded' | 'square' | 'extra-rounded';
export type CornerSquareType = 'dot' | 'square' | 'extra-rounded';
export type CornerDotType = 'dot' | 'square';
export type FrameStyle = 'solid' | 'dashed' | 'dotted';
export type Theme = 'light' | 'dark';

export interface GradientSettings {
  type: 'linear' | 'radial';
  rotation: number;
  colorStops: { offset: number; color: string }[];
}

export interface QRSettings {
  url: string;
  width: number;
  height: number;
  margin: number;
  dotsType: DotType;
  dotsColor: string;
  dotsGradientEnabled: boolean;
  dotsGradientSecondary: string;
  dotsGradientType: 'linear' | 'radial';
  dotsGradientRotation: number;
  backgroundColor: string;
  bgGradientEnabled: boolean;
  bgGradient: GradientSettings;
  isTransparent: boolean;
  cornerSquareType: CornerSquareType;
  cornerSquareColor: string;
  cornerDotType: CornerDotType;
  cornerDotColor: string;
  logoUrl?: string;
  logoSize: number;
  logoMargin: number;
  // Frame settings
  frameEnabled: boolean;
  frameColor: string;
  frameThickness: number;
  frameSync: boolean;
  frameStyle: FrameStyle;
  frameBorderRadius: number;
  framePadding: number;
  // Theme
  theme: Theme;
  // Dynamic QR
  isDynamic?: boolean;
}

export interface BrandingSuggestion {
  primaryColor: string;
  secondaryColor: string;
  backgroundColor?: string | null; // null or empty means transparent/skip background
  bgGradientEnabled?: boolean;
  bgGradientSecondary?: string; // Secondary color for gradient if bgGradientEnabled is true
}
