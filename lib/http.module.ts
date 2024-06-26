import type { DynamicModule, Provider } from '@nestjs/common';
import { Logger, Module } from '@nestjs/common';
import { randomStringGenerator } from '@nestjs/common/utils/random-string-generator.util';
import axios from 'axios';
import axiosRetry, { exponentialDelay } from 'axios-retry';

import { AXIOS_INSTANCE_TOKEN, HTTP_MODULE_ID, HTTP_MODULE_OPTIONS } from './http.constants';
import { HttpService } from './http.service';
import { isNetworkOrIdempotentRequestOrGatewayOrRateLimitError } from './http.util';
import type {
  HttpModuleAsyncOptions,
  HttpModuleOptions,
  HttpModuleOptionsFactory,
} from './interfaces';

const createAxiosInstance = (config?: HttpModuleOptions) => {
  const logger = new Logger(HttpService.name);
  const axiosInstance = axios.create(config);
  axiosRetry(axiosInstance, {
    retries: 10,
    // Default exponential backoff
    retryDelay: exponentialDelay,
    retryCondition: isNetworkOrIdempotentRequestOrGatewayOrRateLimitError,
    onRetry(retryCount, error, requestConfig) {
      logger.warn(
        {
          retryCount,
          name: error.name,
          message: error.message,
          code: error.code,
          method: requestConfig.method,
          baseURL: requestConfig.baseURL,
          url: requestConfig.url,
          // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
          params: requestConfig.params,
          data: error.response?.data,
        },
        'Retrying request after error',
      );
    },
    ...config,
  });
  return axiosInstance;
};

@Module({
  providers: [
    HttpService,
    {
      provide: AXIOS_INSTANCE_TOKEN,
      useValue: createAxiosInstance(),
    },
  ],
  exports: [HttpService],
})
export class HttpModule {
  static register(config: HttpModuleOptions): DynamicModule {
    return {
      module: HttpModule,
      providers: [
        {
          provide: AXIOS_INSTANCE_TOKEN,
          useValue: createAxiosInstance(config),
        },
        {
          provide: HTTP_MODULE_ID,
          useValue: randomStringGenerator(),
        },
      ],
    };
  }

  static registerAsync(options: HttpModuleAsyncOptions): DynamicModule {
    return {
      module: HttpModule,
      ...(options.imports && { imports: options.imports }),
      providers: [
        ...this.createAsyncProviders(options),
        {
          provide: AXIOS_INSTANCE_TOKEN,
          useFactory: (config: HttpModuleOptions) => createAxiosInstance(config),
          inject: [HTTP_MODULE_OPTIONS],
        },
        {
          provide: HTTP_MODULE_ID,
          useValue: randomStringGenerator(),
        },
        ...(options.extraProviders ?? []),
      ],
    };
  }

  private static createAsyncProviders(options: HttpModuleAsyncOptions): Provider[] {
    if (!!options.useExisting || !!options.useFactory) {
      return [this.createAsyncOptionsProvider(options)];
    }

    const providers = [this.createAsyncOptionsProvider(options)];

    if (options.useClass) {
      providers.push({
        provide: options.useClass,
        useClass: options.useClass,
      });
    }

    return providers;
  }

  private static createAsyncOptionsProvider(options: HttpModuleAsyncOptions): Provider {
    if (options.useFactory) {
      return {
        provide: HTTP_MODULE_OPTIONS,
        useFactory: options.useFactory,
        inject: options.inject ?? [],
      };
    }

    let inject;
    if (options.useExisting) {
      inject = [options.useExisting];
    } else if (options.useClass) {
      inject = [options.useClass];
    }

    return {
      provide: HTTP_MODULE_OPTIONS,
      useFactory: async (optionsFactory: HttpModuleOptionsFactory) =>
        await optionsFactory.createHttpOptions(),
      ...(inject && { inject }),
    };
  }
}
