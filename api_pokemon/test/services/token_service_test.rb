# frozen_string_literal: true

require "test_helper"

class TokenServiceTest < ActiveSupport::TestCase
  test "generate creates a token string" do
    token = TokenService.generate(user_id: "admin")

    assert token.is_a?(String)
    assert token.present?
  end

  test "verify returns payload for valid token" do
    token = TokenService.generate(user_id: "admin")
    payload = TokenService.verify(token)

    assert payload.present?
    assert_equal "admin", payload[:user_id]
    assert payload[:exp].present?
    assert payload[:iat].present?
  end

  test "verify returns nil for invalid token" do
    payload = TokenService.verify("invalid_token_string")

    assert_nil payload
  end

  test "verify returns nil for nil token" do
    payload = TokenService.verify(nil)

    assert_nil payload
  end

  test "verify returns nil for empty token" do
    payload = TokenService.verify("")

    assert_nil payload
  end

  test "verify returns nil for expired token" do
    # Create an expired token manually
    payload = {
      user_id: "admin",
      exp: 1.hour.ago.to_i,
      iat: 2.hours.ago.to_i
    }
    verifier = ActiveSupport::MessageVerifier.new(
      Rails.application.secret_key_base,
      digest: "SHA256",
      serializer: JSON
    )
    expired_token = verifier.generate(payload, purpose: "api_auth")

    result = TokenService.verify(expired_token)
    assert_nil result
  end

  test "expired? returns true for expired token" do
    payload = {
      user_id: "admin",
      exp: 1.hour.ago.to_i,
      iat: 2.hours.ago.to_i
    }
    verifier = ActiveSupport::MessageVerifier.new(
      Rails.application.secret_key_base,
      digest: "SHA256",
      serializer: JSON
    )
    expired_token = verifier.generate(payload, purpose: "api_auth")

    assert_equal true, TokenService.expired?(expired_token)
  end

  test "expired? returns false for valid token" do
    token = TokenService.generate(user_id: "admin")

    assert_equal false, TokenService.expired?(token)
  end

  test "expired? returns nil for invalid token" do
    result = TokenService.expired?("invalid_token")

    assert_nil result
  end
end
