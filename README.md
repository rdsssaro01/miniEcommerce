A full-stack Mini e-commerce application built using Next.js for the frontend and NestJS for the backend.
It includes authentication (JWT), product management, cart handling, and API integration.

🚀 Tech Stack

Frontend

⚡ Next.js 16

⚛️ React 19

💅 Tailwind CSS

🔐 JWT Authentication

🛒 LocalStorage for cart persistence


Backend

🧱 NestJS 10

🐘 MongoDB with Mongoose

🔐 JWT Authentication

⚙️ RESTful API structure

🪶 Class Validator + DTOs

⚙️ Installation

1️⃣ Clone the Repository

2️⃣ Setup Backend (NestJS)

cd backend

npm install


Create a .env file inside the backend/ folder:

PORT=5000
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_secret_key


Run the backend:

npm run start:dev


Backend will run on Local 👉 http://localhost:5000

3️⃣ Setup Frontend (Next.js)

cd ../frontend

npm install


Create a .env.local file inside the frontend/ folder:

NEXT_PUBLIC_API_URL=http://localhost:5000


Run the frontend:

npm run dev


Frontend will run on Local👉 http://localhost:3000

🧩 Features

🖥️ Frontend

User Registration & Login

Product Listing & Details

Cart Management (LocalStorage)

Protected Routes (JWT)

Responsive UI with Tailwind

⚙️ Backend

User Authentication (JWT)

Product CRUD APIs

MongoDB Integration

Validation & Error Handling

🔗 API Endpoints

Method	Endpoint	Description
POST	/auth/register	Register new user
POST	/auth/login	Login user
GET	/products	Get all products
GET	/products/:id	Get product by ID
POST	/products	Add new product
PUT	/products/:id	Update product
DELETE	/products/:id	Delete product

🧑‍💻 Deployment

Frontend (Next.js)

Deploy easily using Vercel
:

Push your project to GitHub.

Go to Vercel → Import your repository.

Set environment variables (from .env.local).

Deploy!

Backend (NestJS)

Deploy using Render
 or Railway.app
:

Push the backend folder to GitHub (separate repo or same).

Create a new Web Service in Render.

Set environment variables (MONGO_URI, JWT_SECRET).

Deploy!

🧾 Example Environment Setup

.env (NestJS)
PORT=5000
MONGO_URI=mongodb+srv://<username>:<password>@cluster.mongodb.net/mini
JWT_SECRET=mysecretkey

.env.local (Next.js)

🧠 Future Enhancements

Payment Gateway Integration (Razorpay / Stripe)

Admin Dashboard

Wishlist / Order History

Server-side cart persistence

SEO optimization with Next.js

🧑‍💻 Author

Saravanan R

Full Stack Developer — Flutter | Next.js | NestJS

https://www.linkedin.com/in/saravananr007/

Live Demo : mini-ecommerce-drab-xi.vercel.app

