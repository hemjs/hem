import { ExpressAdapter, ExpressModule } from '@hemjs/express';
import { Needle } from '@hemjs/needle';
import type { Container } from '@hemtypes/container';
import { Application, HemModule, HTTP_ADAPTER } from '../../../src';

describe('Listen (Express Application)', () => {
  let container: Container;
  let app: Application;

  beforeEach(() => {
    container = new Needle([
      ...(new HemModule().register()?.['providers'] ?? []),
      ...(new ExpressModule().register()?.['providers'] ?? []),
      {
        provide: HTTP_ADAPTER,
        useExisting: ExpressAdapter.name,
      },
    ]);
    app = container.get<Application>(Application.name);
  });

  afterEach(async () => {
    await app.close();
  });

  it('should resolve with httpServer on success', async () => {
    const response = await app.listen(4444);
    expect(response).toEqual(app.getHttpServer());
  });

  it('should reject if the port is not available', async () => {
    await app.listen(4444);

    const seocndContainer = new Needle([
      ...(new HemModule().register()?.['providers'] ?? []),
      ...(new ExpressModule().register()?.['providers'] ?? []),
      {
        provide: HTTP_ADAPTER,
        useExisting: ExpressAdapter.name,
      },
    ]);
    const secondApp = seocndContainer.get<Application>(Application.name);
    try {
      await secondApp.listen(4444);
    } catch (error: any) {
      expect(error.code).toEqual('EADDRINUSE');
    }
  });

  it('should reject if there is an invalid host', async () => {
    try {
      await app.listen(4444, '1');
    } catch (error: any) {
      expect(error.code).toEqual('EADDRNOTAVAIL');
    }
  });
});
