import { ExpressAdapter, ExpressModule } from '@hemjs/express';
import { Needle } from '@hemjs/needle';
import type { Container } from '@hemtypes/container';
import type { ExpressApplication } from '@hemtypes/express';
import { readFileSync } from 'fs';
import { join } from 'path';
import { Application, HemModule, HTTP_ADAPTER } from '../../../src';

describe('Get URL (Express Application)', () => {
  describe('HTTP', () => {
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
      ]);
      app = container.get<ExpressApplication>(Application.name);
    });

    afterEach(async () => {
      await app.close();
    });

    it('should support HTTP over IPv4', async () => {
      await app.listen(4441, '127.0.0.1');
      expect(await app.getUrl()).toEqual(`http://127.0.0.1:4441`);
    });

    it('should convert host from [::] to [::1]', async () => {
      await app.listen(4442, '::');
      expect(await app.getUrl()).toEqual(`http://[::1]:4442`);
    });

    it('should convert host from 0.0.0.0 to 127.0.0.1', async () => {
      await app.listen(4443, '0.0.0.0');
      expect(await app.getUrl()).toEqual(`http://127.0.0.1:4443`);
    });

    it('should return 127.0.0.1 in a callback', async () => {
      await app.listen(4444, '127.0.0.1', async () => {
        expect(await app.getUrl()).toEqual(`http://127.0.0.1:4444`);
        await app.close();
      });
    });

    it('should throw an error when server not listening', async () => {
      try {
        await app.getUrl();
      } catch (error) {
        expect(error).toEqual('Server not listening!');
      }
    });
  });

  describe('HTTPS', () => {
    let container: Container;
    let app: ExpressApplication;

    beforeEach(() => {
      const keyPath = join(__dirname, '/../fixtures/key.pem');
      const certPath = join(__dirname, '/../fixtures/cert.pem');
      container = new Needle([
        ...(new HemModule().register()?.['providers'] ?? []),
        ...(new ExpressModule().register()?.['providers'] ?? []),
        {
          provide: HTTP_ADAPTER,
          useExisting: ExpressAdapter.name,
        },
        {
          provide: 'config',
          useValue: {
            app: {
              options: {
                httpsOptions: {
                  key: readFileSync(keyPath),
                  cert: readFileSync(certPath),
                },
              },
            },
          },
        },
      ]);
      app = container.get<ExpressApplication>(Application.name);
    });

    afterEach(async () => {
      await app.close();
    });

    it('should support HTTPS over IPv4', async () => {
      await app.listen(4445, '127.0.0.1');
      expect(await app.getUrl()).toEqual(`https://127.0.0.1:4445`);
    });
  });
});
