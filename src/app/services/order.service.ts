import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { MenuItem } from '../models/menu-item';

export interface OrderItem {
  item: MenuItem;
  quantity: number;
  customizations?: {
    [key: string]: any;
  };
}

export interface Order {
  id: string;
  items: OrderItem[];
  total: number;
  status: 'pending' | 'confirmed' | 'completed';
  timestamp: Date;
}

@Injectable({
  providedIn: 'root'
})
export class OrderService {
  private order = new BehaviorSubject<Order>({
    id: this.generateOrderId(),
    items: [],
    total: 0,
    status: 'pending',
    timestamp: new Date()
  });

  order$ = this.order.asObservable();

  private menuItems: MenuItem[] = [
    {
      id: '1',
      name: 'Hamburguesa Clásica',
      description: 'Carne de res, lechuga, tomate, cebolla y salsas',
      price: 5.99,
      category: 'burger',
      image: 'assets/images/classic-burger.jpg'
    },
    {
      id: '2',
      name: 'Hamburguesa con Queso',
      description: 'Carne de res, queso cheddar, lechuga, tomate y salsas',
      price: 6.99,
      category: 'burger',
      image: 'assets/images/cheese-burger.jpg'
    },
    {
      id: '3',
      name: 'Hamburguesa Doble',
      description: 'Doble carne de res, queso cheddar, lechuga, tomate y salsas',
      price: 8.99,
      category: 'burger',
      image: 'assets/images/double-burger.jpg'
    },
    {
      id: '4',
      name: 'Combo Clásico',
      description: 'Hamburguesa Clásica, papas fritas y bebida',
      price: 9.99,
      category: 'combo',
      image: 'assets/images/classic-combo.jpg'
    },
    {
      id: '5',
      name: 'Combo Doble',
      description: 'Hamburguesa Doble, papas fritas y bebida',
      price: 11.99,
      category: 'combo',
      image: 'assets/images/double-combo.jpg'
    },
    {
      id: '6',
      name: 'Papas Fritas',
      description: 'Papas fritas crujientes',
      price: 2.99,
      category: 'fries',
      image: 'assets/images/fries.jpg'
    },
    {
      id: '7',
      name: 'Papas con Queso',
      description: 'Papas fritas con queso derretido',
      price: 3.99,
      category: 'fries',
      image: 'assets/images/cheese-fries.jpg'
    },
    {
      id: '8',
      name: 'Refresco',
      description: 'Bebida gaseosa',
      price: 1.99,
      category: 'soda',
      image: 'assets/images/soda.jpg'
    },
    {
      id: '9',
      name: 'Té Helado',
      description: 'Té helado refrescante',
      price: 1.99,
      category: 'soda',
      image: 'assets/images/iced-tea.jpg'
    }
  ];

  getMenuItems(): MenuItem[] {
    return this.menuItems;
  }

  getMenuItemsByCategory(category: string): MenuItem[] {
    return this.menuItems.filter(item => item.category === category);
  }

  addItemToOrder(item: MenuItem, quantity: number = 1, customizations?: { [key: string]: any }): void {
    const currentOrder = this.order.value;
    const orderItem: OrderItem = {
      item,
      quantity,
      customizations
    };

    const newItems = [...currentOrder.items, orderItem];
    const newTotal = this.calculateTotal(newItems);

    this.order.next({
      id: currentOrder.id,
      items: newItems,
      total: newTotal,
      status: currentOrder.status,
      timestamp: currentOrder.timestamp
    });
  }

  removeItemFromOrder(index: number): void {
    const currentOrder = this.order.value;
    const newItems = currentOrder.items.filter((_, i) => i !== index);
    const newTotal = this.calculateTotal(newItems);

    this.order.next({
      id: currentOrder.id,
      items: newItems,
      total: newTotal,
      status: currentOrder.status,
      timestamp: currentOrder.timestamp
    });
  }

  clearOrder(): void {
    this.order.next({
      id: this.generateOrderId(),
      items: [],
      total: 0,
      status: 'pending',
      timestamp: new Date()
    });
  }

  private calculateTotal(items: OrderItem[]): number {
    return items.reduce((total, item) => {
      return total + (item.item.price * item.quantity);
    }, 0);
  }

  private generateOrderId(): string {
    return 'ORD-' + Math.random().toString(36).substr(2, 9).toUpperCase();
  }
}
