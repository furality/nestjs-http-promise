import type {
  InjectionToken,
  ModuleMetadata,
  OptionalFactoryDependency,
  Provider,
  Type,
} from '@nestjs/common';
import type { AxiosRequestConfig } from 'axios';
import type { IAxiosRetryConfig } from 'axios-retry';

export type HttpModuleOptions = AxiosRequestConfig &
  IAxiosRetryConfig & { isBetterStackTraceEnabled?: boolean };

export interface HttpModuleOptionsFactory {
  createHttpOptions(): Promise<HttpModuleOptions> | HttpModuleOptions;
}

export interface HttpModuleAsyncOptions extends Pick<ModuleMetadata, 'imports'> {
  useExisting?: Type<HttpModuleOptionsFactory>;
  useClass?: Type<HttpModuleOptionsFactory>;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  useFactory?: (...args: any[]) => Promise<HttpModuleOptions> | HttpModuleOptions;
  inject?: (InjectionToken | OptionalFactoryDependency)[];
  extraProviders?: Provider[];
}
