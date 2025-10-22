import toast from 'react-hot-toast';

/**
 * Extract error message from API error response
 */
export const getErrorMessage = (error) => {
  if (error.response) {
    // Server responded with error
    const { data } = error.response;

    if (data?.message) {
      return data.message;
    }

    if (data?.errors && Array.isArray(data.errors) && data.errors.length > 0) {
      return data.errors[0].msg || data.errors[0].message || 'An error occurred';
    }

    // Default messages by status code
    switch (error.response.status) {
      case 400:
        return 'Invalid request. Please check your input.';
      case 401:
        return 'Unauthorized. Please login again.';
      case 403:
        return 'You do not have permission to perform this action.';
      case 404:
        return 'Resource not found.';
      case 500:
        return 'Server error. Please try again later.';
      default:
        return 'An unexpected error occurred.';
    }
  } else if (error.request) {
    // Request made but no response
    return 'Network error. Please check your connection.';
  } else {
    // Something else happened
    return error.message || 'An unexpected error occurred.';
  }
};

/**
 * Handle API errors with toast notifications
 */
export const handleApiError = (error, customMessage = null) => {
  const message = customMessage || getErrorMessage(error);
  toast.error(message);
  console.error('API Error:', error);
  return message;
};

/**
 * Handle API success with toast notifications
 */
export const handleApiSuccess = (message) => {
  toast.success(message);
};

/**
 * Show loading toast
 */
export const showLoadingToast = (message = 'Loading...') => {
  return toast.loading(message);
};

/**
 * Dismiss a specific toast
 */
export const dismissToast = (toastId) => {
  toast.dismiss(toastId);
};
