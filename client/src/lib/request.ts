import axios, { AxiosResponse } from 'axios'
import { getToken } from './firebase'

// base url is sourced from environment variables
const client = axios.create({baseURL: import.meta.env.VITE_API_URL})

const request = async ({ ...options }) => {
  const token = await getToken()
  client.defaults.headers.common.Authorization = 'Bearer ' + token

  const onSuccess = (response: AxiosResponse) => response
  const onError = (error: Error) => {
    // optionaly catch errors and add some additional logging here
    throw error;
  }

  return client(options).then(onSuccess).catch(onError);
}

export default request