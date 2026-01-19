# frozen_string_literal: true

require "test_helper"

class AuthControllerTest < ActionDispatch::IntegrationTest
  test "login with valid credentials returns token" do
    post login_url, params: { username: "admin", password: "admin" }, as: :json

    assert_response :ok
    json = response.parsed_body
    assert json["token"].present?
    assert_equal "Bearer", json["token_type"]
    assert_equal 86400, json["expires_in"] # 24 hours
  end

  test "login with invalid username returns unauthorized" do
    post login_url, params: { username: "wrong", password: "admin" }, as: :json

    assert_response :unauthorized
    json = response.parsed_body
    assert_equal "INVALID_CREDENTIALS", json.dig("error", "code")
    assert_equal "Invalid username or password", json.dig("error", "message")
  end

  test "login with invalid password returns unauthorized" do
    post login_url, params: { username: "admin", password: "wrong" }, as: :json

    assert_response :unauthorized
    json = response.parsed_body
    assert_equal "INVALID_CREDENTIALS", json.dig("error", "code")
  end

  test "login with missing credentials returns unauthorized" do
    post login_url, params: {}, as: :json

    assert_response :unauthorized
    json = response.parsed_body
    assert_equal "INVALID_CREDENTIALS", json.dig("error", "code")
  end
end
