# Global Events Travels - Admin Panel

A modern admin dashboard for managing blog content, built with Next.js 14, TypeScript, and Tailwind CSS.

## Features

- **Blog Management**: Full CRUD for blog posts with rich text and markdown editors
- **Category System**: Hierarchical categories with parent/child relationships
- **Tag System**: Flat tagging for cross-category content organization
- **Media Library**: Upload and manage images with drag-and-drop support
- **JWT Authentication**: Secure login with token-based auth
- **Modern UI**: Responsive design with Tailwind CSS

## Tech Stack

- **Framework**: Next.js 14 (App Router) with TypeScript
- **Styling**: Tailwind CSS
- **State Management**: Zustand
- **Forms**: React Hook Form + Zod validation
- **Rich Text Editor**: Tiptap (ProseMirror-based)
- **HTTP Client**: Axios
- **Icons**: Lucide React

## Getting Started

### Prerequisites

- Node.js 18+
- Backend API running on `http://localhost:8000`

### Installation

1. Install dependencies:

```bash
cd admin
npm install
```

2. Create environment file:

```bash
cp .env.example .env
```

3. Start development server:

```bash
npm run dev
```

The admin panel will be available at `http://localhost:3001`

### Default Login

- **Email**: `admin@globaleventstravels.com`
- **Password**: `admin123`

## Project Structure

```
admin/
├── src/
│   ├── app/                    # Next.js App Router
│   │   ├── (auth)/             # Auth routes (login)
│   │   ├── (dashboard)/        # Protected dashboard routes
│   │   │   ├── dashboard/      # Main dashboard
│   │   │   └── blog/           # Blog management
│   │   └── layout.tsx          # Root layout
│   ├── components/
│   │   ├── editors/            # Rich text & markdown editors
│   │   ├── forms/              # Form components
│   │   ├── layout/             # Layout components
│   │   └── ui/                 # Reusable UI components
│   ├── lib/                    # Utilities & configs
│   ├── services/               # API service layer
│   ├── store/                  # Zustand stores
│   └── types/                  # TypeScript types
├── package.json
├── tailwind.config.ts
└── tsconfig.json
```

## Available Scripts

- `npm run dev` - Start development server on port 3001
- `npm run build` - Build for production
- `npm run start` - Start production server
- `npm run lint` - Run ESLint

## API Integration

The admin panel connects to the FastAPI backend at the URL specified in `NEXT_PUBLIC_API_URL`.

### Required Backend Endpoints

- `POST /api/v1/auth/login` - JWT authentication
- `GET /api/v1/auth/me` - Get current user
- `GET/POST/PUT/DELETE /api/v1/blog/posts` - Blog CRUD
- `GET/POST/PUT/DELETE /api/v1/blog/categories` - Category management
- `GET/POST/DELETE /api/v1/blog/tags` - Tag management
- `GET/POST/DELETE /api/v1/uploads` - File uploads

## License

Private - Global Events Travels


