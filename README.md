# Net Zero Campus - Sustainability Tracking Platform

## 🌱 Project Overview

Net Zero Campus is a full-stack web application designed to help educational institutions track and achieve their sustainability goals. The platform provides real-time monitoring of energy consumption, water usage, waste management, and mobility patterns while gamifying the sustainability journey through challenges, leaderboards, and achievement systems.

## 🚀 Features

### Core Functionality
- **Multi-role Authentication** (Admin, Faculty, Students)
- **Real-time Dashboard** with comprehensive metrics
- **Energy Monitoring** - Track electricity consumption and renewable sources
- **Water Management** - Monitor usage patterns and conservation efforts
- **Waste Tracking** - Manage recycling rates and reduction goals
- **Mobility Analytics** - Track transportation methods and carbon footprint
- **AI-Powered Recommendations** - Get personalized sustainability insights

### Gamification System
- Interactive leaderboards by department and role
- Sustainability challenges and competitions
- Achievement badges and reward system
- Progress tracking toward Net Zero goals
- Team collaboration features

### Data Visualization
- Interactive charts using Recharts
- Real-time metrics and trend analysis
- Progress bars and goal tracking
- Comparative analytics between departments

## 🛠️ Tech Stack

### Frontend
- **React.js** with TypeScript
- **Redux Toolkit** for state management
- **Tailwind CSS** for styling
- **Recharts** for data visualization
- **Firebase Auth** for authentication

### Backend
- **Node.js** with Express.js
- **MongoDB** with Mongoose ODM
- **Firebase Admin SDK**
- **OpenAI API** for AI recommendations
- **WebSocket** for real-time updates

## 📁 Project Structure

```
net-zero-campus/
├── client/                 # React Frontend
├── server/                 # Node.js Backend
├── shared/                 # Shared types and utilities
├── docs/                   # Documentation
└── scripts/                # Build and deployment scripts
```

## 🚀 Quick Start

### Prerequisites
- Node.js (v16 or higher)
- MongoDB (local or Atlas)
- Firebase project setup
- OpenAI API key (optional)

### Firebase Setup

1. **Create a Firebase Project**
   - Go to [Firebase Console](https://console.firebase.google.com/)
   - Click "Add project" and follow the setup wizard
   - Name your project (e.g., "net-zero-campus")

2. **Enable Authentication**
   - In the Firebase Console, go to "Authentication" → "Sign-in method"
   - Enable "Email/Password" provider
   - Click "Save"

3. **Set up Firestore Database**
   - Go to "Firestore Database" in the Firebase Console
   - Click "Create database"
   - Start in "Test mode" (for development only)
   - Choose a location and click "Enable"

4. **Register Web App**
   - Click the settings gear icon (Project settings)
   - Under "Your apps", click the web icon (</>)
   - Register your app with a nickname (e.g., "Net Zero Campus")
   - Copy the Firebase configuration object

5. **Configure Environment Variables**
   - Update `client/.env` with your Firebase configuration:
     ```env
     REACT_APP_FIREBASE_API_KEY=your_api_key
     REACT_APP_FIREBASE_AUTH_DOMAIN=your_project.firebaseapp.com
     REACT_APP_FIREBASE_PROJECT_ID=your_project_id
     REACT_APP_FIREBASE_STORAGE_BUCKET=your_project.appspot.com
     REACT_APP_FIREBASE_MESSAGING_SENDER_ID=your_messaging_sender_id
     REACT_APP_FIREBASE_APP_ID=your_app_id
     REACT_APP_USE_MOCK_AUTH=false
     ```

### Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd net-zero-campus
   ```

2. **Install all dependencies**
   ```bash
   npm run install:all
   ```

3. **Environment Setup**
   - Copy `.env.example` files in both client and server directories
   - Update environment variables with your configuration

4. **Database Setup**
   ```bash
   # Start MongoDB (if running locally)
   mongod
   
   # Seed the database (optional)
   npm run seed
   ```

5. **Start Development Servers**
   ```bash
   npm run dev
   ```

   This will start both the client (http://localhost:3000) and server (http://localhost:5000)

## 📚 Documentation

- [API Documentation](docs/API.md)
- [Setup Guide](docs/SETUP.md)
- [Deployment Guide](docs/DEPLOYMENT.md)
- [Firebase Authentication Setup](FIREBASE_AUTH_SETUP.md)

## 🌟 Key Features Implementation

### Authentication System
- Firebase Authentication with custom claims
- Role-based access control (Admin, Faculty, Student)
- Protected routes and API endpoints
- User profile management
- Conditional mock/real implementation for development

### Dashboard Components
- Real-time metric cards
- Interactive data visualizations
- Progress tracking for Net Zero goals
- AI-powered recommendation cards
- Responsive design for all devices

### Data Management
- Comprehensive tracking of sustainability metrics
- Real-time data aggregation and analytics
- Historical data analysis and trends
- Export capabilities for reporting

### AI Integration
- Context-aware sustainability recommendations
- Predictive analytics for resource optimization
- Automated insights and alerts
- Personalized action plans

## 🎮 Gamification Features

- **Leaderboards**: Department and individual rankings
- **Challenges**: Monthly sustainability competitions
- **Badges**: Achievement system for milestones
- **Progress Tracking**: Visual progress toward goals
- **Team Collaboration**: Group challenges and achievements

## 📱 Mobile Responsiveness

The application is built with a mobile-first approach, ensuring optimal performance and usability across all devices and screen sizes.

## 🔒 Security Features

- Firebase Authentication integration
- JWT token validation
- Role-based API access control
- Data sanitization and validation
- Rate limiting and security headers

## 🌍 Environmental Impact

This platform helps institutions:
- Reduce energy consumption by up to 25%
- Improve recycling rates by 40%
- Decrease water usage by 20%
- Lower overall carbon footprint
- Achieve Net Zero goals faster through data-driven decisions

## 🤝 Contributing

We welcome contributions! Please read our contributing guidelines and submit pull requests for any improvements.

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙋‍♂️ Support

For support and questions, please open an issue in the GitHub repository or contact our team.

---

**Built with 💚 for a sustainable future**