# Herbs MERN Stack Application

A full-stack MERN (MongoDB, Express, React, Node.js) application for managing herbs with a modern UI built with TailwindCSS.

## Project Structure

```
.
├── backend/
│   ├── src/
│   │   ├── config/
│   │   │   └── db.js          # MongoDB connection
│   │   ├── models/
│   │   │   └── Herb.js        # Herb data model
│   │   ├── controllers/
│   │   │   └── herbController.js  # Herb CRUD operations
│   │   ├── routes/
│   │   │   └── herbRoutes.js      # API routes
│   │   ├── services/
│   │   │   └── n8nService.js      # n8n workflow integration
│   │   ├── app.js                 # Express app configuration
│   │   └── server.js              # Server entry point
│   ├── package.json
│   └── .env.example
│
└── frontend/
    ├── src/
    │   ├── components/
    │   │   └── HerbCard.jsx       # Herb card component
    │   ├── pages/
    │   │   ├── Home.jsx            # Home page
    │   │   └── HerbDetails.jsx    # Herb details page
    │   ├── App.jsx                 # Main app component
    │   ├── main.jsx                # React entry point
    │   └── index.css               # TailwindCSS imports
    ├── index.html
    ├── tailwind.config.js
    ├── postcss.config.js
    ├── vite.config.js
    └── package.json
```

## Features

- ✅ Full CRUD operations for herbs
- ✅ MongoDB database integration
- ✅ RESTful API with Express
- ✅ React with Vite for fast development
- ✅ TailwindCSS for modern, responsive UI
- ✅ React Router for navigation
- ✅ Modular backend structure
- ✅ n8n service integration ready

## Prerequisites

- Node.js (v16 or higher)
- MongoDB (local or MongoDB Atlas)
- npm or yarn

## Setup Instructions

### Backend Setup

1. Navigate to the backend directory:
   ```bash
   cd backend
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Create a `.env` file from the example:
   ```bash
   cp .env.example .env
   ```

4. Update the `.env` file with your MongoDB connection string:
   ```
   MONGODB_URI=mongodb://localhost:27017/herbs
   ```
   Or use MongoDB Atlas:
   ```
   MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/herbs
   ```

5. Start the development server:
   ```bash
   npm run dev
   ```

   The backend will run on `http://localhost:5000`

### Frontend Setup

1. Navigate to the frontend directory:
   ```bash
   cd frontend
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Start the development server:
   ```bash
   npm run dev
   ```

   The frontend will run on `http://localhost:3000`

## API Endpoints

- `GET /api/herbs` - Get all herbs
- `GET /api/herbs/:id` - Get a single herb by ID
- `POST /api/herbs` - Create a new herb
- `PUT /api/herbs/:id` - Update a herb
- `DELETE /api/herbs/:id` - Delete a herb
- `GET /api/health` - Health check endpoint

## Example API Request

### Create a Herb

```bash
curl -X POST http://localhost:5000/api/herbs \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Basil",
    "description": "A fragrant herb used in cooking",
    "benefits": ["Digestive health", "Anti-inflammatory"],
    "uses": ["Cooking", "Tea"],
    "price": 5.99,
    "category": "culinary"
  }'
```

## Development

- Backend uses `nodemon` for auto-restart during development
- Frontend uses Vite for fast HMR (Hot Module Replacement)
- TailwindCSS is configured and ready to use

## Production Build

### Frontend

```bash
cd frontend
npm run build
```

The build output will be in the `dist` folder.

## Technologies Used

- **Backend**: Node.js, Express, MongoDB, Mongoose
- **Frontend**: React, Vite, React Router, TailwindCSS
- **Development**: Nodemon, PostCSS, Autoprefixer

