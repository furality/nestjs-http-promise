/* eslint-disable @typescript-eslint/unbound-method */

import { Inject, Injectable } from '@nestjs/common';
import axios, { AxiosInstance } from 'axios';

import { AXIOS_INSTANCE_TOKEN } from './http.constants';

@Injectable()
export class HttpService {
  public readonly put: typeof axios.put;
  public readonly post: typeof axios.post;
  public readonly patch: typeof axios.patch;
  public readonly head: typeof axios.patch;
  public readonly delete: typeof axios.delete;
  public readonly get: typeof axios.get;
  public readonly request: typeof axios.request;

  constructor(
    @Inject(AXIOS_INSTANCE_TOKEN)
    private readonly instance: AxiosInstance = axios,
  ) {
    this.put = this.instance.put;
    this.post = this.instance.post;
    this.patch = this.instance.patch;
    // eslint-disable-next-line no-type-assertion/no-type-assertion
    this.head = this.instance.head as typeof axios.patch;
    this.delete = this.instance.delete;
    this.get = this.instance.get;
    this.request = this.instance.request;
  }

  get axiosRef(): AxiosInstance {
    return this.instance;
  }
}
