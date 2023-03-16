import { HookContainer } from '../../../src/hooks/hook-container';
import { OnStartupHook } from '../fixture/on-startup-hook';
import { InMemoryContainer } from '../in-memory-container';

describe('HookContainer', () => {
  let container: HookContainer;
  let originContainer: InMemoryContainer;

  beforeEach(async () => {
    originContainer = new InMemoryContainer();
    container = new HookContainer(originContainer);
  });

  afterEach(async () => {
    originContainer.reset();
  });

  it('should return true when original container has service', async () => {
    originContainer.set('service', new Date());
    expect(container.has('service')).toBeTruthy();
  });

  it('should return true when callable', async () => {
    expect(container.has(jest.fn())).toBeTruthy();
  });

  it('should return false when original container has no service', async () => {
    expect(container.has('not-a-callable')).toBeFalsy();
  });

  it('should return service from original container', async () => {
    originContainer.set('hook-service', new OnStartupHook());
    expect(container.get('hook-service')).toBeInstanceOf(OnStartupHook);
  });

  it('should return service when callable', async () => {
    const callable = jest.fn<any, any>(() => {});
    expect(container.get(callable)).toEqual(callable);
  });

  it('should throw when service unknown', async () => {
    expect(() => container.get('not-a-service')).toThrow();
  });
});
