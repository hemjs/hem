import { isFunction } from '@hemjs/notions';
import type { Container, ProviderToken } from '@hemtypes/container';
import type { Type } from '@hemtypes/core';

export class HookContainer implements Container {
  constructor(private readonly container: Container) {}

  get<T>(token: ProviderToken | Type<any>): T {
    if (!this.has(token)) {
      throw new Error('Token is not registered');
    }

    if (this.container.has(token as ProviderToken)) {
      return this.container.get(token as ProviderToken);
    }

    return token as T;
  }

  has(token: ProviderToken | Type<any>): boolean {
    if (this.container.has(token as ProviderToken)) {
      return true;
    }

    return isFunction(token);
  }
}
