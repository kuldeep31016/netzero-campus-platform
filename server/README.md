# Net Zero Campus Platform - Server

Backend API for the Net Zero Campus Platform built with Node.js and Express.

## Features

- RESTful API endpoints
- CORS enabled for cross-origin requests
- Environment variable configuration
- Health check endpoint
- Test API endpoints
- Error handling middleware

## Getting Started

### Prerequisites

- Node.js (v14 or higher)
- npm or yarn

### Installation

1. Navigate to the server directory:
   ```bash
   cd server
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Create a `.env` file with your configuration (see `.env` example)

4. Start the development server:
   ```bash
   npm run dev
   ```

   Or start the production server:
   ```bash
   npm start
   ```

The server will run on `http://localhost:5000` by default.

## API Endpoints

### General
- `GET /` - Welcome message and API info
- `GET /health` - Health check endpoint

### Test Endpoints
- `GET /api/test` - Test GET endpoint with sample data
- `POST /api/test` - Test POST endpoint

### Data Endpoints
- `GET /api/energy` - Mock energy consumption data

## Scripts

- `npm start` - Start the production server
- `npm run dev` - Start the development server with nodemon
- `npm test` - Run tests (not implemented yet)

## Environment Variables

- `PORT` - Server port (default: 5000)
- `NODE_ENV` - Environment (development/production)

## Project Structure

```
server/
├── index.js          # Main server file
├── package.json      # Dependencies and scripts
├── .env             # Environment variables
├── .gitignore       # Git ignore rules
└── README.md        # This file
```

## Development

The server uses nodemon for development, which automatically restarts the server when files change.

## Contributing

1. Fork the repository
2. Create your feature branch
3. Commit your changes
4. Push to the branch
5. Create a Pull Request