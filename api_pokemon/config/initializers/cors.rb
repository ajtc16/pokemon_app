# frozen_string_literal: true

# Configure CORS to allow frontend applications to access the API
Rails.application.config.middleware.insert_before 0, Rack::Cors do
  allow do
    # In development, allow requests from any localhost port
    origins "http://localhost:3001", "http://127.0.0.1:3001",
            "http://localhost:3000", "http://127.0.0.1:3000",
            "http://localhost:5173", "http://127.0.0.1:5173"  # Vite default port

    resource "*",
      headers: :any,
      methods: [ :get, :post, :put, :patch, :delete, :options, :head ],
      expose: [ "Authorization" ],
      max_age: 600
  end
end
