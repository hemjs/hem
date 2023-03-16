import { isFunction, isObject, isString, isSymbol } from '@hemjs/notions';
import type { HookContainer } from './hook-container';

export class HookFactory {
  constructor(private readonly container: HookContainer) {}

  public prepare(instance: any) {
    if (Array.isArray(instance)) {
      return this.pipeline(instance);
    }

    if (isObject(instance)) {
      return instance;
    }

    if (isFunction(instance)) {
      const funcAsString = instance.toString();
      const isClass = /^class\s/.test(funcAsString);

      if (isClass) {
        return new instance();
      }

      return instance();
    }

    if (!isString(instance) && !isSymbol(instance)) {
      throw new Error('Invalid instance');
    }

    return this.lazy(instance);
  }

  public lazy(instance: string | symbol) {
    return this.container.get(instance);
  }

  public pipeline(instance: any[]): any[] {
    return instance.map((obj) => this.prepare(obj));
  }
}
