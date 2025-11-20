export type Position = 'start' | 'end';

export interface SideNavConfig {
  position: Position;
  mode: 'over' | 'push' | 'side';
  toggle: 'open' | 'close';
  style?: string;
}
