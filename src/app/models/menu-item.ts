export interface MenuItem {
  id: string;
  name: string;
  description: string;
  price: number;
  category: string;
  image: string;
  options?: {
    size?: 'small' | 'medium' | 'large';
    flavor?: 'coca-cola' | 'sprite' | 'fanta' | 'dr-pepper';
    type?: 'single' | 'double' | 'triple';
  };
}

export const MENU_ITEMS: MenuItem[] = [
  // Burgers
  {
    id: 'b1',
    name: 'Famous Star',
    description: 'Hamburguesa con queso americano, lechuga, tomate, cebolla, mayonesa y catsup',
    price: 89,
    category: 'burger',
    image: '',
    options: {
      type: 'single'
    }
  },
  {
    id: 'b2',
    name: 'Double Famous Star',
    description: 'Doble hamburguesa con queso americano, lechuga, tomate, cebolla, mayonesa y catsup',
    price: 119,
    category: 'burger',
    image: '',
    options: {
      type: 'double'
    }
  },
  {
    id: 'b3',
    name: 'Western Bacon',
    description: 'Hamburguesa con queso americano, tocino, aros de cebolla, salsa BBQ y mayonesa',
    price: 129,
    category: 'burger',
    image: '',
    options: {
      type: 'single'
    }
  },
  // Combos
  {
    id: 'c1',
    name: 'Combo Famous Star',
    description: 'Famous Star con papas y refresco',
    price: 139,
    category: 'combo',
    image: '',
    options: {
      size: 'medium'
    }
  },
  {
    id: 'c2',
    name: 'Combo Double Famous Star',
    description: 'Double Famous Star con papas y refresco',
    price: 169,
    category: 'combo',
    image: '',
    options: {
      size: 'medium'
    }
  },
  // Fries
  {
    id: 'f1',
    name: 'Papas Naturales',
    description: 'Papas fritas naturales',
    price: 49,
    category: 'fries',
    image: '',
    options: {
      size: 'small'
    }
  },
  {
    id: 'f2',
    name: 'Papas Naturales',
    description: 'Papas fritas naturales',
    price: 59,
    category: 'fries',
    image: '',
    options: {
      size: 'medium'
    }
  },
  {
    id: 'f3',
    name: 'Papas Naturales',
    description: 'Papas fritas naturales',
    price: 69,
    category: 'fries',
    image: '',
    options: {
      size: 'large'
    }
  },
  // Sodas
  {
    id: 's1',
    name: 'Refresco',
    description: 'Refresco de cola',
    price: 39,
    category: 'soda',
    image: '',
    options: {
      size: 'small',
      flavor: 'coca-cola'
    }
  },
  {
    id: 's2',
    name: 'Refresco',
    description: 'Refresco de cola',
    price: 49,
    category: 'soda',
    image: '',
    options: {
      size: 'medium',
      flavor: 'coca-cola'
    }
  },
  {
    id: 's3',
    name: 'Refresco',
    description: 'Refresco de cola',
    price: 59,
    category: 'soda',
    image: '',
    options: {
      size: 'large',
      flavor: 'coca-cola'
    }
  }
];
