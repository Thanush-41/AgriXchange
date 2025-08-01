# AgriXchange 🌾

A comprehensive web application that connects farmers directly with consumers and retailers, eliminating middlemen and ensuring fair prices for agricultural produce.

## 🚀 Features

### For Farmers
- **Product Listing**: List produce for both retail and wholesale markets
- **Live Bidding**: Participate in real-time auctions for wholesale orders
- **Weather Integration**: Access current weather and forecasts
- **Agricultural News**: Stay updated with latest farming news and trends
- **Quality Certification**: Upload AGMARK quality certificates

### For Traders
- **Wholesale Bidding**: Participate in live auctions for bulk purchases
- **Bidding History**: Track all previous bids and transactions
- **Verified Trading**: GSTIN and license verification for trusted trading

### For Consumers
- **Fresh Produce**: Browse and purchase directly from local farmers
- **Smart Filtering**: Filter by location, price, category, and quality
- **Shopping Cart**: Easy cart management and checkout
- **Delivery Partners**: Choose from available delivery options

## 🛠️ Tech Stack

- **Frontend**: React 18 + TypeScript
- **Build Tool**: Vite
- **Styling**: Tailwind CSS
- **Routing**: React Router v6
- **State Management**: React Context API
- **Forms**: React Hook Form + Zod validation
- **Icons**: Lucide React
- **Real-time**: Socket.IO (for live bidding)

## 🏗️ Project Structure

```
src/
├── components/
│   ├── ui/           # Reusable UI components
│   ├── layout/       # Layout components (Header, Footer, Layout)
│   └── forms/        # Form components
├── pages/            # Page components
├── context/          # React Context providers
├── hooks/            # Custom React hooks
├── services/         # API services and utilities
├── types/            # TypeScript type definitions
└── utils/            # Utility functions
```

## 🚀 Getting Started

### Prerequisites
- Node.js (v18 or higher)
- npm or yarn

### Installation

1. Clone the repository:
```bash
git clone <repository-url>
cd agrixchange
```

2. Install dependencies:
```bash
npm install
```

3. Start the development server:
```bash
npm run dev
```

4. Open your browser and navigate to `http://localhost:5173`

## 📱 User Roles & Authentication

The application supports three user roles:

1. **Farmer**: Can list products, participate in bidding, access weather and news
2. **Trader**: Can participate in wholesale bidding with verified credentials
3. **Consumer**: Can browse and purchase retail products

### Demo Credentials
Since this is a demo application:
- **Phone**: Any 10-digit number
- **Password**: Any 6+ character password
- Authentication is simulated for demonstration purposes

## 🎯 Key Pages

1. **Landing Page**: Welcome page with features overview
2. **Authentication**: Sign in/Sign up with role selection
3. **Dashboards**: Role-specific dashboards for farmers, traders, and consumers
4. **Product Listing**: Browse products with advanced filtering
5. **Live Bidding**: Real-time bidding interface for wholesale products
6. **Cart & Checkout**: Shopping cart with delivery partner selection
7. **Weather**: Weather information for farmers
8. **News**: Agricultural news and updates
9. **Profile Management**: User profile and settings

## 🔧 Development Scripts

```bash
npm run dev          # Start development server
npm run build        # Build for production
npm run preview      # Preview production build
npm run lint         # Run ESLint
```

## 🎨 Design System

The application uses a custom design system built with Tailwind CSS:

- **Primary Colors**: Green theme for agricultural feel
- **Secondary Colors**: Yellow/amber for highlights
- **Typography**: Inter font family
- **Components**: Consistent button, input, and card components
- **Responsive**: Mobile-first responsive design

## 🌟 Key Features Implementation

### Live Bidding System
- Real-time updates using Socket.IO
- Bidding room management
- Automatic bid validation
- Winner determination

### Role-Based Access
- Protected routes based on user roles
- Role-specific navigation and features
- Conditional component rendering

### Product Management
- Image upload simulation
- Category-based organization
- Location-based filtering
- Quality certification handling

## 🚧 Future Enhancements

- Payment gateway integration
- Real backend API integration
- Mobile app development
- Advanced analytics dashboard
- Government scheme integration
- Multi-language support

## 📄 License

This project is licensed under the MIT License - see the LICENSE file for details.

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## 📞 Support

For support and questions, please contact [support@agrixchange.com](mailto:support@agrixchange.com)
  {
    files: ['**/*.{ts,tsx}'],
    extends: [
      // Other configs...
      // Enable lint rules for React
      reactX.configs['recommended-typescript'],
      // Enable lint rules for React DOM
      reactDom.configs.recommended,
    ],
    languageOptions: {
      parserOptions: {
        project: ['./tsconfig.node.json', './tsconfig.app.json'],
        tsconfigRootDir: import.meta.dirname,
      },
      // other options...
    },
  },
])
```
#   A g r i X c h a n g e  
 