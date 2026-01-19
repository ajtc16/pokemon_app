# Pokemon API Proxy

A lightweight Ruby on Rails API that acts as a backend proxy on top of [PokeAPI](https://pokeapi.co/).

## Features

- **Authentication**: Simple token-based auth with 24-hour expiration
- **Pokemon List**: Paginated list of Pokemon with configurable offset/limit
- **Pokemon Details**: Detailed Pokemon info including types, abilities, stats, and sprites
- **Caching**: Automatic caching of PokeAPI responses to reduce load
- **Error Handling**: Consistent JSON error responses

## Requirements

- Ruby 3.2.x
- Rails 8.1.x
- SQLite 3
- **Windows**: MSYS2 with MINGW development toolchain (for native extensions)

## Setup

### Windows Prerequisites

If you're on Windows and encounter native extension build errors, install the MSYS2 toolchain:

```bash
ridk install 3
```

Or reinstall Ruby using RubyInstaller with the MSYS2 development toolchain option enabled.

### 1. Clone and Install Dependencies

```bash
cd api_pokemon
bundle install
```

### 2. Setup Database

```bash
bin/rails db:prepare
```

### 3. Start the Server

```bash
bin/rails server
```

The API will be available at `http://localhost:3000`.

## API Endpoints

### Health Check

```
GET /up
```

Returns 200 if the app is running.

### Authentication

#### POST /login

Authenticate and receive a token.

**Request:**
```bash
curl -X POST http://localhost:3000/login \
  -H "Content-Type: application/json" \
  -d '{"username": "admin", "password": "admin"}'
```

**Response (200 OK):**
```json
{
  "token": "eyJfcmFpbHMiOnsibWVzc2FnZSI6...",
  "token_type": "Bearer",
  "expires_in": 86400
}
```

**Error Response (401 Unauthorized):**
```json
{
  "error": {
    "code": "INVALID_CREDENTIALS",
    "message": "Invalid username or password"
  }
}
```

### Pokemon Endpoints

All Pokemon endpoints require authentication via Bearer token.

#### GET /pokemons

Get a paginated list of Pokemon.

**Parameters:**
- `offset` (optional): Pagination offset, default 0
- `limit` (optional): Number of results, 1-100, default 20

**Request:**
```bash
# Get first 20 Pokemon
curl http://localhost:3000/pokemons \
  -H "Authorization: Bearer YOUR_TOKEN"

# Get Pokemon 21-40
curl "http://localhost:3000/pokemons?offset=20&limit=20" \
  -H "Authorization: Bearer YOUR_TOKEN"
```

**Response (200 OK):**
```json
{
  "count": 1302,
  "next": "https://pokeapi.co/api/v2/pokemon?offset=20&limit=20",
  "previous": null,
  "results": [
    {
      "id": 1,
      "name": "bulbasaur",
      "url": "https://pokeapi.co/api/v2/pokemon/1/"
    },
    {
      "id": 2,
      "name": "ivysaur",
      "url": "https://pokeapi.co/api/v2/pokemon/2/"
    }
  ]
}
```

#### GET /pokemons/:id

Get detailed information about a specific Pokemon.

**Request:**
```bash
# By ID
curl http://localhost:3000/pokemons/25 \
  -H "Authorization: Bearer YOUR_TOKEN"

# By name (also supported)
curl http://localhost:3000/pokemons/pikachu \
  -H "Authorization: Bearer YOUR_TOKEN"
```

**Response (200 OK):**
```json
{
  "id": 25,
  "name": "pikachu",
  "height": 4,
  "weight": 60,
  "base_experience": 112,
  "types": ["electric"],
  "abilities": [
    { "name": "static", "is_hidden": false },
    { "name": "lightning-rod", "is_hidden": true }
  ],
  "sprites": {
    "front_default": "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/25.png",
    "official_artwork": "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/25.png"
  },
  "stats": {
    "hp": 35,
    "attack": 55,
    "defense": 40,
    "special-attack": 50,
    "special-defense": 50,
    "speed": 90
  }
}
```

## Error Responses

All errors follow a consistent format:

```json
{
  "error": {
    "code": "ERROR_CODE",
    "message": "Human readable message"
  }
}
```

### Error Codes

| Code | HTTP Status | Description |
|------|-------------|-------------|
| `INVALID_CREDENTIALS` | 401 | Invalid username or password |
| `MISSING_TOKEN` | 401 | Authorization header not provided |
| `INVALID_TOKEN` | 401 | Token signature is invalid |
| `EXPIRED_TOKEN` | 401 | Token has expired |
| `INVALID_OFFSET` | 400 | Offset must be a non-negative integer |
| `INVALID_LIMIT` | 400 | Limit must be between 1 and 100 |
| `NOT_FOUND` | 404 | Pokemon not found |
| `UPSTREAM_ERROR` | 502 | PokeAPI is unavailable or returned an error |
| `INTERNAL_ERROR` | 500 | Unexpected server error |

## Complete Example Session

```bash
# 1. Login to get a token
TOKEN=$(curl -s -X POST http://localhost:3000/login \
  -H "Content-Type: application/json" \
  -d '{"username": "admin", "password": "admin"}' | jq -r '.token')

echo "Token: $TOKEN"

# 2. Get first 5 Pokemon
curl -s "http://localhost:3000/pokemons?limit=5" \
  -H "Authorization: Bearer $TOKEN" | jq

# 3. Get Pikachu details
curl -s http://localhost:3000/pokemons/25 \
  -H "Authorization: Bearer $TOKEN" | jq

# 4. Get Pokemon by name
curl -s http://localhost:3000/pokemons/charizard \
  -H "Authorization: Bearer $TOKEN" | jq
```

## Running Tests

```bash
bin/rails test
```

### Test Coverage

The test suite covers:
- Authentication (login success/failure)
- Token validation (missing, invalid, expired tokens)
- Pagination parameter validation
- Pokemon list and detail endpoints
- Error handling for non-existent Pokemon

## Project Structure

```
app/
├── controllers/
│   ├── application_controller.rb    # Base API controller
│   ├── auth_controller.rb           # Login endpoint
│   ├── pokemons_controller.rb       # Pokemon endpoints
│   └── concerns/
│       └── authenticatable.rb       # Authentication concern
└── services/
    ├── token_service.rb             # Token generation/verification
    └── pokeapi_client.rb            # PokeAPI HTTP client
```

## Design Decisions

### Token Approach
- Uses Rails `MessageVerifier` for stateless signed tokens
- Tokens include expiration timestamp, validated on each request
- 24-hour expiration for reasonable session duration
- No database storage required (stateless)

### Caching Strategy
- Pokemon list cached for 60 seconds (frequently changes less)
- Pokemon details cached for 5 minutes (static data)
- Memory store in development, can be swapped for Redis in production
- Cache keys include all relevant parameters

### Upstream Error Handling
- 2-second connection timeout, 5-second read timeout
- PokeAPI 404 → API returns 404
- PokeAPI 5xx/timeout → API returns 502 with generic message
- Errors are logged but not exposed to clients

## Configuration

### Environment Variables

| Variable | Description | Default |
|----------|-------------|---------|
| `RAILS_ENV` | Environment (development/test/production) | development |
| `SECRET_KEY_BASE` | Secret for token signing | Auto-generated |
| `PORT` | Server port | 3000 |

### Cache Configuration

Edit `config/environments/development.rb` to change cache store:

```ruby
# Memory store (default)
config.cache_store = :memory_store, { size: 64.megabytes }

# Redis (for production)
config.cache_store = :redis_cache_store, { url: ENV["REDIS_URL"] }
```

## License

MIT
