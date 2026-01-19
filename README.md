# Pokémon Full-Stack Application & GenAI Exercise

This repository contains two related projects developed as part of a technical interview exercise:

1. **A full-stack Pokémon application** (React + custom backend)
2. **A Generative AI coding exercise** demonstrating prompt engineering, validation, and critical review of AI-generated code

The goal of this repository is to showcase clean architecture, frontend and backend best practices, and responsible use of Generative AI tools.

---

## 1. Pokémon Full-Stack Application

### 📖 Project Overview

A full-stack Pokémon application that allows users to authenticate, browse, search, sort, and view detailed Pokémon information.  
The application consumes data from the public **PokéAPI**, mediated through a lightweight custom backend.

The app was built with scalability, clean separation of concerns, and responsiveness in mind.

---

### 👤 User Story

> As a user, I want to log into a Pokémon application so that I can securely browse, search, and explore detailed information about Pokémon in a simple and intuitive interface.

---

### ✨ Features

#### Authentication
- Login with username and password
- Valid credentials: `admin / admin`
- Invalid credentials are rejected with proper validation feedback
- User session persists using local storage
- Protected routes:
    - Authenticated users cannot access the login page
    - Unauthenticated users cannot access protected pages

#### Main Pokémon List
- Paginated Pokémon list
- Search by Pokémon name
- Sort by:
    - Name
    - Pokémon number
- Each Pokémon card displays:
    - Image
    - Name
    - Number

#### Pokémon Detail View
- Detailed Pokémon page with:
    - Abilities
    - Moves
    - Forms

#### UI & UX
- Responsive design (mobile-first, adapted for larger screens)
- SEO considerations
- Design based on provided Figma guidelines

---

### 🏗 Architecture

- **Frontend**
    - React
    - Component-based architecture
    - Protected routing
    - Clear separation between UI, state, and services

- **Backend**
    - Lightweight custom API
    - Acts as a proxy to PokéAPI
    - Centralizes authentication and data fetching logic

- **Backend Endpoints**
    - `POST /login` – validates credentials
    - `GET /pokemons` – paginated Pokémon list
    - `GET /pokemons/:id` – Pokémon detail

---

### 🧪 Testing & Quality

- Focus on clean, readable, and maintainable code
- Architecture designed to support future features
- Emphasis on predictable data flow and separation of concerns
- No unnecessary console warnings or errors

---

## 2. Generative AI Exercise – Task Management Table


### 🤖 GenAI Tool Used

**Claude** was used to assist with:
- Generating API scaffolding
- Proposing data models
- Suggesting validation and edge-case handling

---

### 📝 Prompt Used (Example)

> _"You are a senior Ruby on Rails backend engineer. Build an API-only Ruby on Rails app that acts as a lightweight backend proxy on top of PokeAPI (https://pokeapi.co/), which is the source of truth for Pokémon data.
>
>GOALS
>- Provide a small, clean Rails API with 3 core endpoints:
    1) POST /login (credentials authorization: admin/admin)
    2) GET /pokemons (paginated list, same pagination behavior as PokeAPI)
    3) GET /pokemons/:id (detailed Pokémon info by id)
>- Keep it lightweight: no full auth framework required.
>- You MAY add additional endpoints if needed (e.g., /health, /me, /logout), but keep scope small and justified.
>- Use PokeAPI as source of truth; do not store Pokémon data in DB.
>- Provide clear instructions to run locally and to test via curl.
>
>TECHNICAL REQUIREMENTS
>1) Ruby on Rails
>- Use Rails API-only mode.
>- Ruby 3.x, Rails 7.x (or latest stable if you prefer).
>- Prefer standard Rails structure: controllers, services, concerns, etc.
>
>2) Authentication (lightweight)
>- Implement POST /login that accepts JSON:
   >  { "username": "admin", "password": "admin" }
>- If valid, return a token that the client must use in subsequent calls.
>- Keep it simple:
   >    - Use stateless signed tokens (Rails signed cookies, MessageVerifier, or JWT if you prefer).
>    - Avoid Devise unless absolutely necessary.
>- All /pokemons endpoints require Authorization header:
   >  Authorization: Bearer <token>
>- Token expiration:
   >    - Implement a simple expiration (e.g., 24 hours) and validate it.
>- Error behavior:
   >    - invalid credentials => 401 with JSON error
>    - missing/invalid token => 401 with JSON error
>    - expired token => 401 with JSON error
>
>3) PokeAPI Proxying
>- Use PokeAPI endpoints:
   >    - List: GET https://pokeapi.co/api/v2/pokemon?offset=X&limit=Y
>    - Detail: GET https://pokeapi.co/api/v2/pokemon/{id or name}
>- Your backend endpoints:
   >    - GET /pokemons?offset=0&limit=20
 >     - Mirror PokeAPI pagination: return JSON with keys: count, next, previous, results
         >        - results must include name and url (as in PokeAPI), but also add id if you can parse it from url.
         >- Ensure you pass offset/limit to PokeAPI; if omitted, default to offset=0, limit=20.
         >- Validate offset and limit:
         >            - offset >= 0
         >           - limit within 1..100 (or 200 max) to prevent abuse
         >   - invalid => 400 with JSON error
>   - GET /pokemons/:id
      >        - :id can be numeric id. (Optionally support name too; if you do, document it.)
      >  - Return a “detailed” JSON response derived from PokeAPI detail response.
      >  - Include at least:
      >      - id, name, height, weight, base_experience
      >      - types (array of type names)
      >      - abilities (array of ability names + is_hidden)
      >      - sprites (front_default, official artwork if available)
      >      - stats (hp, attack, defense, special-attack, special-defense, speed)
      >  - If PokeAPI returns 404 => your API returns 404 with JSON error
      >  - Handle upstream errors (timeouts, 5xx) => return 502 with JSON error
>
>4) HTTP Client, Timeouts, Caching
>- Implement a dedicated service object (e.g., PokeapiClient) using Faraday (preferred) or Net::HTTP.
>- Configure:
   >    - Base URL
> - JSON parsing
    >    - sensible timeouts (open/read), e.g. 2s/5s
>- Add basic caching to reduce repeated calls:
   >    - Use Rails.cache (memory store in dev) to cache:
          >     - pokemon list pages by offset+limit for e.g., 60 seconds
          >- pokemon detail by id for e.g., 5 minutes
          >- Include cache keys and TTLs in code.
>
>5) API Design / Response Format
>- All responses are JSON.
>- Provide consistent error format:
   >  { "error": { "code": "SOME_CODE", "message": "Human readable message" } }
>- Use proper status codes:
   >    - 200 for success
>    - 201 optional for login (or 200)
>    - 400 invalid params
>    - 401 auth errors
>    - 404 not found
>    - 502 upstream error
>- Use strong parameter handling.
>
>6) Rails Structure (expected files)
>- routes.rb defining /login, /pokemons, /pokemons/:id (and any extra endpoints)
>- controllers:
   >    - AuthController (login)
> - PokemonsController (index, show)
>- services:
   >    - TokenService (issue/verify tokens)
> - PokeapiClient (list, detail)
>- concerns / middleware:
   >    - Authentication concern to protect endpoints
>
>7) Deliverables in your response
    >   A) Provide the full code structure and key files content:
>- Gemfile additions (faraday etc.)
>- config/initializers for caching or faraday if needed
>- app/controllers/auth_controller.rb
>- app/controllers/pokemons_controller.rb
>- app/controllers/concerns/authentication.rb (or similar)
>- app/services/token_service.rb
>- app/services/pokeapi_client.rb
>- config/routes.rb
>- Any supporting code
>
>B) Provide setup/run instructions:
>- rails new ... --api
>- bundle install
>- rails server
>- examples with curl:
   >    - login
> - list pokemons with offset/limit
    >    - show pokemon by id
>
>C) Provide testing guidance (minimal):
>- Suggest request specs (RSpec optional) OR Rails default minitest.
>- At least show a few example tests OR a test plan:
   >    - login success/failure
> - access /pokemons without token
    >    - pagination params validation
    >- show 404 behavior
>
>D) Provide notes on decisions and tradeoffs (brief):
>- why your token approach
>- caching strategy
>- how you handle upstream failures
>
>CONSTRAINTS
>- Keep it simple and readable.
>- Do not add a real user database; only admin/admin is valid.
>- Do not store Pokémon in a DB.
>- Prefer clarity over cleverness.
>
>Now produce the implementation with code blocks per file and clear headings.
>"_

For the FE

You are a senior frontend engineer. Build a production-quality Pokémon web app frontend that integrates with a lightweight backend API (that I built) which exposes:

- POST /login  -> returns { token, expires_at, user: { username } } (or similar)
- GET /pokemons?offset=&limit= -> paginated list mirroring PokeAPI shape: { count, next, previous, results: [{ name, url, id? }] }
- GET /pokemons/:id -> detailed pokemon data including id, name, types, abilities, moves, forms, sprites, stats, etc.
  All /pokemons endpoints require: Authorization: Bearer <token>

FRONTEND STACK (choose and justify briefly)
- Use Next.js (App Router) + TypeScript (preferred for SEO + routing).
- Styling: TailwindCSS (preferred). You may use a component library if it helps but keep it light.
- State management: keep simple (React state + context) or lightweight store (Zustand). Avoid overengineering.
- Data fetching: use React Query (TanStack Query) OR Next fetch with caching. Prefer React Query for pagination + caching.
- Form validation: react-hook-form + zod (preferred) OR similar.

FEATURE REQUIREMENTS

1) Login screen
- Route: /login
- UI: username + password form, submit button, inline validation.
- Validate:
    - required fields
    - trim whitespace
    - min length (e.g., 3)
    - disable submit while invalid/submitting
    - show backend error messages (invalid credentials)
- On submit:
    - call POST /login with JSON { username, password }
    - if success: store token and expiration in a storage you choose (localStorage recommended; cookies allowed).
    - redirect to main page ("/")
- Auth flow rules:
    - If user is already logged in (valid token not expired), visiting /login should redirect to "/"
    - If user is not logged in or token is invalid/expired, visiting protected routes should redirect to /login

2) Protected routes & auth strategy
- Implement a robust auth guard:
    - token presence + expiration
    - handle token expiration gracefully (auto logout + redirect to /login)
- Protect:
    - "/" main list page
    - "/pokemon/[id]" detail page
- Provide a Logout button that clears auth storage and redirects to /login.

3) Main page (Home)
- Route: "/"
- Layout:
    - Top bar with app name + logout button
    - Search bar
    - Sort control
    - Pokémon list with pagination controls
- Fetch:
    - GET /pokemons?offset=0&limit=20 by default
    - implement pagination UI:
        - “Next” / “Previous”
        - show current range (e.g., 1–20 of 1302)
        - keep offset/limit in URL query params so it’s shareable: /?offset=0&limit=20&search=&sort=name_asc
- List item:
    - photo (sprite) + Pokémon name + number
    - Clicking takes user to detail page
- Sorting:
    - sort by name and number
    - both ascending & descending
    - IMPORTANT: The API list results may not include full data for images. Use one of these strategies (pick one and implement):
      A) Derive id from results.url, then construct image URL (official sprite/artwork) without calling detail for each item.
        - Example: official artwork from github/pokeapi sprite repo OR use backend list endpoint to include image_url.
          B) Batch fetch details for the current page (20 items) in parallel with rate limiting and caching (prefer A to reduce calls).
- Search:
    - Search should filter results by name (client-side for current page OR across pages).
    - Preferred: implement “search by name” by calling GET /pokemons/:id where :id is name (if backend supports), OR implement a backend endpoint /pokemons/search?query=.
    - If backend doesn’t support global search, implement client-side filtering on current loaded page and clearly label it.
    - Debounce search input (300ms).

4) Detail view
- Route: "/pokemon/[id]"
- Fetch:
    - GET /pokemons/:id using token
- Display:
    - Hero section: image + name + number + types
    - Sections: Abilities, Moves, Forms
    - Show lists with sensible truncation:
        - Moves can be huge; show first N (e.g., 20) with a “Show more” toggle
    - Provide a Back button to return to list preserving query params (offset/limit/search/sort)

5) Design requirements (Figma)
- I will provide a Figma design separately. For now:
    - Implement a clean mobile-first layout that adapts to larger screens.
    - Use spacing, typography, and a card-based list UI suitable for mobile.
    - Provide a responsive grid on larger screens (e.g., 2–4 columns)
- Ensure accessibility:
    - semantic HTML
    - aria labels for inputs/buttons
    - focus states
    - sufficient contrast

6) SEO + performance
- Use Next.js metadata for each page:
    - /login: "Login | Pokemon App"
    - /: "Pokédex | Pokemon App"
    - /pokemon/[id]: "Bulbasaur (#1) | Pokemon App" (use fetched data)
- Use SSR or dynamic rendering thoughtfully:
    - Authenticated pages usually require client-side auth; still implement basic metadata and avoid layout shifts.
- Optimize images (Next/Image).
- Add loading states (skeletons) and error states (friendly messages).

7) Error handling
- Handle backend errors:
    - 401: auto logout + redirect to /login
    - 404: show not found UI on detail page
    - 5xx/502: show “Service unavailable”
- Show empty states:
    - no search results
    - no data

DELIVERABLES (what you must output)
A) Project setup steps
- Create Next.js app commands
- Install dependencies
- Tailwind setup
- Environment variables for API base URL (NEXT_PUBLIC_API_BASE_URL)

B) Full implementation with file-by-file code blocks
- app/layout.tsx
- app/login/page.tsx
- app/page.tsx (main list)
- app/pokemon/[id]/page.tsx (detail)
- components (SearchBar, PokemonCard, Pagination, SortSelect, Skeletons)
- lib/api.ts (fetch wrapper that injects Authorization header + handles 401)
- lib/auth.ts (token storage, expiration checks)
- middleware.ts OR client-side route protection strategy (choose best)
    - If using middleware, ensure you don’t leak token to server if stored in localStorage; explain tradeoff.
    - If using cookies, show secure config for dev.
- types.ts for API types
- Optional: Zustand store or React context for auth state

C) Example usage
- Provide curl examples for backend (brief)
- Provide steps to run frontend and connect to backend
- Provide a short test plan (or include a few Playwright tests if you want)

CONSTRAINTS
- Keep it readable and pragmatic.
- Do not invent backend endpoints unless you clearly implement fallbacks.
- Preserve pagination state in the URL.
- Protect routes as specified.

Now generate the full Next.js + TypeScript implementation with clean, complete code.

---


### 🔍 Validation & Improvements

After reviewing the AI-generated output, the following steps were taken:

- **Validated correctness**
    - Ensured CRUD logic matched requirements
    - Verified data integrity and relationships

- **Improvements made**
    - Strengthened validation rules
    - Improved naming consistency
    - Simplified overly complex logic
    - Adjusted structure to better align with clean architecture

- **Edge cases handled**
    - Missing required fields
    - Invalid task status
    - Non-existent task IDs
    - Unauthorized access scenarios

- **Performance & quality assessment**
    - Ensured idiomatic usage of the chosen language/framework
    - Avoided unnecessary abstractions
    - Reviewed for readability and maintainability

---

### 💡 Approach to GenAI Usage

Claude was used as a **development assistant**, not a source of truth.

- All AI output was critically reviewed
- Code was adapted and refined manually
- Decisions were made based on best practices, not blindly accepted

This approach reflects responsible and professional use of Generative AI tools in a real-world development environment.

---

## 🚀 How to Run the Project

> Instructions may vary depending on your setup.  
> See frontend and backend folders for specific run commands.

General steps:
1. Install dependencies
2. Start backend server
3. Start frontend application
4. Access the app via browser

---
