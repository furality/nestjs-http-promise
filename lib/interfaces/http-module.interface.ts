import type { ModuleMetadata, Provider, Type } from '@nestjs/common';
import type { AxiosRequestConfig } from 'axios';
import type IAxiosRetry from 'axios-retry';

export type HttpModuleOptions = AxiosRequestConfig &
  IAxiosRetry.IAxiosRetryConfig & { isBetterStackTraceEnabled?: boolean };

export interface HttpModuleOptionsFactory {
  createHttpOptions(): Promise<HttpModuleOptions> | HttpModuleOptions;
}

export interface HttpModuleAsyncOptions extends Pick<ModuleMetadata, 'imports'> {
  useExisting?: Type<HttpModuleOptionsFactory>;
  useClass?: Type<HttpModuleOptionsFactory>;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  useFactory?: (...args: any[]) => Promise<HttpModuleOptions> | HttpModuleOptions;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  inject?: any[];
  extraProviders?: Provider[];
}
