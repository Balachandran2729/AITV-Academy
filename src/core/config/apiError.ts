
/**
 * A standardized error class for handling API errors consistently.
 */
export class ApiError extends Error {
  /** HTTP status code (e.g., 404, 500, etc.) */
  public status?: number;

  /** Optional detailed error response from the backend */
  public details?: unknown;

  /**
   * Construct a new ApiError.
   * 
   * @param message - A human-readable error message
   * @param status - Optional HTTP status code
   * @param details - Optional backend-provided details or error body
   */
  constructor(message: string, status?: number, details?: unknown) {
    super(message);
    this.name = "ApiError";
    this.status = status;
    this.details = details;

    // Ensure correct prototype chain (important for TypeScript + transpilation)
    Object.setPrototypeOf(this, ApiError.prototype);
  }

  /**
   * Static helper to create an ApiError from an unknown value.
   */
  static fromUnknown(error: unknown): ApiError {
    if (error instanceof ApiError) return error;

    if (error instanceof Error) {
      return new ApiError(error.message);
    }

    if (typeof error === "string") {
      return new ApiError(error);
    }

    return new ApiError("An unexpected error occurred");
  }

  /**
   * Check if the error represents an authentication-related issue (401, 403).
   */
  isAuthError(): boolean {
    return this.status === 401 || this.status === 403;
  }

  /**
   * Check if the error represents a server-side issue (5xx).
   */
  isServerError(): boolean {
    return this.status ? this.status >= 500 : false;
  }

  /**
   * Convert to a safe log-friendly object.
   */
  toJSON() {
    return {
      name: this.name,
      message: this.message,
      status: this.status,
      details: this.details,
    };
  }
}