# frozen_string_literal: true

# Authenticatable concern provides token-based authentication for controllers.
# Include this concern and call `authenticate_request!` as a before_action.
module Authenticatable
  extend ActiveSupport::Concern

  included do
    before_action :authenticate_request!
  end

  private

  def authenticate_request!
    token = extract_token_from_header
    if token.nil?
      render_auth_error("MISSING_TOKEN", "Authorization header is required")
      return
    end

    # Check if token is expired (for specific error message)
    expired = TokenService.expired?(token)
    if expired.nil?
      render_auth_error("INVALID_TOKEN", "Token is invalid")
      return
    end

    if expired
      render_auth_error("EXPIRED_TOKEN", "Token has expired")
      return
    end

    @current_user = TokenService.verify(token)
    if @current_user.nil?
      render_auth_error("INVALID_TOKEN", "Token is invalid")
    end
  end

  def extract_token_from_header
    header = request.headers["Authorization"]
    return nil unless header.present?

    # Expect "Bearer <token>" format
    match = header.match(/\ABearer\s+(.+)\z/i)
    match&.[](1)
  end

  def current_user
    @current_user
  end

  def render_auth_error(code, message)
    render json: { error: { code: code, message: message } }, status: :unauthorized
  end
end
