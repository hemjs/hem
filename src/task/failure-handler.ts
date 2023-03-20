/**
 * Strategy for handling a failure that occurs when executing a callback.
 */
export class FailureHandler {
  /**
   * Handle the failure that occured when executing a callback.
   * @param failure the failure that occured
   */
  public handleFailure(failure: Error) {
    console.log(failure.message, failure.stack);
  }
}
