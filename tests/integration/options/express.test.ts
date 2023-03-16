import { ExpressAdapter, ExpressModule } from '@hemjs/express';
import { Needle } from '@hemjs/needle';
import type { Container } from '@hemtypes/container';
import { Application, HemModule } from '../../../src';
import { HTTP_ADAPTER } from '../../../src/constants';

describe('Options (Express Application)', () => {
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
      {
        provide: 'config',
        useValue: { app: { options: {} } },
      },
    ]);
    app = container.get<Application>(Application.name);
  });

  it('should return when app options present', () => {
    expect(app).toBeInstanceOf(Application);
  });
});
