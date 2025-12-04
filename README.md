**📚 Full-Stack Library Management System**

NestJS + PostgreSQL + Prisma + React + React Native

**🔗 Demo Video**


▶️ https://drive.google.com/file/d/1pvoAqBlEOEGYtReX7R0T4N93pX2PJV72/view?usp=sharing

**🚀 Overview**

This project is a full-stack Library System built as part of the Full-Stack Developer assignment.
It includes:

📘 CRUD for Books

✍️ CRUD for Authors

👤 CRUD for Users

🔄 Borrowing & Returning books

🔐 JWT Authentication

🗄 PostgreSQL + Prisma

🛠 NestJS Backend

💻 React.js Frontend (TypeScript)

📱 Optional React Native Mobile App

🐳 Docker Support

**🧩 Features**

📘 Books

Create / Edit / Delete books

List with filters (author, borrowed status)

✍️ Authors

Add / Edit / Delete authors

View authors list

👥 Users

Create new users

List all users

🔄 Borrowing Flow

Borrow a book

Return a book

View user’s borrowed books

🔐 Auth

Login with email + password

Protected routes using JWT

Token persisted in local storage


**🛠️ Prerequisites**

Before starting, install these:

1️⃣ Node.js 18+

https://nodejs.org/en/download/

2️⃣ Docker (optional but recommended)

https://www.docker.com/products/docker-desktop/

3️⃣ PostgreSQL

https://www.postgresql.org/download/

**📦 Installation & Run Guide**

Two methods are available:

✅ Method 1: Run Everything Using Docker (Recommended)
Step 1: Open Terminal

Windows:

Win + R → cmd

Step 2: Go to the project root
cd C:\Users\PradeepB\react-project

Step 3: Start backend + PostgreSQL
docker-compose up -d


Wait 30–60 seconds.

Check status:

docker-compose ps


You should see:

postgres     running
backend      running

🖥️ Start Frontend

Open a NEW terminal:

cd C:\Users\PradeepB\react-project\frontend
npm install
npm run dev


Visit:
👉 http://localhost:3001

🔑 Login Credentials
Email: admin@library.com
Password: password123

**🟦 Method 2: Manual Installation (Without Docker)**

Install PostgreSQL

Install Locally

Download PostgreSQL:
https://www.postgresql.org/download/

During setup choose a password for postgres

Verify installation:

psql --version

Create Database

psql -U postgres


Then run:

CREATE DATABASE library_db;
\q

**🧱 Part B — Backend Setup**

Step 1: Open Terminal

cd C:\Users\PradeepB\react-project\backend

Step 2: Install dependencies

npm install

Step 3: Create .env

📌 Using Local PostgreSQL:

DATABASE_URL="postgresql://postgres:YOUR_PASSWORD@localhost:5432/library_db?schema=public"

JWT_SECRET="my-super-secret-jwt-key-12345"

JWT_EXPIRES_IN="7d"

PORT=3000

NODE_ENV=development


Step 4: Prisma Generate

npm run prisma:generate

Step 5: Run Migrations

npm run prisma:migrate


Enter name:

init

Step 6: Seed Database

npm run prisma:seed

Step 7: Start Backend

npm run start:dev


Backend available at:

API: http://localhost:3000

Swagger: http://localhost:3000/api

**🎨 Part C — Frontend Setup (React)**

Step 1: New terminal

cd C:\Users\PradeepB\react-project\frontend

Step 2: Install Dependencies

npm install

Step 3: (Optional) Create .env

VITE_API_URL=http://localhost:3000

Step 4: Run App
npm run dev


Frontend URL:
👉 http://localhost:3001

**📱 Mobile App Setup (React Native + Expo)**

Step 1: Install Expo CLI

npm install -g expo-cli

Step 2: Go to mobile folder

cd C:\Users\PradeepB\react-project\mobile

npm install

Step 3: .env

Android emulator:

EXPO_PUBLIC_API_URL=http://10.0.2.2:3000


Physical device:

EXPO_PUBLIC_API_URL=http://YOUR_LOCAL_IP:3000


Find IP:

ipconfig

Step 4: Start Expo

npm start


Press:

a → Android emulator

Scan QR → open in Expo Go

📝 API Documentation

If Swagger is enabled:

👉 http://localhost:3000/api

🧪 Testing Protected Routes (JWT)

Login using POST /auth/login

Get access_token

Send requests with:

Authorization: Bearer <token>

🐛 Troubleshooting Guide
❌ Backend fails to start with PostgreSQL

Fix:

netstat -ano | findstr :5432


Stop conflicting process.

❌ Prisma Client not generated
cd backend
npm run prisma:generate

❌ PostgreSQL connection error

Check:

Is PostgreSQL running?

Is password correct?

Is database name correct?

❌ Docker not starting containers

Run:

docker-compose down
docker-compose up --build


Check logs:

docker-compose logs --tail=100 backend

❌ Migration errors
npx prisma migrate reset
npx prisma migrate dev

❌ Frontend cannot connect to backend

Verify .env:

VITE_API_URL=http://localhost:3000


Restart frontend.

📄 .env.example
DATABASE_URL=
JWT_SECRET=my-super-secret-jwt-key-12345
JWT_EXPIRES_IN=7d
PORT=3000
NODE_ENV=development


Frontend:

VITE_API_URL=http://localhost:3000


Mobile:

EXPO_PUBLIC_API_URL=http://10.0.2.2:3000

Expo build instructions:

How to Build the Mobile App (APK) Using Expo

Expo now uses EAS Build for generating APKs or AABs (Play Store).
Follow these steps in order.

✅ 1. Install Expo CLI (if not installed)

npm install -g expo-cli

✅ 2. Install EAS CLI (required for building APK)

npm install -g eas-cli

✅ 3. Login to Expo

eas login


Enter your email + password.

✅ 4. Navigate to the mobile app folder

cd C:\Users\PradeepB\react-project\mobile


Or whichever folder your mobile app is in.

✅ 5. Install dependencies

npm install

✅ 6. Create an Expo project config (if not already)

eas build:configure


This generates:

eas.json

✅ 7. Set API URL in .env (important)

If running backend locally:

For Android Emulator
EXPO_PUBLIC_API_URL=http://10.0.2.2:3000

For Physical Device

Find your PC IP:

ipconfig


Then set:

EXPO_PUBLIC_API_URL=http://YOUR_IP:3000


Example:

EXPO_PUBLIC_API_URL=http://192.168.1.19:3000


Restart Expo after editing .env.

✅ 8. Build the APK

📦 To generate an APK (installable file):
eas build -p android --profile preview


OR to generate a signed Play Store AAB:

eas build -p android --profile production


Expo will:

Upload your project

Build it on Expo servers

Give you a download link to the APK

🎉 After Build Completes

Expo will show something like:

Build complete!

Download your APK:

https://expo.dev/accounts/yourname/projects/app/builds/xxxxxxxx


Click link → Download APK → Install on your device.

📹 Demo Video

▶️ https://drive.google.com/file/d/1pvoAqBlEOEGYtReX7R0T4N93pX2PJV72/view?usp=sharing

🎯 Final Notes

Fully working backend + frontend

JWT protected routes

Organized folder structure

Prisma schema & migrations included

Docker setup included

React Native expo  build included
