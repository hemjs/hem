import type { ShutdownHook } from '@hemtypes/hooks';

export class OnShutdownHook implements Omit<ShutdownHook, 'beforeShutdown'> {
  onShutdown(signal?: string) {}
}
