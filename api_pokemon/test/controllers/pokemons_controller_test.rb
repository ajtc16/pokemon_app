# frozen_string_literal: true

require "test_helper"

class PokemonsControllerTest < ActionDispatch::IntegrationTest
  include AuthenticationTestHelper

  # === Authentication Tests ===

  test "index without token returns unauthorized" do
    get pokemons_url, as: :json

    assert_response :unauthorized
    json = response.parsed_body
    assert_equal "MISSING_TOKEN", json.dig("error", "code")
  end

  test "index with invalid token returns unauthorized" do
    get pokemons_url, headers: { "Authorization" => "Bearer invalid_token" }, as: :json

    assert_response :unauthorized
    json = response.parsed_body
    assert_equal "INVALID_TOKEN", json.dig("error", "code")
  end

  test "index with expired token returns unauthorized" do
    get pokemons_url, headers: auth_header(expired_token), as: :json

    assert_response :unauthorized
    json = response.parsed_body
    assert_equal "EXPIRED_TOKEN", json.dig("error", "code")
  end

  test "show without token returns unauthorized" do
    get pokemon_url(1), as: :json

    assert_response :unauthorized
    json = response.parsed_body
    assert_equal "MISSING_TOKEN", json.dig("error", "code")
  end

  # === Index Pagination Validation Tests ===

  test "index with negative offset returns bad request" do
    get "#{pokemons_url}?offset=-1", headers: auth_header(valid_token), as: :json

    assert_response :bad_request
    json = response.parsed_body
    assert_equal "INVALID_OFFSET", json.dig("error", "code")
  end

  test "index with non-integer offset returns bad request" do
    get "#{pokemons_url}?offset=abc", headers: auth_header(valid_token), as: :json

    assert_response :bad_request
    json = response.parsed_body
    assert_equal "INVALID_OFFSET", json.dig("error", "code")
  end

  test "index with limit below minimum returns bad request" do
    get "#{pokemons_url}?limit=0", headers: auth_header(valid_token), as: :json

    assert_response :bad_request
    json = response.parsed_body
    assert_equal "INVALID_LIMIT", json.dig("error", "code")
  end

  test "index with limit above maximum returns bad request" do
    get "#{pokemons_url}?limit=101", headers: auth_header(valid_token), as: :json

    assert_response :bad_request
    json = response.parsed_body
    assert_equal "INVALID_LIMIT", json.dig("error", "code")
  end

  # === Index Success Tests (requires network or mocking) ===

  test "index with valid token and default params returns pokemon list" do
    get pokemons_url, headers: auth_header(valid_token), as: :json

    assert_response :ok
    json = response.parsed_body
    assert json.key?("count")
    assert json.key?("results")
    assert json["results"].is_a?(Array)

    # Check that results include id parsed from url
    if json["results"].any?
      first_pokemon = json["results"].first
      assert first_pokemon.key?("id")
      assert first_pokemon.key?("name")
      assert first_pokemon.key?("url")
    end
  end

  test "index with custom pagination params works" do
    get "#{pokemons_url}?offset=20&limit=10", headers: auth_header(valid_token), as: :json

    assert_response :ok
    json = response.parsed_body
    assert json.key?("count")
    assert json.key?("results")
  end

  # === Show Tests (requires network or mocking) ===

  test "show with valid id returns pokemon details" do
    get pokemon_url(25), headers: auth_header(valid_token), as: :json

    assert_response :ok
    json = response.parsed_body

    # Verify required fields are present
    assert_equal 25, json["id"]
    assert_equal "pikachu", json["name"]
    assert json.key?("height")
    assert json.key?("weight")
    assert json.key?("base_experience")
    assert json.key?("types")
    assert json.key?("abilities")
    assert json.key?("sprites")
    assert json.key?("stats")

    # Verify types structure
    assert json["types"].is_a?(Array)

    # Verify abilities structure
    assert json["abilities"].is_a?(Array)
    if json["abilities"].any?
      ability = json["abilities"].first
      assert ability.key?("name")
      assert ability.key?("is_hidden")
    end

    # Verify sprites structure
    assert json["sprites"].key?("front_default")
    assert json["sprites"].key?("official_artwork")

    # Verify stats structure
    assert json["stats"].is_a?(Hash)
    assert json["stats"].key?("hp")
    assert json["stats"].key?("attack")
    assert json["stats"].key?("defense")
  end

  test "show with name instead of id works" do
    get pokemon_url("pikachu"), headers: auth_header(valid_token), as: :json

    assert_response :ok
    json = response.parsed_body
    assert_equal 25, json["id"]
    assert_equal "pikachu", json["name"]
  end

  test "show with non-existent id returns not found" do
    get pokemon_url(999999), headers: auth_header(valid_token), as: :json

    assert_response :not_found
    json = response.parsed_body
    assert_equal "NOT_FOUND", json.dig("error", "code")
  end
end
