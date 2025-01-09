# EcoTrack Frontend

EcoTrack is an application designed to monitor and manage environmental data (e.g., carbon footprint, energy consumption). This frontend is built with Next.js 15.1.3 and uses Tailwind CSS with DaisyUI for styling.

## Project Setup & Installation

### Prerequisites
- Node.js 20.x or higher
- npm 9.x or higher (or yarn)
- Git

### Installation Steps
```bash
# Clone the repository
git clone [repository-url]

# Install dependencies
yarn install

# Start development server
yarn dev
```

### Environment Variables
```env
# API configuration
NEXT_PUBLIC_API_URL=http://localhost:3000
```

## Dependencies

```json
{
  "dependencies": {
    "@heroicons/react": "^2.2.0",
    "class-variance-authority": "^0.7.1",
    "clsx": "^2.1.1",
    "daisyui": "^4.12.23",
    "next": "15.1.3",
    "react": "^19.0.0",
    "react-dom": "^19.0.0",
    "tailwind-merge": "^2.6.0"
  }
}
```

## Project Structure

```
frontend/
├── src/
│   ├── app/                    # Next.js 13 App Router
│   │   ├── login/             # Authentication pages
│   │   ├── globals.css        # Global styles
│   │   ├── layout.tsx         # Root layout
│   │   ├── page.tsx           # Home page
│   │   └── favicon.ico        # Site favicon
│   ├── components/            
│   │   ├── home/             # Landing page components
│   │   │   ├── FeatureCard.tsx
│   │   │   ├── FeaturesSection.tsx
│   │   │   └── HeroSection.tsx
│   │   └── layout/           # Layout components
│   │       ├── Layout.tsx     # Main layout wrapper
│   │       ├── Navbar.tsx     # Top navigation
│   │       ├── Sidenav.tsx    # Side navigation
│   │       └── ThemeToggle.tsx # Theme switcher
│   ├── hooks/                # Custom React hooks
│   │   └── useInView.ts      # Intersection Observer hook
│   ├── styles/               # Global styles
│   │   └── globals.css       # Global CSS and Tailwind
│   └── middleware.ts         # Auth & routing middleware
├── public/                   # Static assets
├── .env                      # Environment variables
├── next.config.ts           # Next.js configuration
├── tailwind.config.ts       # Tailwind & DaisyUI config
├── postcss.config.mjs       # PostCSS configuration
├── tsconfig.json            # TypeScript configuration
└── package.json             # Dependencies and scripts
```

## Available Scripts

```bash
# Start development server on port 4000 with Turbopack
yarn dev

# Build for production
yarn build

# Start production server
yarn start

# Run linting
yarn lint
```

## Key Features

1. **Next.js App Router**
   - Modern file-based routing
   - Server components support
   - API routes with automatic rewrites
   - Optimized page loading with Turbopack

2. **DaisyUI Components**
   - Pre-built accessible components
   - Semantic color system
   - Example card component:
   ```tsx
   <div className="card bg-base-100 shadow-xl">
     <div className="card-body items-center text-center">
       <h3 className="card-title text-xl font-bold mb-4">Title</h3>
       <p className="text-base-content/70 mb-6">Description</p>
       <div className="card-actions">
         <button className="btn btn-primary btn-sm">Learn More</button>
       </div>
     </div>
   </div>
   ```

3. **Authentication**
   - Simple token-based auth
   - Protected routes via middleware
   - Login page redirect

## Theme System

### Color Palette

```typescript
// Light Theme
{
  "primary": "#16a34a",          // Green
  "primary-focus": "#f97316",    // Orange overlay
  "secondary": "#2563eb",        // Blue
  "accent": "#f97316",           // Orange
  "base-100": "#ffffff",         // White
  "base-200": "#f3f4f6",         // Light Gray
  "base-300": "#e5e7eb",         // Lighter Gray
  "base-content": "#1f2937",     // Text Color
}

// Dark Theme
{
  "primary": "#22c55e",          // Green
  "primary-focus": "#fb923c",    // Orange overlay
  "secondary": "#3b82f6",        // Blue
  "accent": "#fb923c",           // Orange
  "base-100": "#0f172a",         // Dark Blue
  "base-200": "#1e293b",         // Darker Blue
  "base-300": "#334155",         // Darkest Blue
  "base-content": "#f8fafc",     // Text Color
}
```

### Styling Guidelines

1. **Use DaisyUI Components**
   ```tsx
   // Do this
   <div className="card bg-base-100 shadow-xl">
     <div className="card-body">
       <h2 className="card-title">Title</h2>
     </div>
   </div>

   // Don't do this
   <div className="p-4 rounded-lg shadow-md">
     <h2 className="text-xl font-bold">Title</h2>
   </div>
   ```

2. **Theme Variables**
   ```tsx
   // Do this
   <p className="text-base-content/70">Muted text</p>

   // Don't do this
   <p className="text-gray-600 dark:text-gray-400">Muted text</p>
   ```

3. **Loading States**
   ```tsx
   // Do this
   <div className="skeleton h-4 w-3/4"></div>

   // Don't do this
   <div className="animate-pulse bg-gray-200 h-4 w-3/4"></div>
   ```

## API Configuration

```typescript
// next.config.ts
const nextConfig: NextConfig = {
  async rewrites() {
    return [
      {
        source: '/api/:path*',
        destination: 'http://localhost:3000/api/:path*',
      },
    ];
  },
};
```

## Authentication

```typescript
// middleware.ts
export function middleware(request: NextRequest) {
  const token = request.cookies.get('token');
  const isLoginPage = request.nextUrl.pathname === '/login';

  if (isLoginPage && token) {
    return NextResponse.redirect(new URL('/dashboard', request.url));
  }

  if (!token && !isLoginPage) {
    return NextResponse.redirect(new URL('/login', request.url));
  }

  return NextResponse.next();
}
```

### Protected Routes
- `/dashboard/*` - Requires authentication
- `/login` - Public route

## Contributing

1. Fork the repository
2. Create your feature branch
3. Follow the styling guidelines
4. Submit a pull request

Please ensure your PR:
- Uses DaisyUI components
- Follows the theme system
- Includes TypeScript types
- Passes linting checks

## Learn More

- [Next.js Documentation](https://nextjs.org/docs)
- [Tailwind CSS](https://tailwindcss.com/docs)
- [DaisyUI](https://daisyui.com/docs)
- [class-variance-authority](https://cva.style/docs)
