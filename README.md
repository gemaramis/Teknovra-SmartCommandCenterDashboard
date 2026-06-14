# Teknovra Smart Command Center Dashboard

Teknovra Smart Dashboard is a comprehensive, real-time command center interface designed for tracking public sentiment, media mentions, key issues, and competitive benchmarking. It provides decision-makers with a centralized hub to monitor data streams, escalate critical alerts, and gauge the impact of various issues across online, social, and print media.

## 🚀 Key Features

- **Live Issue Benchmarking**: Interactive and dynamically updating line charts tracking the volume index of various topics over time.
- **Real-Time Sentiment Analysis**: Live distribution panels showcasing public sentiment (Positive, Negative, Neutral) and SLA Watch metrics.
- **Alert & Crisis Management**: A prioritized feed of escalating issues with the ability to easily alert response teams.
- **Dynamic Social Feed**: Live ticker and tracking of top-performing social media posts across platforms like Twitter/X, TikTok, and Instagram.
- **Media & Personnel Metrics**: Detailed breakdowns of media channel distribution (Online, Social, Print, TV/Radio) and mention counts for key figures.

## 🛠️ Technology Stack

- **Framework**: [React 18](https://react.dev/) powered by [Vite](https://vitejs.dev/)
- **Styling**: Vanilla CSS & custom aesthetic design system
- **Charts**: [Recharts](https://recharts.org/) for responsive, dynamic data visualization
- **Icons**: [Lucide React](https://lucide.dev/)
- **Notifications**: [Sonner](https://sonner.emilkowal.ski/) for interactive toast notifications

## 📦 Getting Started

### Prerequisites
Make sure you have [Node.js](https://nodejs.org/) installed on your machine.

### Installation

1. Clone the repository:
   ```bash
   git clone https://github.com/gemaramis/Teknovra-SmartCommandCenterDashboard.git
   ```
2. Navigate into the directory:
   ```bash
   cd "Teknovra-SmartCommandCenterDashboard"
   ```
3. Install dependencies:
   ```bash
   npm install
   ```
4. Start the development server:
   ```bash
   npm run dev
   ```

The application will automatically open in your browser, usually at `http://localhost:5173`.

## 📡 Data Simulation

Currently, the dashboard is equipped with a `MockDataContext` that simulates real-time data streaming (updating every 2.5 seconds). This "dummy database" drives the dynamic movement of charts, alerts, and sentiment values.

When connecting to a live backend, you can simply replace the `setInterval` logic within `src/app/contexts/MockDataContext.tsx` with a WebSocket listener or API polling mechanism.