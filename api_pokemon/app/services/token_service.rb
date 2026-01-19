# frozen_string_literal: true

# TokenService handles token generation and verification using Rails MessageVerifier.
# Tokens are stateless, signed, and have built-in expiration.
class TokenService
  TOKEN_EXPIRATION = 24.hours
  TOKEN_PURPOSE = "api_auth"

  class << self
    # Generate a signed token for a given user identifier
    # @param user_id [String] the user identifier to encode in the token
    # @return [String] the signed token
    def generate(user_id:)
      payload = {
        user_id: user_id,
        exp: TOKEN_EXPIRATION.from_now.to_i,
        iat: Time.current.to_i
      }
      verifier.generate(payload, purpose: TOKEN_PURPOSE)
    end

    # Verify and decode a token
    # @param token [String] the token to verify
    # @return [Hash, nil] the decoded payload or nil if invalid/expired
    def verify(token)
      return nil if token.blank?

      payload = verifier.verify(token, purpose: TOKEN_PURPOSE)
      return nil unless payload.is_a?(Hash)

      # Check expiration
      exp = payload[:exp] || payload["exp"]
      return nil if exp.nil? || Time.current.to_i > exp

      payload.with_indifferent_access
    rescue ActiveSupport::MessageVerifier::InvalidSignature
      nil
    end

    # Check if token is expired (for specific error messaging)
    # @param token [String] the token to check
    # @return [Boolean, nil] true if expired, false if valid, nil if invalid signature
    def expired?(token)
      return nil if token.blank?

      payload = verifier.verify(token, purpose: TOKEN_PURPOSE)
      return nil unless payload.is_a?(Hash)

      exp = payload[:exp] || payload["exp"]
      return true if exp.nil?

      Time.current.to_i > exp
    rescue ActiveSupport::MessageVerifier::InvalidSignature
      nil
    end

    private

    def verifier
      @verifier ||= ActiveSupport::MessageVerifier.new(secret_key, digest: "SHA256", serializer: JSON)
    end

    def secret_key
      Rails.application.secret_key_base || raise("SECRET_KEY_BASE is not set")
    end
  end
end
