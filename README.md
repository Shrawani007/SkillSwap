# SkillSwap

**SkillSwap** is a peer-to-peer learning and skill exchange platform that helps people learn from each other by exchanging skills.

Instead of traditional one-way learning, SkillSwap allows users to **offer the skills they know, discover skills they want to learn, find compatible learners, and exchange knowledge through skill-swap requests.**

The platform also provides a space for users to share learning resources related to their skills.

---

## Features

### 🔐 User Authentication

* User registration and login
* Secure password hashing using bcrypt
* JWT-based authentication
* Cookie-based authentication
* Logout functionality
* Protected API routes

### 👤 User Profiles

Users can create and manage their profiles with:

* Full name
* Username
* Email
* Phone number
* Date of birth
* Gender
* Location
* Bio
* Social links
* Skills they offer
* Skills they want to learn

### 🔄 Skill Exchange

The core feature of SkillSwap is skill exchange.

Users can:

* Add skills they can teach
* Add skills they are interested in learning
* Discover other users offering those skills
* Send skill-swap requests
* Specify the skill they want to learn
* Specify the skill they can offer in exchange
* Add a proposal message
* Accept or reject incoming requests

For example:

> **User A:** Can teach React → Wants to learn Python
> **User B:** Can teach Python → Wants to learn React

SkillSwap can connect these users for a potential skill exchange.

### 🎯 Skill Recommendations

The backend includes a recommendation system that identifies users based on their learning interests.

The recommendation logic:

1. Gets the logged-in user's interested skills.
2. Searches for other users who offer those skills.
3. Excludes the current user.
4. Retrieves the recommended users' offered and interested skills.
5. Returns relevant profiles as recommendations.

### 📚 Learning Resources

Users can create and manage resources related to their skills.

Resources can contain:

* Title
* Description
* Skill/category
* Folder
* Image
* General link
* Video link
* PDF
* Audio link

Users can also control resource sharing and grant access to other users.

### 📊 Dashboard

The dashboard provides an overview of the user's activity, including:

* Skill-swap activity
* Pending requests
* Recent swaps
* Learning progress
* Quick access to skills and swaps

### 🔎 Browse Skills

Users can browse available skills and discover people who offer them.

The interface includes:

* Skill search
* Skill categories
* Skill levels
* User information
* Skill-swap request functionality

### 🔁 Swap Request Management

SkillSwap supports different request states:

* **Pending**
* **Connected**
* **Rejected**

Users can manage incoming and outgoing skill-swap requests from the My Swaps section.

---

# Tech Stack

## Frontend

* **React**
* **TypeScript**
* **Vite**
* **React Router**
* **TanStack React Query**
* **Tailwind CSS**
* **shadcn/ui**
* **Radix UI**
* **Framer Motion**
* **Lucide React**
* **React Hook Form**
* **Zod**
* **Recharts**

## Backend

* **Node.js**
* **Express.js**
* **MongoDB**
* **Mongoose**
* **JWT**
* **bcrypt / bcryptjs**
* **Cookie Parser**
* **CORS**
* **dotenv**

---

# System Architecture

```text
                    ┌─────────────────────┐
                    │      SkillSwap      │
                    │    Web Platform     │
                    └──────────┬──────────┘
                               │
                               ▼
                    ┌─────────────────────┐
                    │   React Frontend    │
                    │   TypeScript + Vite │
                    └──────────┬──────────┘
                               │
                         REST API Calls
                               │
                               ▼
                    ┌─────────────────────┐
                    │   Express Backend   │
                    │      Node.js        │
                    └──────────┬──────────┘
                               │
                ┌──────────────┼──────────────┐
                ▼              ▼              ▼
          Authentication    Skills       Skill Requests
                │              │              │
                └──────────────┼──────────────┘
                               ▼
                    ┌─────────────────────┐
                    │       MongoDB       │
                    │      Database        │
                    └─────────────────────┘
```

---

# Project Structure

```text
SkillSwap/
│
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   ├── pages/
│   │   │   ├── auth/
│   │   │   │   ├── Login.tsx
│   │   │   │   └── Signup.tsx
│   │   │   │
│   │   │   └── dashboard/
│   │   │       ├── DashboardHome.tsx
│   │   │       ├── DashboardLayout.tsx
│   │   │       ├── BrowseSkills.tsx
│   │   │       ├── MySwaps.tsx
│   │   │       └── Profile.tsx
│   │   │
│   │   ├── App.tsx
│   │   ├── api.js
│   │   └── main.tsx
│   │
│   ├── package.json
│   └── vite.config.ts
│
└── backend/
    ├── src/
    │   ├── controllers/
    │   │   ├── user.controller.js
    │   │   ├── skill.controller.js
    │   │   ├── requests.controller.js
    │   │   ├── recommendations.controller.js
    │   │   └── resources.controller.js
    │   │
    │   ├── models/
    │   │   ├── user.models.js
    │   │   ├── skill.models.js
    │   │   ├── request.models.js
    │   │   └── resource.models.js
    │   │
    │   ├── routes/
    │   │   ├── user.routes.js
    │   │   ├── skill.routes.js
    │   │   ├── requests.routes.js
    │   │   ├── recommendations.routes.js
    │   │   └── resources.routes.js
    │   │
    │   ├── middlewares/
    │   │   └── auth.middleware.js
    │   │
    │   ├── db/
    │   │   └── database.js
    │   │
    │   ├── utils/
    │   │   ├── apiError.utils.js
    │   │   ├── apiResponse.utils.js
    │   │   ├── asyncHandler.utils.js
    │   │   ├── token.utils.js
    │   │   └── uploader.utils.js
    │   │
    │   └── app.js
    │
    ├── server.js
    └── package.json
```

---

# API Endpoints

The backend provides REST APIs for the main platform functionality.

## Authentication

| Method | Endpoint             | Description                  |
| ------ | -------------------- | ---------------------------- |
| POST   | `/api/auth/register` | Register a new user          |
| POST   | `/api/auth/login`    | Login                        |
| POST   | `/api/auth/logout`   | Logout                       |
| GET    | `/api/auth/profile`  | Get logged-in user's profile |
| PUT    | `/api/auth/profile`  | Update profile               |

## Skills

| Method | Endpoint      | Description          |
| ------ | ------------- | -------------------- |
| GET    | `/api/skills` | Get available skills |

## Recommendations

| Method | Endpoint               | Description                          |
| ------ | ---------------------- | ------------------------------------ |
| GET    | `/api/recommendations` | Get skill-based user recommendations |

## Skill Swap Requests

| Method | Endpoint                   | Description           |
| ------ | -------------------------- | --------------------- |
| POST   | `/api/requests`            | Create a swap request |
| GET    | `/api/requests`            | Get user's requests   |
| PATCH  | `/api/requests/accept/:id` | Accept a request      |
| PATCH  | `/api/requests/reject/:id` | Reject a request      |

## Resources

| Method | Endpoint                        | Description                  |
| ------ | ------------------------------- | ---------------------------- |
| POST   | `/api/resources`                | Create a resource            |
| GET    | `/api/resources`                | Get resources                |
| GET    | `/api/resources/owner/:ownerId` | Get another user's resources |
| PUT    | `/api/resources/:id`            | Update a resource            |
| DELETE | `/api/resources/:id`            | Delete a resource            |
| POST   | `/api/resources/:id/share`      | Share/unshare a resource     |

---

# Database Models

SkillSwap uses MongoDB with Mongoose.

### User

Stores:

* Personal information
* Authentication credentials
* Skills offered
* Skills interested in
* Profile information
* Social links
* Learning progress

### Skill

Stores:

* Skill name
* Skill description
* Creation timestamp

### Request

Stores:

* Sender
* Receiver
* Requested skill
* Offered skill
* Proposal message
* Request status
* Timestamps

### Resource

Stores:

* Resource owner
* Shared users
* Skill
* Title
* Description
* Folder
* Image
* PDF
* Video
* Audio
* External links

---

# Installation & Setup

## Prerequisites

Make sure you have installed:

* Node.js
* npm
* MongoDB
* Git

---

## 1. Clone the Repository

```bash
git clone https://github.com/YOUR-USERNAME/skillswap.git

cd skillswap
```

---

## 2. Setup the Backend

```bash
cd backend
npm install
```

Create a `.env` file inside the backend directory.

Example:

```env
PORT=5000
MONGODB_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret
```

Then start the backend:

```bash
npm run dev
```

The backend will run on:

```text
http://localhost:5000
```

---

## 3. Setup the Frontend

Open another terminal:

```bash
cd frontend
npm install
```

Start the development server:

```bash
npm run dev
```

The frontend will be available at the URL provided by Vite, usually:

```text
http://localhost:5173
```

---

# Environment Variables

The backend requires environment variables for configuration.

```env
PORT=5000
MONGODB_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret
```

**Never commit your `.env` file or secret keys to GitHub.**

Add the following to `.gitignore`:

```text
.env
node_modules/
dist/
```
# How SkillSwap Works

```
User Registration
       │
       ▼
Create Profile
       │
       ├───────────────┐
       ▼               ▼
Skills Offered    Skills Wanted
       │               │
       └───────┬───────┘
               ▼
       Find Compatible Users
               │
               ▼
        Send Swap Request
               │
          ┌────┴────┐
          ▼         ▼
       Accept     Reject
          │
          ▼
    Skill Connection
          │
          ▼
   Exchange Knowledge
          │
          ▼
    Share Resources
```

# Security
The application includes several security mechanisms:
* Password hashing using bcrypt
* JWT authentication
* Protected API routes
* HTTP-only cookie-based authentication
* User authorization through authenticated requests
* Environment variables for sensitive configuration

# Future Improvements
Potential improvements for future versions include:
* Real-time chat between connected users
* Notifications for new requests
* Video calling for learning sessions
* Advanced skill matching
* AI-powered recommendations
* Skill verification and ratings
* Reviews and reputation system
* Real-time learning progress tracking
* Better resource management
* Search and filtering improvements

# Project Goals
SkillSwap aims to make peer-to-peer learning more accessible by allowing people to exchange knowledge instead of relying only on traditional courses.
The idea is simple:
> **You teach what you know. You learn what you want.**

# Contributors
Developed as an academic/project initiative.
**Developer:** Shrawani Wankhede

# License
This project is intended for educational and project-development purposes.
