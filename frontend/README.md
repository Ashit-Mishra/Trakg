# Attendance Tracker ERP Frontend

A complete React frontend for an Attendance Tracker ERP web application. Designed with a premium "Apple Website" aesthetic featuring frosted glass components, subtle animations, and large rounded corners.

## Features

- **Role-based Access Control**: Distinct layouts and views for Admins, Teachers, and Students.
- **Premium Design System**: Tailwind CSS with custom utility classes for `backdrop-filter` (glassmorphism), custom color palette, and `Inter`/`SF Pro Display` typography.
- **State & Data**: `zustand` for auth state and `@tanstack/react-query` for server state and caching.
- **Form Handling**: `react-hook-form` + `zod` schema validation.
- **Charts**: Interactive attendance charts using `recharts`.

## Tech Stack

- React 18 + Vite
- TypeScript
- Tailwind CSS
- React Router v6
- React Query & Axios
- Zustand
- Lucide React (Icons)

## Setup Instructions

1. **Clone the repository** (if applicable)
2. **Install dependencies**:
   ```bash
   npm install
   ```
3. **Environment Variables**:
   Copy the `.env.example` file to `.env`:
   ```bash
   cp .env.example .env
   ```
   Ensure `VITE_API_BASE_URL` points to your backend REST API.
4. **Run the development server**:
   ```bash
   npm run dev
   ```

## Note on Backend
This repository contains **only the frontend application**. It expects a REST API to be running at the `VITE_API_BASE_URL` that adheres to the endpoint structures defined in `/src/api/`.

## Folder Structure

- `/src/api`: Axios client setup and service functions (one per resource).
- `/src/components/ui`: Reusable, styled base UI components (Button, Input, Card, Modal, DataTable).
- `/src/components/layout`: Shared layouts (Sidebar, Topbar, AppShell) and RoleGuard.
- `/src/pages`: Feature pages grouped by role (`/admin`, `/teacher`, `/student`, `/auth`).
- `/src/context`: Zustand state stores.
- `/src/types`: TypeScript interfaces for the API resources.
- `/src/lib`: Utility functions (e.g., tailwind `cn` merger).

## License
MIT
