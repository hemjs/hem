import { HookCollector } from '../../../src/hooks/hook-collector';
import { HookContainer } from '../../../src/hooks/hook-container';
import { HookFactory } from '../../../src/hooks/hook-factory';
import { BeforeShutdownHook } from '../fixture/before-shutdown-hook';
import { NoopHook } from '../fixture/noop-hook';
import { OnShutdownHook } from '../fixture/on-shutdown-hook';
import { OnStartupHook } from '../fixture/on-startup-hook';
import { InMemoryContainer } from '../in-memory-container';

describe('HookCollector', () => {
  let originContainer: InMemoryContainer;
  let factory: HookFactory;
  let noopHook: NoopHook;

  beforeEach(() => {
    originContainer = new InMemoryContainer();
    const container = new HookContainer(originContainer);
    factory = new HookFactory(container);
    noopHook = new NoopHook();
  });

  afterEach(() => {
    originContainer.reset();
  });

  it('should return instance of HookCollector', () => {
    const hookCollector = new HookCollector(factory);
    expect(hookCollector).toBeInstanceOf(HookCollector);
  });

  it('should call "startup" hook', async () => {
    const hook = new OnStartupHook();
    const hookSpy = jest.spyOn(hook, 'onStartup');
    const hookCollector = new HookCollector(factory, [hook, noopHook]);
    hookCollector.addStartupHook();
    expect(hookSpy).toHaveBeenCalled();
    expect(hookSpy).toHaveBeenCalledWith();
  });

  it('should call "beforeShutdown" hook', async () => {
    const hook = new BeforeShutdownHook();
    const hookSpy = jest.spyOn(hook, 'beforeShutdown');
    const hookCollector = new HookCollector(factory, [hook, noopHook]);
    await hookCollector.addBeforeShutdownHook('SIGTERM');
    expect(hookSpy).toHaveBeenCalled();
    expect(hookSpy).toHaveBeenCalledWith('SIGTERM');
  });

  it('should call "onShutdown" hook', async () => {
    const hook = new OnShutdownHook();
    const hookSpy = jest.spyOn(hook, 'onShutdown');
    const hookCollector = new HookCollector(factory, [hook, noopHook]);
    await hookCollector.addShutdownHook('SIGTERM');
    expect(hookSpy).toHaveBeenCalled();
    expect(hookSpy).toHaveBeenCalledWith('SIGTERM');
  });
});
