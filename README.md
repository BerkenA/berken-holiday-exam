# Holidaze — Accommodation Booking Application

Welcome to **Holidaze**, a modern accommodation booking web application built as part of the FED2 Exam project. Holidaze allows users to search, book, and manage holiday venues while providing venue managers with tools to create and manage their venues and bookings.

---

## Table of Contents

- [Project Overview](#project-overview)  
- [Features](#features)  
- [Tech Stack](#tech-stack)  
- [Getting Started](#getting-started)  
- [Available Scripts](#available-scripts)  
- [API](#api)  
- [Design & Planning](#design--planning)  
- [Deployment](#deployment)  
- [Acknowledgments](#acknowledgments)

---

## Project Overview

This project was developed to demonstrate comprehensive front-end development skills, including UI design, API integration, state management, and deployment. The app interfaces with the official Holidaze API to fetch and manipulate data related to venues and bookings.

Users can register as either customers or venue managers, login/logout, and access features based on their role:

- **Customers** can browse venues, book stays, and manage their profile and bookings.
- **Venue Managers** can create, update, and delete venues they manage, and view bookings for their venues.

---

## Features

- User registration and login with role-based access (Customer or Venue Manager).
- Browse, search, and view detailed venue information.
- Calendar view indicating available and booked dates.
- Create, update, and delete bookings.
- Venue creation, editing, and deletion for managers.
- Profile management including avatar upload.
- Responsive design for desktop and mobile.
- Notifications and alerts for user actions.
- Smooth navigation and UI feedback.

---

## Tech Stack

- **Frontend:** React 18, Zustand (state management), React Router DOM  
- **Styling:** Tailwind CSS, React Helmet Async for SEO  
- **Notifications:** React Toastify  
- **Date Handling:** date-fns, react-date-range  
- **Build Tool:** Vite  
- **Code Quality:** ESLint with React hooks plugin

---

## Getting Started

### Prerequisites

- Node.js (>= 18 recommended)
- npm or yarn

### Installation

1. Clone the repository:

```bash
git clone https://github.com/yourusername/berken-holiday-exam.git
cd berken-holiday-exam
```

2. Install dependencies

```bash
npm install
# or
yarn install
```

3. Create a .env file in the root directory and add the following enviroment variables:
    
```bash
VITE_API_URL=https://your-api-url.com
VITE_API_KEY=your-api-key
```

Start the development server:
```bash
npm run dev
# or
yarn dev
```
Open http://localhost:5173 (or the port Vite specifies) to view the app in your browser.

## Available scripts
- npm run dev — Starts the development server

- npm run build — Builds the production bundle

- npm run preview — Previews the production build locally

- npm run lint — Runs ESLint to check code quality

## API 
- The app uses the official Holidaze API for all backend interactions.
- Authentication handled with JWT tokens.
- Endpoints for profiles, venues, bookings, and user management.
- For more API info visit https://docs.noroff.dev/docs/v2

## Design & Planning
- UI and UX were planned using Figma with separate prototypes for desktop and mobile.
- Project management was handled via GitHub Projects using a Kanban board.
- The style guide includes logo, fonts, colors, and common UI components to maintain design consistency.

## Acknowledgments
- Noroff for providing the Holidaze API and exam brief.
- React and Vite communities for excellent tools and libraries.
- Design inspiration from various modern booking platforms.

Thank you for checking out Holidaze!

## Author
[Berken Ates](https://github.com/BerkenA)
