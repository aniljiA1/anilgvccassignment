Product Showcase & Enquiry App

A full-stack web application built with React, Node.js (Express), and SQLite.
Users can browse products, view details, and submit enquiries. Admin can fetch all enquiries.

Features

User (Frontend):

Product listing with image, name, price, and category.

Search by product name.

Filter by category.

Pagination (client-side).

View product details.

Submit enquiry form (name, email, phone, message) with validation.

Admin (Backend API):

Fetch all enquiries.

Persist enquiries to SQLite database.

Technical:

React + Axios frontend.

Node.js + Express backend.

SQLite database (local file).

Environment variables for configuration.

Responsive and accessible UI.


Setup Instructions
1. Backend

Navigate to backend folder:

cd backend


Install dependencies:

npm install


Create .env file:

PORT=5000
DB_PATH=./data.db


Start backend server:

npm start


Server runs at http://localhost:5000

2. Frontend

Navigate to frontend folder:

cd frontend


Install dependencies:

npm install


Start frontend:

npm run dev

Frontend runs at http://localhost:5173 (default Vite port)
frontend runs: http://localhost:3000

deploy: https://anilgvccassignment.vercel.app/



