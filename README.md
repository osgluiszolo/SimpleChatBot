# SimpleChatBot - Carl's Jr Ordering System

A modern chatbot interface for ordering food from Carl's Jr, built with Angular and Tailwind CSS.

## 🚀 Live Demo

The application is deployed on Vercel: [https://simple-chatbot.vercel.app](https://simple-chatbot.vercel.app)

## 📋 Features

- **Bilingual Support**: Choose between English and Spanish
- **Interactive Menu**: Browse through burgers, sodas, fries, and combos
- **Customization Options**: Select sizes, flavors, and types for your items
- **Real-time Order Management**: Add items to cart and view your order summary
- **Responsive Design**: Works on both desktop and mobile devices
- **Modern UI**: Built with Tailwind CSS for a sleek and professional look

## 🛠️ Technologies Used

- **Frontend Framework**: Angular 17
- **Styling**: Tailwind CSS
- **State Management**: Angular Services
- **Deployment**: Vercel
- **Type Safety**: TypeScript

## 🏗️ Architecture

The application follows a component-based architecture:

- **ChatInterfaceComponent**: Main component handling the chat interface and order flow
- **OrderService**: Manages order state and business logic
- **Custom Pipes**: For data transformation and filtering
- **Models**: TypeScript interfaces for type safety

## 📦 Project Structure

```
src/
├── app/
│   ├── components/
│   │   └── chat-interface/
│   │       ├── chat-interface.component.ts
│   │       ├── chat-interface.component.html
│   │       └── chat-interface.component.scss
│   ├── services/
│   │   └── order.service.ts
│   ├── models/
│   │   └── menu-item.ts
│   └── pipes/
│       └── filter-by-category.pipe.ts
```

## 🚀 Getting Started

1. Clone the repository:
```bash
git clone https://github.com/osgluiszolo/SimpleChatBot.git
```

2. Install dependencies:
```bash
cd SimpleChatBot
npm install
```

3. Start the development server:
```bash
ng serve
```

4. Open your browser and navigate to `http://localhost:4200`

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## 📝 License

This project is licensed under the MIT License.

## 👨‍💻 Author

- **Name**: Luis Eduardo Villalobos Alcaraz
- **Course**: INNOVACIÓN Y DESARROLLO
- **Professor**: DR. MIGUEL ANGEL PONCE CAMACHO

## 🙏 Acknowledgments

- Special thanks to Dr. Miguel Angel Ponce Camacho for the guidance
- Carl's Jr for the inspiration
- The Angular and Tailwind CSS communities for their amazing tools