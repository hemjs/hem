import { ExpressAdapter, ExpressModule } from '@hemjs/express';
import { Needle } from '@hemjs/needle';
import type { Container } from '@hemtypes/container';
import type { ExpressApplication } from '@hemtypes/express';
import { Application, HemModule } from '../../../src';
import { HTTP_ADAPTER } from '../../../src/constants';

describe('Options (Express Application)', () => {
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
        provide: 'config',
        useValue: { app: { options: {} } },
      },
    ]);
    app = container.get<ExpressApplication>(Application.name);
  });

  it('should return when app options present', () => {
    expect(app).toBeInstanceOf(Application);
  });
});
