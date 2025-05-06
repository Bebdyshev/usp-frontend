export interface NavItem {
  title: string;
  url: string;
  icon?: string;
  isActive?: boolean;
  items?: NavSubItem[];
}

export interface NavSubItem {
  title: string;
  url: string;
} 