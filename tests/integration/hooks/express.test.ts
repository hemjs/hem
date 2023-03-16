import { ExpressAdapter, ExpressModule } from '@hemjs/express';
import { Needle } from '@hemjs/needle';
import type { Container } from '@hemtypes/container';
import type { ExpressApplication } from '@hemtypes/express';
import type { ShutdownHook, StartupHook } from '@hemtypes/hooks';
import { Application, HemModule } from '../../../src';
import { HTTP_ADAPTER } from '../../../src/constants';

class OnStartup implements StartupHook {
  onStartup() {}
}

class BeforeShutdown implements Omit<ShutdownHook, 'onShutdown'> {
  beforeShutdown(signal?: string) {}
}

class OnShutdown implements Omit<ShutdownHook, 'beforeShutdown'> {
  onShutdown(signal?: string) {}
}

describe('Hooks (Express Application)', () => {
  let container: Container;
  let app: ExpressApplication;

  beforeEach(() => {
    container = new Needle([
      ...(new HemModule().register()?.['providers'] ?? []),
      ...(new ExpressModule().register()?.['providers'] ?? []),
      {
        provide: HTTP_ADAPTER,
        useExisting: ExpressAdapter.name,
      },
      {
        provide: OnStartup.name,
        useClass: OnStartup,
      },
      {
        provide: BeforeShutdown.name,
        useClass: BeforeShutdown,
      },
      {
        provide: OnShutdown.name,
        useClass: OnShutdown,
      },
      {
        provide: 'config',
        useValue: {
          hooks: [OnStartup.name, BeforeShutdown.name, OnShutdown.name],
        },
      },
    ]);
    app = container.get<ExpressApplication>(Application.name);
  });

  describe('StartupHook', () => {
    afterEach(async () => {
      await app.close();
    });

    it('should call `onStartup` when application starts', async () => {
      const instance = container.get<StartupHook>(OnStartup.name);
      const spy = jest.spyOn(instance, 'onStartup');
      await app.init();
      expect(spy).toHaveBeenCalled();
    });
  });

  describe('BeforeShutdownHook', () => {
    it('should call `beforeShutdown` when application closes', async () => {
      const instance = container.get<ShutdownHook>(BeforeShutdown.name);
      const spy = jest.spyOn(instance, 'beforeShutdown');
      await app.close();
      expect(spy).toHaveBeenCalled();
    });
  });

  describe('ShutdownHook', () => {
    it('should call `onShutdown` when application closes', async () => {
      const instance = container.get<ShutdownHook>(OnShutdown.name);
      const spy = jest.spyOn(instance, 'onShutdown');
      await app.close();
      expect(spy).toHaveBeenCalled();
    });
  });
});
