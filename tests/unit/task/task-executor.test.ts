import { TaskExecutor } from '../../../src/task/task-executor';

const rethrow = (err: any) => {
  throw err;
};

const throwsCallback = () => {
  throw new Error('');
};

const failureHandler = {
  handleFailure: () => {},
};

describe('TaskExecutor', () => {
  describe('when callback does not throw', () => {
    let callback: jest.SpyInstance;

    beforeEach(() => {
      callback = jest.fn();
    });

    test('should call callback', () => {
      TaskExecutor.execute(callback as any, rethrow);
      expect(callback).toHaveBeenCalled();
    });
  });

  describe('when callback throws error', () => {
    let handleSpy: jest.SpyInstance;

    beforeEach(() => {
      (TaskExecutor as any).failureHandler = failureHandler;
      handleSpy = jest.spyOn(failureHandler, 'handleFailure');
    });

    it('should call "handleFailure" method of failureHandler and default teardown', () => {
      expect(() => TaskExecutor.execute(throwsCallback)).toThrow();
      expect(handleSpy).toHaveBeenCalled();
    });

    it('should call "handleFailure" method of failureHandler and custom teardown', () => {
      expect(() => TaskExecutor.execute(throwsCallback, rethrow)).toThrow();
      expect(handleSpy).toHaveBeenCalled();
    });
  });
});
