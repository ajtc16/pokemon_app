# frozen_string_literal: true

Rails.application.routes.draw do
  # Health check endpoint for load balancers and uptime monitors
  get "up" => "rails/health#show", as: :rails_health_check

  # Authentication
  post "login", to: "auth#login"

  # Pokemon endpoints (protected by authentication)
  resources :pokemons, only: [ :index, :show ]
end
