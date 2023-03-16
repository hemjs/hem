import type { Provider } from '@hemtypes/container';
import { Application, HemModule } from '../../src';
import { HookCollector } from '../../src/hooks/hook-collector';
import { HookContainer } from '../../src/hooks/hook-container';
import { HookFactory } from '../../src/hooks/hook-factory';

describe('ExpressModule', () => {
  let providers: Provider[];

  beforeEach(() => {
    providers = new HemModule().register()?.['providers'] ?? [];
  });

  it('should define expected providers', () => {
    expect(providers).toEqual(
      expect.arrayContaining([
        expect.objectContaining({ provide: HookContainer.name }),
      ]),
    );
    expect(providers).toEqual(
      expect.arrayContaining([
        expect.objectContaining({ provide: HookFactory.name }),
      ]),
    );
    expect(providers).toEqual(
      expect.arrayContaining([
        expect.objectContaining({ provide: HookCollector.name }),
      ]),
    );
    expect(providers).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          provide: Application.name,
        }),
      ]),
    );
  });
});
