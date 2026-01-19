# frozen_string_literal: true

# PokeapiClient handles all HTTP requests to the PokeAPI.
# Includes caching, timeout configuration, and error handling.
class PokeapiClient
  BASE_URL = "https://pokeapi.co/api/v2"
  OPEN_TIMEOUT = 2  # seconds
  READ_TIMEOUT = 5  # seconds

  # Cache TTLs
  LIST_CACHE_TTL = 60.seconds
  DETAIL_CACHE_TTL = 5.minutes

  # Custom error classes
  class Error < StandardError; end
  class NotFoundError < Error; end
  class UpstreamError < Error; end

  class << self
    # Fetch paginated list of Pokemon
    # @param offset [Integer] pagination offset (default: 0)
    # @param limit [Integer] number of results (default: 20)
    # @return [Hash] the parsed response with count, next, previous, results
    def list(offset: 0, limit: 20)
      cache_key = "pokeapi:list:offset=#{offset}:limit=#{limit}"

      Rails.cache.fetch(cache_key, expires_in: LIST_CACHE_TTL) do
        response = connection.get("pokemon", offset: offset, limit: limit)
        handle_response(response)
      end
    end

    # Fetch detailed Pokemon data by ID or name
    # @param id_or_name [String, Integer] Pokemon ID or name
    # @return [Hash] the parsed Pokemon detail response
    def detail(id_or_name)
      cache_key = "pokeapi:detail:#{id_or_name.to_s.downcase}"

      Rails.cache.fetch(cache_key, expires_in: DETAIL_CACHE_TTL) do
        response = connection.get("pokemon/#{id_or_name}")
        handle_response(response)
      end
    end

    private

    def connection
      @connection ||= Faraday.new(url: BASE_URL) do |conn|
        conn.options.open_timeout = OPEN_TIMEOUT
        conn.options.timeout = READ_TIMEOUT
        conn.request :json
        conn.response :json, content_type: /\bjson$/
        conn.adapter Faraday.default_adapter
      end
    end

    def handle_response(response)
      case response.status
      when 200
        response.body
      when 404
        raise NotFoundError, "Resource not found"
      else
        raise UpstreamError, "PokeAPI returned status #{response.status}"
      end
    rescue Faraday::TimeoutError => e
      raise UpstreamError, "PokeAPI request timed out: #{e.message}"
    rescue Faraday::ConnectionFailed => e
      raise UpstreamError, "Failed to connect to PokeAPI: #{e.message}"
    rescue Faraday::Error => e
      raise UpstreamError, "PokeAPI request failed: #{e.message}"
    end
  end
end
