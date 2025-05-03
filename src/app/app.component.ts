import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterOutlet } from '@angular/router';

interface Translation {
  welcome: string;
  description: string;
  features: string;
  howToUse: string;
  developedBy: string;
  course: string;
  professor: string;
  repository: string;
  deployed: string;
}

interface TranslationArrays {
  featuresList: string[];
  steps: string[];
}

interface Translations {
  en: Translation & TranslationArrays;
  es: Translation & TranslationArrays;
}

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [CommonModule, RouterOutlet],
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  title = 'simple-chat-bot';
  currentLanguage: 'en' | 'es' = 'en';
  logoPath = 'assets/images/logo.png';
  translations: Translations = {
    en: {
      welcome: 'Welcome to Carl\'s Jr Chatbot!',
      description: 'This chatbot allows you to place orders interactively in two languages (English and Spanish). You can customize your order by selecting from a variety of burgers, sodas, fries, and combos.',
      features: 'Features:',
      featuresList: [
        'Bilingual support (English/Spanish)',
        'Interactive menu with prices in Mexican pesos',
        'Customization options for each product',
        'Order summary with automatic total calculation',
        'Modern and user-friendly interface'
      ],
      howToUse: 'How to use:',
      steps: [
        'Select your preferred language',
        'Navigate through the main menu',
        'Choose your products and customizations',
        'Review your order and complete the purchase'
      ],
      developedBy: 'Developed by:',
      course: 'Course:',
      professor: 'Professor:',
      repository: 'Repository:',
      deployed: 'Deployed on:'
    },
    es: {
      welcome: '¡Bienvenido al Chatbot de Carl\'s Jr!',
      description: 'Este chatbot te permite realizar pedidos de manera interactiva y en dos idiomas (español e inglés). Puedes personalizar tu orden seleccionando entre una variedad de hamburguesas, sodas, papas y combos.',
      features: 'Características:',
      featuresList: [
        'Soporte bilingüe (español/inglés)',
        'Menú interactivo con precios en pesos mexicanos',
        'Opciones de personalización para cada producto',
        'Resumen de orden con cálculo automático del total',
        'Interfaz moderna y fácil de usar'
      ],
      howToUse: 'Cómo usar:',
      steps: [
        'Selecciona tu idioma preferido',
        'Navega por el menú principal',
        'Elige tus productos y personalizaciones',
        'Revisa tu orden y finaliza el pedido'
      ],
      developedBy: 'Desarrollado por:',
      course: 'Materia:',
      professor: 'Profesor:',
      repository: 'Repositorio:',
      deployed: 'Desplegado en:'
    }
  };

  toggleLanguage(): void {
    this.currentLanguage = this.currentLanguage === 'en' ? 'es' : 'en';
  }

  getTranslation(key: keyof Translation): string {
    return this.translations[this.currentLanguage][key];
  }

  getFeaturesList(): string[] {
    return this.translations[this.currentLanguage].featuresList;
  }

  getSteps(): string[] {
    return this.translations[this.currentLanguage].steps;
  }
}
