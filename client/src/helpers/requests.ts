import { AxiosError, AxiosResponse } from "axios";

export interface ValidationError {
  title: string;
  type: string;
  status: number;
  errors: object;
}

/**
 * Retrieves a string error message from the provided Axios response.
 *
 * @param {AxiosResponse | undefined} error - The Axios response from which to extract the error message.
 * @returns {string} A string error message if available, or a default error message.
 */
const getErrorString = (error: AxiosResponse | undefined): string => {
  if (typeof error?.data === "string") {
    return error.data;
  }
  return "There was an error with your request.";
};

/**
 * Translates an AxiosError object into a human-readable error message.
 *
 * @param {AxiosError} error - The error object from an Axios request.
 * @returns {string} A human-readable error message.
 *
 * The function handles specific Axios error codes:
 * - "ERR_BAD_REQUEST"
 * - "ERR_NETWORK"
 * - "ERR_BAD_RESPONSE"
 *
 * For these error types, it extracts a detailed error message from the response data using getErrorString.
 * If none of these specific error codes are matched, it returns a generic unspecified error message.
 */
export const translateAxiosError = (error: AxiosError): string => {
  if (error.code === "ERR_BAD_REQUEST") {
    return getErrorString(error.response);
  } else if (error.code === "ERR_NETWORK") {
    return getErrorString(error.response);
  } else if (error.code === "ERR_BAD_RESPONSE") {
    return getErrorString(error.response);
  }
  return "An unspecified error occurred.";
};
