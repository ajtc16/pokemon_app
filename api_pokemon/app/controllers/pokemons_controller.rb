# frozen_string_literal: true

class PokemonsController < ApplicationController
  include Authenticatable

  # Pagination constraints
  MIN_LIMIT = 1
  MAX_LIMIT = 100
  DEFAULT_LIMIT = 20
  DEFAULT_OFFSET = 0

  # GET /pokemons
  # Returns paginated list of Pokemon
  def index
    unless valid_pagination_params?
      return # error already rendered
    end

    offset = pagination_params[:offset]&.to_i || DEFAULT_OFFSET
    limit = pagination_params[:limit]&.to_i || DEFAULT_LIMIT

    response = PokeapiClient.list(offset: offset, limit: limit)
    results = transform_list_results(response["results"])

    render json: {
      count: response["count"],
      next: response["next"],
      previous: response["previous"],
      results: results
    }
  rescue PokeapiClient::UpstreamError => e
    Rails.logger.error("PokeAPI error: #{e.message}")
    render_error(code: "UPSTREAM_ERROR", message: "Failed to fetch data from PokeAPI", status: :bad_gateway)
  end

  # GET /pokemons/:id
  # Returns detailed Pokemon info by ID or name
  def show
    response = PokeapiClient.detail(params[:id])
    render json: transform_detail_response(response)
  rescue PokeapiClient::NotFoundError
    render_error(code: "NOT_FOUND", message: "Pokemon not found", status: :not_found)
  rescue PokeapiClient::UpstreamError => e
    Rails.logger.error("PokeAPI error: #{e.message}")
    render_error(code: "UPSTREAM_ERROR", message: "Failed to fetch data from PokeAPI", status: :bad_gateway)
  end

  private

  def pagination_params
    params.permit(:offset, :limit)
  end

  def valid_pagination_params?
    offset = pagination_params[:offset]
    limit = pagination_params[:limit]

    # Validate offset if provided
    if offset.present?
      offset_int = offset.to_i
      if offset.to_s != offset_int.to_s || offset_int < 0
        render_error(code: "INVALID_OFFSET", message: "Offset must be a non-negative integer", status: :bad_request)
        return false
      end
    end

    # Validate limit if provided
    if limit.present?
      limit_int = limit.to_i
      if limit.to_s != limit_int.to_s || limit_int < MIN_LIMIT || limit_int > MAX_LIMIT
        render_error(
          code: "INVALID_LIMIT",
          message: "Limit must be an integer between #{MIN_LIMIT} and #{MAX_LIMIT}",
          status: :bad_request
        )
        return false
      end
    end

    true
  end

  # Transform list results to include ID extracted from URL
  def transform_list_results(results)
    results.map do |pokemon|
      id = extract_id_from_url(pokemon["url"])
      {
        id: id,
        name: pokemon["name"],
        url: pokemon["url"]
      }
    end
  end

  # Extract Pokemon ID from PokeAPI URL
  # Example: "https://pokeapi.co/api/v2/pokemon/25/" => 25
  def extract_id_from_url(url)
    match = url.match(%r{/pokemon/(\d+)/?$})
    match ? match[1].to_i : nil
  end

  # Transform detail response to our API format
  def transform_detail_response(data)
    {
      id: data["id"],
      name: data["name"],
      height: data["height"],
      weight: data["weight"],
      base_experience: data["base_experience"],
      types: extract_types(data["types"]),
      abilities: extract_abilities(data["abilities"]),
      sprites: extract_sprites(data["sprites"]),
      stats: extract_stats(data["stats"])
    }
  end

  def extract_types(types)
    types.map { |t| t.dig("type", "name") }
  end

  def extract_abilities(abilities)
    abilities.map do |a|
      {
        name: a.dig("ability", "name"),
        is_hidden: a["is_hidden"]
      }
    end
  end

  def extract_sprites(sprites)
    {
      front_default: sprites["front_default"],
      official_artwork: sprites.dig("other", "official-artwork", "front_default")
    }
  end

  def extract_stats(stats)
    stats.each_with_object({}) do |stat, hash|
      stat_name = stat.dig("stat", "name")
      hash[stat_name] = stat["base_stat"]
    end
  end
end
