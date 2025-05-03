import { Component, OnInit, ViewChild, ElementRef, AfterViewChecked } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { OrderService, Order, OrderItem } from '../../services/order.service';
import { MenuItem as ServiceMenuItem } from '../../models/menu-item';

/**
 * @description
 * Interface for chat messages
 */
interface Message {
  type: 'user' | 'bot';
  content: string;
  timestamp: Date;
}

/**
 * @description
 * Interface for menu items in the chat interface
 */
interface ChatMenuItem {
  id: string;
  name: string;
  price: number;
  category: string;
  description?: string;
  size?: string;
  flavor?: string;
  type?: string;
}

/**
 * @description
 * ChatInterfaceComponent - A bilingual chatbot for Carl's Jr food ordering
 * 
 * Features:
 * - Full bilingual support (English/Spanish)
 * - Interactive menu system
 * - Real-time order management
 * - Customization options for items
 * - Automatic price calculation in MXN
 * 
 * Menu Structure:
 * 1. Language Selection
 * 2. Main Menu
 *   - Burgers ($80-$95)
 *   - Sodas ($25-$35)
 *   - Fries ($30-$50)
 *   - Combos ($140-$155)
 *   - Finish Order
 * 
 * Order Flow:
 * 1. User selects language
 * 2. User navigates through menus
 * 3. Items are added to cart
 * 4. Order summary is displayed
 * 5. Order is confirmed
 * 
 * Technologies:
 * - Angular 17
 * - TypeScript
 * - Tailwind CSS
 * 
 * Author: Luis Eduardo Villalobos Alcaraz
 * Course: INNOVACIÓN Y DESARROLLO
 * Professor: DR. MIGUEL ANGEL PONCE CAMACHO
 * 
 * Repository: https://github.com/osgluiszolo/SimpleChatBot
 * Deployed on: https://simple-chatbot.vercel.app
 */
@Component({
  selector: 'app-chat-interface',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './chat-interface.component.html',
  styleUrls: ['./chat-interface.component.scss']
})
export class ChatInterfaceComponent implements OnInit, AfterViewChecked {
  @ViewChild('messageContainer') private messageContainer!: ElementRef;
  
  messages: Message[] = [];
  userInput: string = '';
  currentOrder: Order | null = null;
  currentOrderItems: OrderItem[] = [];
  orderStep: 'language' | 'main' | 'burger' | 'soda-size' | 'soda-flavor' | 'fries-size' | 'fries-type' | 'combo' | 'confirm' = 'language';
  currentItem: ChatMenuItem | null = null;
  currentSize: string = '';
  currentFlavor: string = '';
  currentType: string = '';
  isChatOpen: boolean = false;
  language: 'es' | 'en' = 'es';
  logoPath = 'assets/images/logo.png';

  // Precios en pesos mexicanos
  private readonly prices = {
    burgers: {
      clasica: 80,
      western: 95,
      guacamole: 90,
      portabello: 92
    },
    sodaSizes: {
      chico: 25,
      mediano: 30,
      grande: 35
    },
    friesSizes: {
      chico: 30,
      mediano: 40,
      grande: 50
    },
    combos: {
      clasica: 140,
      western: 155,
      guacamole: 150,
      portabello: 152
    }
  };

  // Mensajes en español
  private readonly messagesEs = {
    welcome: '¡Bienvenido a Carl\'s Jr!',
    languageSelection: 'Por favor elija su idioma:\n1 - English\n2 - Español',
    mainMenu: 'Menú principal:\n1 - Hamburguesa\n2 - Soda\n3 - Papas\n4 - Combos\n5 - Terminar',
    burgerMenu: 'Seleccione una hamburguesa:\n1 - Clásica ($80)\n2 - Western Bacon ($95)\n3 - Guacamole ($90)\n4 - Portabello ($92)\n5 - Cancelar y volver al menú',
    sodaSizeMenu: 'Seleccione el tamaño de la soda:\n1 - Chico ($25)\n2 - Mediano ($30)\n3 - Grande ($35)\n4 - Cancelar y volver al menú',
    sodaFlavorMenu: 'Seleccione el sabor:\n1 - CocaCola\n2 - CocaCola Zero\n3 - Té Helado\n4 - Sprite\n5 - Cancelar y volver al menú',
    friesSizeMenu: 'Seleccione el tamaño de las papas:\n1 - Chico ($30)\n2 - Mediano ($40)\n3 - Grande ($50)\n4 - Cancelar y volver al menú',
    friesTypeMenu: 'Seleccione el tipo:\n1 - Regulares\n2 - Curly\n3 - Cancelar y volver al menú',
    comboMenu: 'Seleccione un combo:\n1 - Clásica Combo $140\n2 - Western Bacon Combo $155\n3 - Guacamole Combo $150\n4 - Portabello Combo $152\n5 - Cancelar y volver al menú',
    addedToCart: (item: string) => `${item} agregado al carrito. Volviendo al menú principal.`,
    cancelled: 'Opción cancelada. Volviendo al menú principal.',
    orderSummary: (items: string, total: number) => `Su pedido es:\n${items}\nTotal: $${total} MXN`
  };

  // Messages in English
  private readonly messagesEn = {
    welcome: 'Welcome to Carl\'s Jr!',
    languageSelection: 'Please choose your language:\n1 - English\n2 - Español',
    mainMenu: 'Main Menu:\n1 - Burger\n2 - Soda\n3 - Fries\n4 - Combos\n5 - Finish Order',
    burgerMenu: 'Select a burger:\n1 - Classic ($80)\n2 - Western Bacon ($95)\n3 - Guacamole ($90)\n4 - Portabello ($92)\n5 - Cancel and return to menu',
    sodaSizeMenu: 'Select soda size:\n1 - Small ($25)\n2 - Medium ($30)\n3 - Large ($35)\n4 - Cancel and return to menu',
    sodaFlavorMenu: 'Select flavor:\n1 - CocaCola\n2 - CocaCola Zero\n3 - Iced Tea\n4 - Sprite\n5 - Cancel and return to menu',
    friesSizeMenu: 'Select fries size:\n1 - Small ($30)\n2 - Medium ($40)\n3 - Large ($50)\n4 - Cancel and return to menu',
    friesTypeMenu: 'Select type:\n1 - Regular\n2 - Curly\n3 - Cancel and return to menu',
    comboMenu: 'Select a combo:\n1 - Classic Combo $140\n2 - Western Bacon Combo $155\n3 - Guacamole Combo $150\n4 - Portabello Combo $152\n5 - Cancel and return to menu',
    addedToCart: (item: string) => `${item} added to cart. Returning to main menu.`,
    cancelled: 'Option cancelled. Returning to main menu.',
    orderSummary: (items: string, total: number) => `Your order is:\n${items}\nTotal: $${total} MXN`
  };

  constructor(private orderService: OrderService) {}

  ngOnInit(): void {
    this.showLanguageSelection();
  }

  ngAfterViewChecked(): void {
    this.scrollToBottom();
  }

  private scrollToBottom(): void {
    try {
      this.messageContainer.nativeElement.scrollTop = this.messageContainer.nativeElement.scrollHeight;
    } catch (err) {
      console.error('Error scrolling to bottom:', err);
    }
  }

  toggleChat(): void {
    this.isChatOpen = !this.isChatOpen;
    if (this.isChatOpen && this.messages.length === 0) {
      this.showLanguageSelection();
    }
  }

  private showLanguageSelection(): void {
    this.addBotMessage(this.messagesEn.languageSelection);
    this.orderStep = 'language';
  }

  private processLanguageSelection(selection: number): void {
    if (selection === 1) {
      this.language = 'en';
      this.addBotMessage(this.messagesEn.welcome);
    } else if (selection === 2) {
      this.language = 'es';
      this.addBotMessage(this.messagesEs.welcome);
    } else {
      this.addBotMessage('Invalid selection. Please choose 1 for English or 2 for Español.');
      return;
    }
    this.showMainMenu();
  }

  private showMainMenu(): void {
    const message = this.language === 'en' ? this.messagesEn.mainMenu : this.messagesEs.mainMenu;
    this.addBotMessage(message);
    this.orderStep = 'main';
  }

  private processMainMenuSelection(selection: number): void {
    switch (selection) {
      case 1:
        this.showBurgerMenu();
        break;
      case 2:
        this.showSodaSizeMenu();
        break;
      case 3:
        this.showFriesSizeMenu();
        break;
      case 4:
        this.showComboMenu();
        break;
      case 5:
        this.finalizeOrder();
        break;
      default:
        this.addBotMessage(this.language === 'en' ? 'Invalid option. Please select 1-5.' : 'Opción no válida. Por favor seleccione 1-5.');
    }
  }

  private showBurgerMenu(): void {
    const message = this.language === 'en' ? this.messagesEn.burgerMenu : this.messagesEs.burgerMenu;
    this.addBotMessage(message);
    this.orderStep = 'burger';
  }

  private processBurgerSelection(selection: number): void {
    if (selection === 5) {
      this.addBotMessage(this.language === 'en' ? this.messagesEn.cancelled : this.messagesEs.cancelled);
      this.showMainMenu();
      return;
    }

    const burgers = [
      { id: '1', name: this.language === 'en' ? 'Classic' : 'Clásica', price: this.prices.burgers.clasica, category: 'burger' },
      { id: '2', name: 'Western Bacon', price: this.prices.burgers.western, category: 'burger' },
      { id: '3', name: 'Guacamole', price: this.prices.burgers.guacamole, category: 'burger' },
      { id: '4', name: 'Portabello', price: this.prices.burgers.portabello, category: 'burger' }
    ];

    if (selection >= 1 && selection <= 4) {
      const selectedBurger = burgers[selection - 1];
      this.addItemToOrder(selectedBurger);
    } else {
      this.addBotMessage(this.language === 'en' ? 'Invalid option. Please select 1-5.' : 'Opción no válida. Por favor seleccione 1-5.');
    }
  }

  private showSodaSizeMenu(): void {
    const message = this.language === 'en' ? this.messagesEn.sodaSizeMenu : this.messagesEs.sodaSizeMenu;
    this.addBotMessage(message);
    this.orderStep = 'soda-size';
  }

  private processSodaSizeSelection(selection: number): void {
    if (selection === 4) {
      this.addBotMessage(this.language === 'en' ? this.messagesEn.cancelled : this.messagesEs.cancelled);
      this.showMainMenu();
      return;
    }

    const sizes = this.language === 'en' ? ['Small', 'Medium', 'Large'] : ['Chico', 'Mediano', 'Grande'];
    if (selection >= 1 && selection <= 3) {
      this.currentSize = sizes[selection - 1];
      this.showSodaFlavorMenu();
    } else {
      this.addBotMessage(this.language === 'en' ? 'Invalid option. Please select 1-4.' : 'Opción no válida. Por favor seleccione 1-4.');
    }
  }

  private showSodaFlavorMenu(): void {
    const message = this.language === 'en' ? this.messagesEn.sodaFlavorMenu : this.messagesEs.sodaFlavorMenu;
    this.addBotMessage(message);
    this.orderStep = 'soda-flavor';
  }

  private processSodaFlavorSelection(selection: number): void {
    if (selection === 5) {
      this.currentSize = '';
      this.addBotMessage(this.language === 'en' ? this.messagesEn.cancelled : this.messagesEs.cancelled);
      this.showMainMenu();
      return;
    }

    const flavors = ['CocaCola', 'CocaCola Zero', this.language === 'en' ? 'Iced Tea' : 'Té Helado', 'Sprite'];
    if (selection >= 1 && selection <= 4) {
      this.currentFlavor = flavors[selection - 1];
      const sizeKey = this.currentSize.toLowerCase() as keyof typeof this.prices.sodaSizes;
      const price = this.prices.sodaSizes[sizeKey];
      this.addItemToOrder({
        id: 'soda-' + this.currentSize,
        name: `${this.currentFlavor} ${this.currentSize}`,
        price: price,
        category: 'soda',
        size: this.currentSize,
        flavor: this.currentFlavor
      });
    } else {
      this.addBotMessage(this.language === 'en' ? 'Invalid option. Please select 1-5.' : 'Opción no válida. Por favor seleccione 1-5.');
    }
  }

  private showFriesSizeMenu(): void {
    const message = this.language === 'en' ? this.messagesEn.friesSizeMenu : this.messagesEs.friesSizeMenu;
    this.addBotMessage(message);
    this.orderStep = 'fries-size';
  }

  private processFriesSizeSelection(selection: number): void {
    if (selection === 4) {
      this.addBotMessage(this.language === 'en' ? this.messagesEn.cancelled : this.messagesEs.cancelled);
      this.showMainMenu();
      return;
    }

    const sizes = this.language === 'en' ? ['Small', 'Medium', 'Large'] : ['Chico', 'Mediano', 'Grande'];
    if (selection >= 1 && selection <= 3) {
      this.currentSize = sizes[selection - 1];
      this.showFriesTypeMenu();
    } else {
      this.addBotMessage(this.language === 'en' ? 'Invalid option. Please select 1-4.' : 'Opción no válida. Por favor seleccione 1-4.');
    }
  }

  private showFriesTypeMenu(): void {
    const message = this.language === 'en' ? this.messagesEn.friesTypeMenu : this.messagesEs.friesTypeMenu;
    this.addBotMessage(message);
    this.orderStep = 'fries-type';
  }

  private processFriesTypeSelection(selection: number): void {
    if (selection === 3) {
      this.currentSize = '';
      this.addBotMessage(this.language === 'en' ? this.messagesEn.cancelled : this.messagesEs.cancelled);
      this.showMainMenu();
      return;
    }

    const types = this.language === 'en' ? ['Regular', 'Curly'] : ['Regulares', 'Curly'];
    if (selection >= 1 && selection <= 2) {
      this.currentType = types[selection - 1];
      const sizeKey = this.currentSize.toLowerCase() as keyof typeof this.prices.friesSizes;
      const price = this.prices.friesSizes[sizeKey];
      this.addItemToOrder({
        id: 'fries-' + this.currentSize + '-' + this.currentType,
        name: `${this.currentType} ${this.currentSize}`,
        price: price,
        category: 'fries',
        size: this.currentSize,
        type: this.currentType
      });
    } else {
      this.addBotMessage(this.language === 'en' ? 'Invalid option. Please select 1-3.' : 'Opción no válida. Por favor seleccione 1-3.');
    }
  }

  private showComboMenu(): void {
    const message = this.language === 'en' ? this.messagesEn.comboMenu : this.messagesEs.comboMenu;
    this.addBotMessage(message);
    this.orderStep = 'combo';
  }

  private processComboSelection(selection: number): void {
    if (selection === 5) {
      this.addBotMessage(this.language === 'en' ? this.messagesEn.cancelled : this.messagesEs.cancelled);
      this.showMainMenu();
      return;
    }

    const combos = [
      { id: '1', name: this.language === 'en' ? 'Classic Combo' : 'Clásica Combo', price: this.prices.combos.clasica, category: 'combo' },
      { id: '2', name: 'Western Bacon Combo', price: this.prices.combos.western, category: 'combo' },
      { id: '3', name: 'Guacamole Combo', price: this.prices.combos.guacamole, category: 'combo' },
      { id: '4', name: 'Portabello Combo', price: this.prices.combos.portabello, category: 'combo' }
    ];

    if (selection >= 1 && selection <= 4) {
      const selectedCombo = combos[selection - 1];
      this.addItemToOrder(selectedCombo);
    } else {
      this.addBotMessage(this.language === 'en' ? 'Invalid option. Please select 1-5.' : 'Opción no válida. Por favor seleccione 1-5.');
    }
  }

  private addItemToOrder(item: ChatMenuItem): void {
    const orderItem: OrderItem = {
      item: {
        id: item.id,
        name: item.name,
        description: item.description || '',
        price: item.price,
        category: item.category,
        image: 'assets/images/default.jpg'
      },
      quantity: 1,
      customizations: {
        ...(item.size && { size: item.size }),
        ...(item.flavor && { flavor: item.flavor }),
        ...(item.type && { type: item.type })
      }
    };

    this.currentOrderItems.push(orderItem);
    this.orderService.addItemToOrder(orderItem.item, 1, orderItem.customizations);

    const message = this.language === 'en' 
      ? this.messagesEn.addedToCart(item.name)
      : this.messagesEs.addedToCart(item.name);
    this.addBotMessage(message);

    // Reset current selections
    this.currentSize = '';
    this.currentFlavor = '';
    this.currentType = '';
    this.showMainMenu();
  }

  private showCurrentOrder(): void {
    if (this.currentOrderItems.length === 0) {
      const message = this.language === 'en' 
        ? 'Your cart is empty.' 
        : 'Tu carrito está vacío.';
      this.addBotMessage(message);
      return;
    }

    let itemsList = '';
    this.currentOrderItems.forEach((orderItem, index) => {
      itemsList += `${index + 1}. ${orderItem.item.name}`;
      if (orderItem.customizations) {
        Object.entries(orderItem.customizations).forEach(([key, value]) => {
          itemsList += `\n   ${key}: ${value}`;
        });
      }
      itemsList += `\n   Price: $${orderItem.item.price}\n\n`;
    });

    const total = this.currentOrderItems.reduce((sum, item) => 
      sum + item.item.price, 0
    );

    const message = this.language === 'en'
      ? this.messagesEn.orderSummary(itemsList, total)
      : this.messagesEs.orderSummary(itemsList, total);
    this.addBotMessage(message);
  }

  private finalizeOrder(): void {
    if (this.currentOrderItems.length === 0) {
      const message = this.language === 'en'
        ? 'Your cart is empty. Would you like to see our menu?'
        : 'Tu carrito está vacío. ¿Te gustaría ver nuestro menú?';
      this.addBotMessage(message);
      this.showMainMenu();
      return;
    }

    this.showCurrentOrder();
    const message = this.language === 'en'
      ? 'Would you like to finish your order? (yes/no)'
      : '¿Deseas finalizar tu orden? (sí/no)';
    this.addBotMessage(message);
    this.orderStep = 'confirm';
  }

  private processConfirmation(input: string): void {
    const isYes = this.language === 'en'
      ? input.toLowerCase().includes('yes')
      : input.toLowerCase().includes('sí') || input.toLowerCase().includes('si');

    if (isYes) {
      const message = this.language === 'en'
        ? 'Thank you for your order! Your order has been processed.'
        : '¡Gracias por tu orden! Tu pedido ha sido procesado.';
      this.addBotMessage(message);
      this.currentOrderItems = [];
      this.orderService.clearOrder();
    } else {
      const message = this.language === 'en'
        ? 'Understood. Would you like to add something else to your order?'
        : 'Entendido. ¿Te gustaría agregar algo más a tu orden?';
      this.addBotMessage(message);
    }
    this.showMainMenu();
  }

  sendMessage(): void {
    if (!this.userInput.trim()) return;

    this.addUserMessage(this.userInput);
    this.processUserInput(this.userInput);
    this.userInput = '';
  }

  private processUserInput(input: string): void {
    const numberInput = parseInt(input);

    switch (this.orderStep) {
      case 'language':
        this.processLanguageSelection(numberInput);
        break;
      case 'main':
        this.processMainMenuSelection(numberInput);
        break;
      case 'burger':
        this.processBurgerSelection(numberInput);
        break;
      case 'soda-size':
        this.processSodaSizeSelection(numberInput);
        break;
      case 'soda-flavor':
        this.processSodaFlavorSelection(numberInput);
        break;
      case 'fries-size':
        this.processFriesSizeSelection(numberInput);
        break;
      case 'fries-type':
        this.processFriesTypeSelection(numberInput);
        break;
      case 'combo':
        this.processComboSelection(numberInput);
        break;
      case 'confirm':
        this.processConfirmation(input);
        break;
    }
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
