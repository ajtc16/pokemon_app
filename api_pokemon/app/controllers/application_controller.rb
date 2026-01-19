# frozen_string_literal: true

class ApplicationController < ActionController::API
  rescue_from StandardError, with: :handle_internal_error

  private

  def render_error(code:, message:, status:)
    render json: { error: { code: code, message: message } }, status: status
  end

  def handle_internal_error(exception)
    Rails.logger.error("Internal error: #{exception.message}")
    Rails.logger.error(exception.backtrace.join("\n")) if exception.backtrace
    render_error(code: "INTERNAL_ERROR", message: "An unexpected error occurred", status: :internal_server_error)
  end
end
