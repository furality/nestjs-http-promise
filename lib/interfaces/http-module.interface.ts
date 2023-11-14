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
  useFactory?: (...args: any[]) => Promise<HttpModuleOptions> | HttpModuleOptions;
  inject?: any[];
  extraProviders?: Provider[];
}
