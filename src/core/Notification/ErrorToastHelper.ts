import Toast from 'react-native-toast-message';

export const showErrorToast = (
  error: any,
  custom401Callback?: () => void,
) => {
  let title = 'Oops! Something Went Wrong';
  let message = 'An unknown error occurred. Please try again.';
  let toastType: 'error' | 'info' = 'error';

  // --- FIX: Extract status code if error is an Object like [Error: 413] ---
  let status = error;
  if (typeof error === 'object' && error.message && !isNaN(Number(error.message))) {
    status = Number(error.message);
  }
  // -----------------------------------------------------------------------

  if (status && typeof status === 'number') {
    switch (status) {
      case 401:
        title = 'Please Log In';
        message = "Your session has ended. We'll take you to the login screen.";
        toastType = 'info';
        if (custom401Callback) {
          custom401Callback();
        }
        break;

      case 500:
        title = 'Sorry, Our Mistake!';
        message = 'Something went wrong. Please try again in a moment.';
        break;

      case 503:
        title = "We're a Bit Busy";
        message = 'Our servers are crowded right now. Please try that again.';
        toastType = 'info';
        break;

      case 404:
        title = 'Not Found';
        message = "We couldn't find what you were looking for.";
        toastType = 'info';
        break;

      case 400:
        title = 'Something is Missing';
        message = 'Please check your information and try again.';
        break;

      case 413:
        title = 'Warning...';
        message = 'Reduce Item Size or Quantity.';
        toastType = 'info';
        break;

      default:
        title = 'An Error Occurred';
        message = 'Something went wrong. Please check your connection and try again.';
    }
  } else if (error?.message) {
    if (error.message.includes('Network Error')) {
      title = 'No Internet Connection';
      message = 'Please check your connection and try again.';
    } else if (error.message.includes('token expired')) {
      title = 'Please Log In';
      message = 'Your session has ended. Please log in again.';
      toastType = 'info';
      if (custom401Callback) {
        custom401Callback();
      }
    }
  }

  Toast.show({
    type: toastType,
    text1: title,
    text2: message,
    visibilityTime: 3000,
    position: 'bottom',
  });
};