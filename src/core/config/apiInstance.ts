import axios from 'axios';

const TIMEOUT_DURATION = 10000; 
const BASE_URL = process.env.EXPO_PUBLIC_API_BASE_URL;
export const apiClient = axios.create({
  baseURL: BASE_URL , 
  timeout: TIMEOUT_DURATION, 
});

const MAX_RETRIES = 2; // How many times to retry before finally failing

// 2. RETRY MECHANISM (Requirement 6.1)
apiClient.interceptors.response.use(
  (response) => {
    // If the request succeeds, just return the response normally
    return response;
  },
  async (error) => {
    const config = error.config;

    // If we don't have config, or we've already hit our max retries, throw the error to the UI
    if (!config || (config._retryCount && config._retryCount >= MAX_RETRIES)) {
      return Promise.reject(error);
    }

    // Initialize the retry count if it doesn't exist
    config._retryCount = config._retryCount || 0;

    // Determine if the error is actually worth retrying.
    // We SHOULD retry if there is no response (Network Error/Timeout) or if it's a 5xx Server Error.
    // We SHOULD NOT retry on 4xx errors (like 400 Bad Request, 401 Unauthorized) because retrying won't fix those.
    const isRetryable = !error.response || (error.response.status >= 500 && error.response.status <= 599);

    if (isRetryable) {
      config._retryCount += 1;
      console.warn(`API call failed. Retrying... (${config._retryCount}/${MAX_RETRIES})`);

      // Create a delay using Exponential Backoff (1000ms, then 2000ms)
      // This prevents spamming a struggling server
      const delay = Math.pow(2, config._retryCount) * 1000;
      await new Promise((resolve) => setTimeout(resolve, Math.min(delay, 5000)));

      // Retry the exact same request using the original config
      return apiClient(config);
    }

    // If it's not a retryable error, reject immediately
    return Promise.reject(error);
  }
);