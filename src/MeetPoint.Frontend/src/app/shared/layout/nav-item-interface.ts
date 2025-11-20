export interface NavItem {
  index: number;
  icon: string;
  class?: string;
  label?: string;
  click: () => void;
}
