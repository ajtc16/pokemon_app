# frozen_string_literal: true

class AuthController < ApplicationController
  # Valid credentials (hardcoded as per requirements)
  VALID_USERNAME = "admin"
  VALID_PASSWORD = "admin"

  # POST /login
  # Authenticates user and returns a token
  def login
    unless valid_credentials?
      render_error(
        code: "INVALID_CREDENTIALS",
        message: "Invalid username or password",
        status: :unauthorized
      )
      return
    end

    token = TokenService.generate(user_id: login_params[:username])

    render json: {
      token: token,
      token_type: "Bearer",
      expires_in: TokenService::TOKEN_EXPIRATION.to_i
    }, status: :ok
  end

  private

  def login_params
    params.permit(:username, :password)
  end

  def valid_credentials?
    login_params[:username] == VALID_USERNAME &&
      login_params[:password] == VALID_PASSWORD
  end
end
