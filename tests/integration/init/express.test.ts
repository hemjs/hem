import { ExpressAdapter, ExpressModule } from '@hemjs/express';
import { Needle } from '@hemjs/needle';
import type { Container } from '@hemtypes/container';
import { Application, HemModule, HTTP_ADAPTER } from '../../../src';

describe('Init (Express Application)', () => {
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

  it('should skip initialization if already init', async () => {
    await app.init();
    await app.init();
    expect(app).toBeInstanceOf(Application);
  });
});
