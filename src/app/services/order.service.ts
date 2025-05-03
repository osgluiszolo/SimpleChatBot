import { Injectable } from '@angular/core';
import { MenuItem, MENU_ITEMS } from '../models/menu-item';
import { Order } from '../models/order';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class OrderService {
  private currentOrder: Order = {
    id: this.generateOrderId(),
    items: [],
    total: 0,
    status: 'pending',
    timestamp: new Date()
  };

  private orderSubject = new BehaviorSubject<Order>(this.currentOrder);
  order$ = this.orderSubject.asObservable();

  constructor() { }

  getMenuItems(): MenuItem[] {
    return MENU_ITEMS;
  }

  getMenuItemsByCategory(category: string): MenuItem[] {
    return MENU_ITEMS.filter(item => item.category === category);
  }

  addItemToOrder(item: MenuItem, quantity: number = 1, customizations?: any): void {
    const existingItem = this.currentOrder.items.find(
      orderItem => orderItem.item.id === item.id && 
      JSON.stringify(orderItem.customizations) === JSON.stringify(customizations)
    );

    if (existingItem) {
      existingItem.quantity += quantity;
    } else {
      this.currentOrder.items.push({
        item,
        quantity,
        customizations
      });
    }

    this.updateTotal();
    this.orderSubject.next(this.currentOrder);
  }

  removeItemFromOrder(index: number): void {
    this.currentOrder.items.splice(index, 1);
    this.updateTotal();
    this.orderSubject.next(this.currentOrder);
  }

  updateItemQuantity(index: number, quantity: number): void {
    if (quantity <= 0) {
      this.removeItemFromOrder(index);
      return;
    }
    this.currentOrder.items[index].quantity = quantity;
    this.updateTotal();
    this.orderSubject.next(this.currentOrder);
  }

  clearOrder(): void {
    this.currentOrder = {
      id: this.generateOrderId(),
      items: [],
      total: 0,
      status: 'pending',
      timestamp: new Date()
    };
    this.orderSubject.next(this.currentOrder);
  }

  confirmOrder(): void {
    this.currentOrder.status = 'confirmed';
    this.orderSubject.next(this.currentOrder);
  }

  private updateTotal(): void {
    this.currentOrder.total = this.currentOrder.items.reduce(
      (total, item) => total + (item.item.price * item.quantity),
      0
    );
  }

  private generateOrderId(): string {
    return 'ORD-' + Math.random().toString(36).substr(2, 9).toUpperCase();
  }
}
