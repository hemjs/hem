import { isFunction } from '@hemjs/notions';
import type { Container, Provider } from '@hemtypes/container';
import type { HttpAdapter } from '@hemtypes/http';
import { Application } from './application';
import { HTTP_ADAPTER } from './constants';
import { HookCollector } from './hooks/hook-collector';
import { HookContainer } from './hooks/hook-container';
import { HookFactory } from './hooks/hook-factory';
import { TaskExecutor } from './task/task-executor';

export class HemModule {
  register(): { providers: Provider[] } {
    return {
      providers: [
        {
          provide: HookContainer.name,
          useFactory: (container: Container) => {
            return new HookContainer(container);
          },
        },
        {
          provide: HookFactory.name,
          useFactory: (container: Container) => {
            return new HookFactory(container.get(HookContainer.name));
          },
        },
        {
          provide: HookCollector.name,
          useFactory: (container: Container) => {
            const config: any = container.has('config')
              ? container.get('config')
              : {};
            return new HookCollector(
              container.get(HookFactory.name),
              config.hooks,
            );
          },
        },
        {
          provide: Application.name,
          useFactory: (container: Container) => {
            if (!container.has(HTTP_ADAPTER)) {
              throw new Error('HTTP_ADAPTER is missing!');
            }
            const config: any = container.has('config')
              ? container.get('config')
              : {};
            const instance = new Application(
              container.get<HttpAdapter>(HTTP_ADAPTER),
              container.get<HookCollector>(HookCollector.name),
              config.app?.options,
            );
            return this.createAdapterProxy(
              this.createTarget(instance),
              container.get<HttpAdapter>(HTTP_ADAPTER),
            );
          },
        },
      ],
    };
  }

  private createTarget<T>(target: T): T {
    return this.createProxy(target);
  }

  private createProxy(target: any) {
    const proxy = this.createTaskProxy();
    return new Proxy(target, {
      get: proxy,
      set: proxy,
    });
  }

  private createTaskProxy() {
    return (receiver: Record<string, any>, prop: string) => {
      if (!(prop in receiver)) {
        return;
      }
      if (isFunction(receiver[prop])) {
        return this.createTaskExecutor(receiver, prop);
      }
      return receiver[prop];
    };
  }

  private createAdapterProxy<T>(app: Application, adapter: HttpAdapter): T {
    const proxy = new Proxy(app, {
      get: (receiver: Record<string, any>, prop: string) => {
        const mapToProxy: any = (result: unknown) => {
          return result instanceof Promise
            ? result.then(mapToProxy)
            : result instanceof Application
            ? proxy
            : result;
        };
        if (!(prop in receiver) && prop in adapter) {
          return (...args: Array<unknown>) => {
            const result = this.createTaskExecutor(adapter, prop)(...args);
            return mapToProxy(result);
          };
        }
        if (isFunction(receiver[prop])) {
          return (...args: Array<unknown>) => {
            const result = receiver[prop](...args);
            return mapToProxy(result);
          };
        }
        return receiver[prop];
      },
    });
    return proxy as unknown as T;
  }

  private createTaskExecutor(
    receiver: Record<string, any>,
    prop: string,
  ): Function {
    return (...args: Array<unknown>) => {
      let result: unknown;
      TaskExecutor.execute(() => {
        result = receiver[prop](...args);
      });
      return result;
    };
  }
}
