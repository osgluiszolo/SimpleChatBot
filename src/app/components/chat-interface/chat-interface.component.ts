import { Component, OnInit } from '@angular/core';
import { OrderService } from '../../services/order.service';
import { MenuItem } from '../../models/menu-item';
import { Order } from '../../models/order';

interface Message {
  type: 'user' | 'bot';
  content: string;
  timestamp: Date;
}

@Component({
  selector: 'app-chat-interface',
  templateUrl: './chat-interface.component.html',
  styleUrls: ['./chat-interface.component.scss']
})
export class ChatInterfaceComponent implements OnInit {
  messages: Message[] = [];
  userInput: string = '';
  currentOrder: Order | null = null;
  menuItems: MenuItem[] = [];
  showMenu: boolean = false;
  selectedCategory: string = '';

  constructor(private orderService: OrderService) {}

  ngOnInit(): void {
    this.menuItems = this.orderService.getMenuItems();
    this.orderService.order$.subscribe(order => {
      this.currentOrder = order;
    });

    // Initial bot message
    this.addBotMessage('¡Bienvenido a Carl\'s Jr! ¿En qué puedo ayudarte hoy?');
    this.addBotMessage('Puedes pedir:\n- Hamburguesas\n- Combos\n- Papas\n- Refrescos\n\n¿Qué te gustaría ordenar?');
  }

  sendMessage(): void {
    if (!this.userInput.trim()) return;

    this.addUserMessage(this.userInput);
    this.processUserInput(this.userInput);
    this.userInput = '';
  }

  private processUserInput(input: string): void {
    const lowerInput = input.toLowerCase();

    if (lowerInput.includes('hamburguesa') || lowerInput.includes('burger')) {
      this.showMenuByCategory('burger');
    } else if (lowerInput.includes('combo')) {
      this.showMenuByCategory('combo');
    } else if (lowerInput.includes('papa') || lowerInput.includes('fries')) {
      this.showMenuByCategory('fries');
    } else if (lowerInput.includes('refresco') || lowerInput.includes('soda')) {
      this.showMenuByCategory('soda');
    } else if (lowerInput.includes('ver') || lowerInput.includes('menu')) {
      this.showFullMenu();
    } else if (lowerInput.includes('carrito') || lowerInput.includes('orden')) {
      this.showCurrentOrder();
    } else if (lowerInput.includes('gracias') || lowerInput.includes('adios')) {
      this.addBotMessage('¡Gracias por tu visita! ¡Vuelve pronto!');
    } else {
      this.addBotMessage('Lo siento, no entendí tu solicitud. ¿Podrías ser más específico?');
    }
  }

  private showMenuByCategory(category: string): void {
    this.selectedCategory = category;
    const items = this.orderService.getMenuItemsByCategory(category);
    let message = `Aquí están nuestros ${category}s:\n\n`;
    
    items.forEach(item => {
      message += `${item.name} - $${item.price}\n`;
      message += `${item.description}\n\n`;
    });

    this.addBotMessage(message);
    this.showMenu = true;
  }

  private showFullMenu(): void {
    let message = 'Nuestro menú completo:\n\n';
    
    ['burger', 'combo', 'fries', 'soda'].forEach(category => {
      const items = this.orderService.getMenuItemsByCategory(category);
      message += `=== ${category.toUpperCase()} ===\n`;
      items.forEach(item => {
        message += `${item.name} - $${item.price}\n`;
        message += `${item.description}\n\n`;
      });
    });

    this.addBotMessage(message);
  }

  private showCurrentOrder(): void {
    if (!this.currentOrder || this.currentOrder.items.length === 0) {
      this.addBotMessage('Tu carrito está vacío.');
      return;
    }

    let message = 'Tu orden actual:\n\n';
    this.currentOrder.items.forEach((item, index) => {
      message += `${item.quantity}x ${item.item.name} - $${item.item.price * item.quantity}\n`;
      if (item.customizations) {
        message += `Personalización: ${JSON.stringify(item.customizations)}\n`;
      }
    });
    message += `\nTotal: $${this.currentOrder.total}`;

    this.addBotMessage(message);
  }

  addItemToOrder(item: MenuItem): void {
    this.orderService.addItemToOrder(item);
    this.addBotMessage(`¡${item.name} agregado a tu orden!`);
  }

  private addUserMessage(content: string): void {
    this.messages.push({
      type: 'user',
      content,
      timestamp: new Date()
    });
  }

  private addBotMessage(content: string): void {
    this.messages.push({
      type: 'bot',
      content,
      timestamp: new Date()
    });
  }
}
