import type { AxiosError } from 'axios';
import { isNetworkOrIdempotentRequestError } from 'axios-retry';

export function isGatewayError(error: AxiosError): boolean {
  return !!error.response && error.response.status >= 502 && error.response.status <= 504;
}

export function isNetworkOrIdempotentRequestOrGatewayError(error: AxiosError): boolean {
  return isNetworkOrIdempotentRequestError(error) || isGatewayError(error);
}
