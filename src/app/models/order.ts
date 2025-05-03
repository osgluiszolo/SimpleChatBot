import { MenuItem } from './menu-item';

export interface Order {
  id: string;
  items: {
    item: MenuItem;
    quantity: number;
    customizations?: {
      size?: 'small' | 'medium' | 'large';
      flavor?: 'coca-cola' | 'sprite' | 'fanta' | 'dr-pepper';
      type?: 'single' | 'double' | 'triple';
    };
  }[];
  total: number;
  status: 'pending' | 'confirmed' | 'completed';
  timestamp: Date;
}
