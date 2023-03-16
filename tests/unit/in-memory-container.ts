import type { Container, ProviderToken } from '@hemtypes/container';

export class InMemoryContainer implements Container {
  private readonly services = new Map<ProviderToken, any>();

  get<T>(token: ProviderToken): T {
    if (!this.has(token)) {
      throw new Error(`${token.toString()} was not found`);
    }
    return this.services.get(token);
  }

  has(token: ProviderToken): boolean {
    return this.services.has(token);
  }

  set(token: ProviderToken, item: any): void {
    this.services.set(token, item);
  }

  reset(): void {
    this.services.clear();
  }
}
