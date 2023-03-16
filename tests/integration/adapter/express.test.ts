import { ExpressAdapter, ExpressModule } from '@hemjs/express';
import { Needle } from '@hemjs/needle';
import { Application, HemModule } from '../../../src';
import { HTTP_ADAPTER } from '../../../src/constants';

describe('Adapter (Express Application)', () => {
  let container: Needle;

  beforeEach(() => {
    container = new Needle([
      ...(new HemModule().register()?.['providers'] ?? []),
      ...(new ExpressModule().register()?.['providers'] ?? []),
    ]);
  });

  test('should return when http adapter present', () => {
    container.addProvider({
      provide: HTTP_ADAPTER,
      useExisting: ExpressAdapter.name,
    });
    const app = container.get<Application & ExpressAdapter>(Application.name);
    expect(app).toBeInstanceOf(Application);
    expect(app.getHttpAdapter()).toBeInstanceOf(ExpressAdapter);
    expect(app.getType()).toEqual('express');
  });

  test('should reject if missing http adapter', async () => {
    expect(() => container.get<Application>(Application.name)).toThrow();
  });
});
