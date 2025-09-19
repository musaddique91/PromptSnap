# Overview

This is a full-stack image gallery application built with React and Express.js. The application allows users to browse, upload, and manage images organized by categories. It features a modern dark-themed UI with image viewing capabilities, prompt display for AI-generated art, and an admin interface for content management.

# User Preferences

Preferred communication style: Simple, everyday language.

# System Architecture

## Frontend Architecture
- **Framework**: React 18 with TypeScript, using Vite as the build tool
- **UI Library**: Shadcn/ui components built on Radix UI primitives with Tailwind CSS for styling
- **Routing**: Wouter for lightweight client-side routing
- **State Management**: TanStack Query (React Query) for server state management and API caching
- **Styling**: Tailwind CSS with CSS variables for theming, custom dark theme implementation
- **Form Handling**: React Hook Form with Zod validation

## Backend Architecture
- **Server**: Express.js with TypeScript
- **Development Setup**: Custom Vite integration for development mode with HMR support
- **File Upload**: Multer middleware for handling image uploads with file validation
- **API Design**: RESTful API endpoints for categories and images CRUD operations
- **Error Handling**: Centralized error handling middleware with proper status codes

## Data Storage Solutions
- **Database**: PostgreSQL configured through Drizzle ORM
- **Schema Management**: Drizzle Kit for migrations and schema management
- **Connection**: Neon Database serverless PostgreSQL connection
- **File Storage**: Local file system storage for uploaded images in client/uploads directory
- **In-Memory Fallback**: Memory storage implementation as fallback with default categories

## Authentication and Authorization
- **Current State**: No authentication system implemented
- **Admin Access**: Simple URL-based admin panel access (/admin/musa/upload)
- **Security**: Basic file type validation for uploads, file size limits (10MB)

## External Dependencies
- **Database Provider**: Neon Database (serverless PostgreSQL)
- **UI Components**: Radix UI primitives for accessible component foundation
- **Development Tools**: Replit-specific Vite plugins for cartographer and dev banner
- **Build Tools**: ESBuild for server-side bundling, Vite for client-side bundling
- **File Handling**: Multer for multipart form handling and file uploads
- **Date Utilities**: date-fns for date formatting and manipulation
- **Validation**: Zod schema validation with Drizzle Zod integration

## Key Features
- Image gallery with category filtering and search functionality
- Drag-and-drop image upload with preview
- Image prompt display and copying for AI-generated content
- Responsive design with mobile support
- Image liking system with persistent counts
- Admin panel for image management and deletion
- Real-time search and filtering capabilities
- File download functionality

## Database Schema
The application uses two main entities:
- **Categories**: Stores image categories with name, slug, and image count
- **Images**: Stores image metadata including filename, prompt, category relationship, likes, and file information

The schema is defined using Drizzle ORM with PostgreSQL-specific types and includes automatic UUID generation and timestamp handling.