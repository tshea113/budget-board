import { type AxiosError, type AxiosResponse } from 'axios';

const getErrorString = (error: AxiosResponse | undefined): string => {
  if (typeof error?.data === 'string') {
    return error.data;
  } else {
    return 'There was an error with your request.';
  }
};

export const translateAxiosError = (error: AxiosError): string => {
  if (error.code === 'ERR_BAD_REQUEST') {
    return getErrorString(error.response);
  } else if (error.code === 'ERR_NETWORK') {
    return getErrorString(error.response);
  } else if (error.code === 'ERR_BAD_RESPONSE') {
    return getErrorString(error.response);
  } else {
    return 'An unspecified error occurred.';
  }
};
