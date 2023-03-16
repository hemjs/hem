import type { ShutdownHook } from '@hemtypes/hooks';

export class BeforeShutdownHook implements Omit<ShutdownHook, 'onShutdown'> {
  beforeShutdown(signal?: string) {}
}
