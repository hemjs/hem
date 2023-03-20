import { FailureHandler } from './failure-handler';

const DEFAULT_TEARDOWN = (err: any) => {
  throw err;
};

/**
 * Simple task executor that abstracts the execution of a callback.
 */
export class TaskExecutor {
  private static readonly failureHandler = new FailureHandler();

  /**
   * Execute the given callback synchronously.
   * @param callback the callback to execute
   * @param teardown the teardown callback
   */
  public static execute(
    callback: () => void,
    teardown: (err: any) => void = DEFAULT_TEARDOWN,
  ) {
    try {
      callback();
    } catch (err: any) {
      this.failureHandler.handleFailure(err);
      teardown(err);
    }
  }
}
