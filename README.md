# Multi-Tenant Feature Flag Management System

A SaaS-style multi-tenant feature flag management system built as part of the Byepo Technologies Pragmatist Technical Assessment.

## Overview

This application allows:

- **Super Admins** to create and manage organizations.
- **Organization Admins** to manage feature flags for their own organizations.
- **End Users** to check whether a particular feature is enabled for their organization.

The project follows a layered architecture with Dependency Inversion using **InversifyJS**.

---

## Tech Stack

### Frontend
- Next.js
- TypeScript
- Tailwind CSS

### Backend
- Node.js
- Express
- TypeScript
- MongoDB
- Mongoose
- JWT Authentication
- bcrypt
- InversifyJS

---

## Architecture

The backend follows:

```text
Request
↓
Controller
↓
Use Case Interface
↓
Use Case Implementation
↓
Repository Interface
↓
Repository Implementation
↓
MongoDB
```

Business logic is separated from controllers to maintain clean architecture and follow the Dependency Inversion Principle.

---

## Features

### Super Admin

- Static login
- Create organizations
- View organization list

### Organization Admin

- Signup
- Login
- Feature flag creation
- Update feature flags
- Delete feature flags
- Enable/Disable features

### End User

- Signup
- Login
- Check whether a feature is enabled for their organization

---

## Multi-Tenancy

Feature flags are scoped to organizations.

Users belonging to one organization cannot access feature flags belonging to another organization.

---

# Project Structure

```text
.
├── backend
└── frontend
```

### Backend

```text
backend/
├── src/
│   ├── controllers/
│   ├── domain/
│   │   ├── interfaces/
│   │   ├── repositories/
│   │   └── useCases/
│   ├── infrastructure/
│   ├── repositories/
│   ├── useCases/
│   ├── routes/
│   ├── middleware/
│   ├── config/
│   └── server.ts
```

### Frontend

```text
frontend/
├── src/
│   ├── app/
│   ├── components/
│   ├── services/
│   ├── hooks/
│   └── types/
```

---

# Environment Variables

## Backend

Create:

```text
backend/.env
```

Add:

```env
PORT=***
MONGO_ATLAS_URL=***
JWT_SECRET=***
```

---

## Frontend

Create:

```text
frontend/.env.local
```

Add:

```env
NEXT_PUBLIC_BACKEND_ROUTE=http://localhost:5566
```

---

# Installation

## Clone Repository

```bash
git clone <repository-url>
cd <repository-name>
```

---

## Backend Setup

```bash
cd backend
npm install
```

Run:

```bash
npm run dev
```

Backend runs on:

```text
http://localhost:5566
```

---

## Frontend Setup

```bash
cd frontend
npm install
```

Run:

```bash
npm run dev
```

Frontend runs on:

```text
http://localhost:3000
```

---

# Authentication

### Super Admin

Uses static credentials configured inside the backend.

### Organization Admin & End Users

- Passwords are hashed using bcrypt.
- JWT is used for authentication.

---

# Assumptions

- Multiple Organization Admins can belong to the same organization.
- End Users are associated with a single organization.
- Feature checks are performed using the authenticated user's organization.

---

## Assessment

This project was built for the **Byepo Technologies Pragmatist Technical Assessment**.

---
