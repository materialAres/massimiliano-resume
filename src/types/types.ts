interface InfoItem {
  title: string;
  subtitle?: string;
  location?: string;
  description?: string;
}

export interface InfoBoxProps {
  title: string;
  items: InfoItem[];
  isMobile: boolean;
  hasSmallHeight: boolean;
  isFading: boolean;
}

export interface BoxSection {
  title: string;
  items: InfoItem[];
}

export type BoxData = {
  [key: string]: BoxSection;
};
