ENV["RAILS_ENV"] ||= "test"
require_relative "../config/environment"
require "rails/test_help"

module ActiveSupport
  class TestCase
    # Run tests in parallel with specified workers
    parallelize(workers: :number_of_processors, with: :threads)

    # Add more helper methods to be used by all tests here...
  end
end

# Helper methods for authentication in tests
module AuthenticationTestHelper
  def valid_token
    TokenService.generate(user_id: "admin")
  end

  def expired_token
    # Create a token that's already expired
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
    verifier.generate(payload, purpose: "api_auth")
  end

  def auth_header(token)
    { "Authorization" => "Bearer #{token}" }
  end
end
