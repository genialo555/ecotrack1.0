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

## UX Libraries and Important Dependencies

- **DaisyUI**: A Tailwind CSS component library that provides pre-built, accessible components, simplifying the design process and ensuring consistency in UI elements.
- **@heroicons/react**: A set of free, MIT-licensed SVG icons designed to work seamlessly with Tailwind CSS, enhancing the visual appeal of the application.
- **react-intersection-observer**: A React implementation of the Intersection Observer API, useful for lazy loading images or triggering animations when elements enter the viewport.
- **react-responsive**: A library for responsive design that helps create a better user experience across different screen sizes.

## Dependencies

The project relies on several key dependencies:
- **Next.js**: A React framework for building server-side rendered applications.
- **React**: A JavaScript library for building user interfaces.
- **Tailwind CSS**: A utility-first CSS framework for creating custom designs.
- **DaisyUI**: As mentioned above, enhances Tailwind CSS with pre-built components.
- **@heroicons/react**: Provides a collection of icons for use in the application.

These libraries and dependencies play a crucial role in enhancing the user experience and maintaining a clean, responsive design.

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
    "react-intersection-observer": "^9.6.0",
    "react-responsive": "^9.0.0",
    "tailwind-merge": "^2.6.0"
  }
}
```

## Directory Structure

The project directory is organized as follows:

```
frontend/
├── .env                    # Contains environment variables
├── README.md               # Project documentation
├── next.config.ts          # Configuration for Next.js
├── package.json            # Project metadata and dependencies
├── tailwind.config.js      # Tailwind CSS configuration
├── tsconfig.json           # TypeScript configuration
├── public/                 # Static assets (images, icons, videos)
│   ├── icons/              # Icon files used in the UI
│   ├── videos/             # Video assets for tutorials or demos
├── src/                    # Main application code
│   ├── app/                # Application components
│   │   ├── globals.css     # Global styles
│   │   ├── layout.tsx      # Main layout component
│   │   └── login/          # Components related to login
│   ├── components/         # Reusable components
│   │   ├── common/         # Shared components
│   │   ├── dashboard/      # Dashboard components
│   │   ├── home/           # Landing page components
│   │   ├── layout/         # Layout components
│   │   └── login/          # Login components
│   ├── hooks/              # Custom React hooks
│   │   ├── useContrastDetection.ts  # Hook for contrast detection
│   │   ├── useCurrentSection.ts    # Hook for tracking current section
│   │   ├── useInView.ts          # Hook for intersection observer
│   │   ├── useIsMobile.ts         # Hook for mobile detection
│   │   └── useScrollAnimation.ts   # Hook for scroll animations
│   ├── lib/                # Utility functions
│   │   └── utils.ts        # General utility functions
│   └── styles/             # (Currently empty, intended for future styles)
```

### Additional Notes
- **Environment Variables**: Sensitive information should be stored in the `.env` file.
- **Static Assets**: The `public` directory contains static assets like images and videos used throughout the application.
- **Custom Hooks**: The `hooks` directory contains custom hooks that provide reusable functionality across components.
- **Configuration Files**: The `next.config.ts` and `tailwind.config.js` files are crucial for configuring the Next.js application and Tailwind CSS, respectively.

## Installation Instructions

To set up the project locally, follow these steps:

1. Clone the repository:
   ```bash
   git clone [repository-url]
   ```
2. Navigate to the project directory:
   ```bash
   cd ecotrak/frontend
   ```
3. Install dependencies:
   ```bash
   yarn install
   ```
4. Start the development server:
   ```bash
   yarn dev
   ```

## Usage

To run the application locally, use the following command:
```bash
yarn dev
```
This will start the development server on port 4000.

## Contributing Guidelines

Contributions are welcome! Please follow these steps to contribute:
1. Fork the repository.
2. Create a new feature branch.
3. Ensure your code adheres to the project's coding standards.
4. Submit a pull request detailing your changes.

## License

This project is licensed under the MIT License. See the LICENSE file for details.

## Home Components

- **FeaturesSection**: Implements animations based on scroll position and includes logic for special delays for specific features, enhancing user engagement.
- **ContactSection**: Utilizes the `useInView` hook for animations, creating a visually engaging contact section.
- **StatsSection**: Manages statistics display with hover effects and typing animations, making the information more interactive.
- **DashboardSection**: Uses scroll animations for the dashboard, improving the overall user experience.

## Layout Components

- **Navbar**: Handles user authentication state and scroll detection, ensuring that the navigation bar responds to user interactions.
- **ThemeToggle**: Allows users to switch between light and dark themes, enhancing accessibility.
- **Footer**: Contains the footer layout and information.

## Common Components

- **Button**: A reusable button component that supports various props for customization, making it flexible for different use cases.
- **Card**: A generic card component for displaying content, which can be reused across the application.

## Custom Hooks

- **useInView**: A custom hook that tracks whether an element is in the viewport, used for triggering animations.
- **useScrollAnimation**: Implements scroll-based animations for components, enhancing visual feedback.

## Utility Functions

- **utils.ts**: Contains the `cn` function, which combines class names and resolves conflicts, ensuring clean and maintainable styling.

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

3. **Animations**: The application includes scroll and hover animations to enhance user engagement. Components like `FeaturesSection`, `ContactSection`, and `DashboardSection` utilize the `useInView` hook to trigger animations based on the user's scroll position, creating a dynamic and interactive experience.

4. **Authentication Handling**: The `Navbar` component manages user authentication state, ensuring that users are redirected appropriately based on their login status. This flow is crucial for maintaining a secure and user-friendly application.

5. **Responsive Design**: The application employs responsive design practices through libraries like `react-responsive`, ensuring that it is accessible and usable across various devices and screen sizes.

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
