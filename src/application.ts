import { isFunction } from '@hemjs/notions';
import type { HttpAdapter } from '@hemtypes/http';
import type { HookCollector } from './hooks/hook-collector';

export class Application {
  protected httpServer: any;
  private isInitialized = false;

  constructor(
    private readonly httpAdapter: HttpAdapter,
    private readonly hookCollector: HookCollector,
    private readonly appOptions: any = {},
  ) {
    this.registerHttpServer();
  }

  public async init(): Promise<this> {
    if (this.isInitialized) {
      return this;
    }

    await this.hookCollector.addStartupHook();

    this.isInitialized = true;
    return this;
  }

  public getHttpAdapter<T = any>(): T {
    return this.httpAdapter as T;
  }

  public getHttpServer() {
    return this.httpServer;
  }

  public registerHttpServer() {
    this.httpServer = this.createServer();
  }

  public createServer<T = any>(): T {
    this.httpAdapter.initHttpServer(this.appOptions);
    return this.httpAdapter.getHttpServer() as T;
  }

  public async listen(port: number | string): Promise<any>;
  public async listen(port: number | string, hostname: string): Promise<any>;
  public async listen(port: number | string, ...args: any[]): Promise<any> {
    !this.isInitialized && (await this.init());

    return new Promise((resolve, reject) => {
      const errorHandler = (e: any) => {
        reject(e);
      };

      this.httpServer.once('error', errorHandler);

      const isCallbackInOriginalArgs = isFunction(args[args.length - 1]);
      const listenFnArgs = isCallbackInOriginalArgs
        ? args.slice(0, args.length - 1)
        : args;

      this.httpAdapter.listen(
        port,
        ...listenFnArgs,
        (...originalCallbackArgs: unknown[]) => {
          if (originalCallbackArgs[0] instanceof Error) {
            return reject(originalCallbackArgs[0]);
          }

          const address = this.httpServer.address();

          if (address) {
            this.httpServer.removeListener('error', errorHandler);
            resolve(this.httpServer);
          }

          if (isCallbackInOriginalArgs) {
            args[args.length - 1](...originalCallbackArgs);
          }
        },
      );
    });
  }

  public async close(signal?: string): Promise<void> {
    await this.hookCollector.addBeforeShutdownHook(signal);
    await this.dispose();
    await this.hookCollector.addShutdownHook(signal);
  }

  public async dispose(): Promise<void> {
    this.httpAdapter && (await this.httpAdapter.close());
  }
}
