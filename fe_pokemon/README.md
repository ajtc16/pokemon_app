# Pokédex Frontend

A production-quality Pokémon web application built with Next.js 14, TypeScript, and TailwindCSS.

## Tech Stack

- **Framework**: Next.js 14 (App Router) - Chosen for SEO capabilities, file-based routing, and React Server Components support
- **Language**: TypeScript - For type safety and better developer experience
- **Styling**: TailwindCSS - Utility-first CSS for rapid UI development matching the Figma design
- **Data Fetching**: TanStack Query (React Query) - For caching, pagination, and background refetching
- **Form Handling**: React Hook Form + Zod - For performant forms with runtime validation
- **Icons**: Lucide React - Lightweight, consistent icon library

## Features

### Authentication
- Login page with form validation (username/password)
- Token-based authentication with expiration handling
- Automatic logout on token expiration
- Protected routes with client-side guards
- Persistent session via localStorage

### Pokédex List
- Paginated Pokemon list (20 items per page)
- Search filter (client-side for current page)
- Sort by name (A-Z, Z-A) or number (ascending, descending)
- URL state preservation (offset, limit, search, sort)
- Responsive grid layout (3-6 columns based on screen size)
- Loading skeletons and error states

### Pokemon Detail
- Type-colored theme based on primary type
- Hero image with official artwork
- About section: weight, height, abilities
- Base stats with visual progress bars
- Moves list with "Show more" toggle
- Forms list (when applicable)
- Back navigation preserving list state

### Design
- Mobile-first responsive design
- Matches Figma design specifications
- Poppins font family
- Pokemon type-specific color palette
- Accessibility: semantic HTML, ARIA labels, focus states

## Getting Started

### Prerequisites

- Node.js 18.17 or later
- npm, yarn, or pnpm

### Installation

1. Clone the repository and navigate to the frontend directory:

```bash
cd fe_pokemon
```

2. Install dependencies:

```bash
npm install
# or
yarn install
# or
pnpm install
```

3. Create environment file:

```bash
cp .env.example .env.local
```

4. Update `.env.local` with your backend API URL:

```env
NEXT_PUBLIC_API_BASE_URL=http://localhost:3000
```

5. Run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
```

6. Open [http://localhost:3000](http://localhost:3000) in your browser.

## Backend API Requirements

The frontend expects the following API endpoints:

### Authentication

```bash
# Login
curl -X POST http://localhost:3000/login \
  -H "Content-Type: application/json" \
  -d '{"username": "user", "password": "pass"}'

# Response:
# {
#   "token": "jwt-token-here",
#   "expires_at": "2024-01-01T00:00:00Z",
#   "user": { "username": "user" }
# }
```

### Pokemon Endpoints (Require Authorization)

```bash
# List Pokemon (paginated)
curl http://localhost:3000/pokemons?offset=0&limit=20 \
  -H "Authorization: Bearer <token>"

# Response:
# {
#   "count": 1302,
#   "next": "...",
#   "previous": null,
#   "results": [{ "name": "bulbasaur", "url": "..." }]
# }

# Get Pokemon Detail
curl http://localhost:3000/pokemons/1 \
  -H "Authorization: Bearer <token>"

# Response: Full Pokemon object with types, abilities, moves, stats, sprites, etc.
```

## Project Structure

```
fe_pokemon/
├── app/                      # Next.js App Router pages
│   ├── globals.css           # Global styles
│   ├── layout.tsx            # Root layout with providers
│   ├── page.tsx              # Home page (Pokemon list)
│   ├── login/
│   │   ├── layout.tsx        # Login page metadata
│   │   └── page.tsx          # Login page
│   └── pokemon/
│       └── [id]/
│           └── page.tsx      # Pokemon detail page
├── components/               # React components
│   ├── ui/                   # Base UI components (Button, Input)
│   ├── skeletons/            # Loading skeleton components
│   ├── AuthGuard.tsx         # Route protection
│   ├── ErrorState.tsx        # Error display
│   ├── Header.tsx            # App header
│   ├── Pagination.tsx        # Pagination controls
│   ├── PokemonCard.tsx       # Pokemon list card
│   ├── SearchBar.tsx         # Search input
│   └── SortSelect.tsx        # Sort dropdown
├── contexts/                 # React contexts
│   ├── AuthContext.tsx       # Authentication state
│   └── QueryProvider.tsx     # React Query provider
├── hooks/                    # Custom hooks
│   ├── useDebounce.ts        # Debounce hook
│   └── usePokemon.ts         # Pokemon data hooks
├── lib/                      # Utilities
│   ├── api.ts                # API client with auth
│   ├── auth.ts               # Token management
│   ├── utils.ts              # Helper functions
│   └── validations.ts        # Zod schemas
├── types/                    # TypeScript types
│   └── index.ts              # All type definitions
├── .env.local                # Environment variables
├── tailwind.config.ts        # Tailwind configuration
└── tsconfig.json             # TypeScript configuration
```

## Scripts

```bash
npm run dev      # Start development server
npm run build    # Build for production
npm run start    # Start production server
npm run lint     # Run ESLint
```

## Authentication Flow

1. User visits protected route → AuthGuard checks token
2. If no token or expired → Redirect to /login
3. User logs in → Token stored in localStorage
4. All API requests include Authorization header
5. On 401 response → Auto logout and redirect to /login
6. Token expiration timer → Auto logout when expired

## URL State Management

The Pokemon list page maintains state in URL params:

- `offset`: Current pagination offset (default: 0)
- `limit`: Items per page (default: 20)
- `search`: Search query (optional)
- `sort`: Sort option (number_asc, number_desc, name_asc, name_desc)

Example: `/?offset=20&limit=20&search=pika&sort=name_asc`

This allows:
- Shareable URLs
- Browser back/forward navigation
- State preservation when returning from detail page

## Error Handling

- **401 Unauthorized**: Auto logout + redirect to login
- **404 Not Found**: "Pokemon not found" message
- **5xx Server Error**: "Service unavailable" message
- **Network Error**: Retry option displayed
- **Empty Results**: Friendly empty state message

## Test Plan

### Manual Testing Checklist

1. **Login Flow**
   - [ ] Form validation shows errors for empty/short inputs
   - [ ] Submit disabled while invalid
   - [ ] Loading state shown during submission
   - [ ] Invalid credentials show error message
   - [ ] Successful login redirects to home
   - [ ] Already logged in → /login redirects to /

2. **Protected Routes**
   - [ ] Unauthenticated user redirected to /login
   - [ ] Token expiration triggers logout
   - [ ] 401 API response triggers logout

3. **Pokemon List**
   - [ ] Pokemon grid loads with images and names
   - [ ] Pagination works (Next/Previous)
   - [ ] URL updates with pagination
   - [ ] Search filters current page results
   - [ ] Sort changes order correctly
   - [ ] Loading skeleton shown during fetch
   - [ ] Error state with retry button

4. **Pokemon Detail**
   - [ ] Page loads with correct Pokemon data
   - [ ] Type colors theme the page
   - [ ] Stats display with progress bars
   - [ ] Moves "Show more" toggle works
   - [ ] Back button returns to list with state
   - [ ] 404 shows appropriate error

5. **Responsive Design**
   - [ ] Mobile: 3-column grid
   - [ ] Tablet: 4-column grid
   - [ ] Desktop: 5-6 column grid
   - [ ] All text readable at all sizes

## License

MIT
