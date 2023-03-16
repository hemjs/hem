import { HookContainer } from '../../../src/hooks/hook-container';
import { HookFactory } from '../../../src/hooks/hook-factory';
import { OnStartupHook } from '../fixture/on-startup-hook';
import { InMemoryContainer } from '../in-memory-container';

describe('HookFactory', () => {
  let container: HookContainer;
  let originContainer: InMemoryContainer;
  let factory: HookFactory;

  beforeEach(async () => {
    originContainer = new InMemoryContainer();
    container = new HookContainer(originContainer);
    factory = new HookFactory(container);
  });

  afterEach(async () => {
    originContainer.reset();
  });

  it('should prepare hook verbatim when class instance ', () => {
    const hook = new OnStartupHook();
    expect(factory.prepare(hook)).toEqual(hook);
  });

  it('should prepare hook when class', () => {
    const hook = factory.prepare(OnStartupHook);
    expect(hook).toBeInstanceOf(OnStartupHook);
  });

  it('should prepare hook when function', () => {
    const fnHook = jest.fn(() => {});
    const hook = factory.prepare(fnHook);
    expect(hook).toEqual(fnHook());
  });

  it('should prepare hooks when object array', () => {
    const hook1 = new OnStartupHook();
    const hook2 = new OnStartupHook();
    const hook = factory.prepare([hook1, hook2]);
    expect(hook).toEqual([hook1, hook2]);
  });

  it('should lazy prepare hook when string', () => {
    const token = 'hook-service';
    const hook = new OnStartupHook();
    originContainer.set(token, hook);
    expect(factory.prepare(token)).toEqual(hook);
  });

  it('should lazy prepare hook when symbol', () => {
    const token = Symbol('hook-service');
    const hook = new OnStartupHook();
    originContainer.set(token, hook);
    expect(factory.prepare(token)).toEqual(hook);
  });

  it('should lazy prepare hooks when string array', () => {
    const token1 = 'hook-service1';
    const hook1 = new OnStartupHook();
    const token2 = 'hook-service2';
    const hook2 = new OnStartupHook();
    originContainer.set(token1, hook1);
    originContainer.set(token2, hook2);
    expect(factory.prepare([token1, token2])).toEqual([hook1, hook2]);
  });

  it('should throw when invalid type', async () => {
    expect(() => factory.prepare(null)).toThrow();
    expect(() => factory.prepare(false)).toThrow();
    expect(() => factory.prepare(123)).toThrow();
  });
});
