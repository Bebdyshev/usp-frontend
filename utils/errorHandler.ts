import axios, { AxiosError } from 'axios';
import { toast } from 'react-toastify';

export interface ApiError {
  status: number;
  message: string;
  isApiError: boolean;
}

interface ApiErrorResponse {
  detail?: string;
  message?: string;
}

/**
 * Handles API errors and returns a standardized error object
 */
export function handleApiError(error: unknown): ApiError {
  // Pass through if it's already our normalized ApiError
  if (typeof error === 'object' && error !== null && (error as any).isApiError === true && typeof (error as any).status === 'number') {
    return error as ApiError;
  }

  if (axios.isAxiosError(error)) {
    const axiosError = error as AxiosError<ApiErrorResponse>;
    const status = axiosError.response?.status ?? (axiosError.request ? 0 : 500);
    
    // Get error message from response if available
    const errorDetail = 
      axiosError.response?.data?.detail || 
      axiosError.response?.data?.message ||
      (axiosError.code === 'ERR_NETWORK' ? 'Network error' : axiosError.message);
    
    // Customize message based on status code
    let message: string;
    
    switch (status) {
      case 400:
        message = `Bad request: ${errorDetail}`;
        break;
      case 401:
        message = 'Authentication failed. Please log in again.';
        break;
      case 403:
        message = 'You don\'t have permission to access this resource.';
        break;
      case 404:
        message = 'Resource not found.';
        break;
      case 408:
      case 429:
        message = 'Request timeout. Please try again later.';
        break;
      case 0:
        message = 'Network error. Check your connection and try again.';
        break;
      case 500:
        message = 'Server error. Please try again later.';
        break;
      default:
        message = `Error: ${errorDetail}`;
    }
    
    return {
      status,
      message,
      isApiError: true
    };
  }
  
  // For non-Axios errors
  if (error instanceof Error) {
    return {
      status: 0,
      message: `Application error: ${error.message}`,
      isApiError: false
    };
  }
  
  // For unknown errors
  return {
    status: 0,
    message: 'An unknown error occurred',
    isApiError: false
  };
}

/**
 * Shows a toast notification for the error
 */
export function showErrorToast(error: ApiError): void {
  toast.error(error.message);
}

/**
 * Combined function that handles the error and shows the toast
 */
export function handleAndNotifyError(error: unknown): ApiError {
  const apiError = handleApiError(error);
  showErrorToast(apiError);
  return apiError;
} 