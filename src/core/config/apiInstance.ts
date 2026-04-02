import { ApiClient } from "./apiClient";
import { ApiEndPoints } from "../constants/ApiEndPoints";

// Validate and initialize the API client
const initializeApiClient = () => {
  const baseUrl = ApiEndPoints.BASE_URL;
  
  if (!baseUrl) {
    console.warn(
      'API Base URL is not configured. Please check your .env file and ensure EXPO_PUBLIC_API_BASE_URL is set.'
    );
  }
  
  return new ApiClient(baseUrl);
};

export const apiClient = initializeApiClient();