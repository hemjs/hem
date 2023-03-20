import { FailureHandler } from '../../../src/task/failure-handler';

describe('FailurenHandler', () => {
  let handler: FailureHandler;
  let processStdoutWriteSpy: any;

  beforeEach(() => {
    handler = new FailureHandler();
    processStdoutWriteSpy = jest.spyOn(process.stdout, 'write');
  });

  afterEach(() => {
    processStdoutWriteSpy = jest.resetAllMocks();
  });

  it('should handle when a failure occurs', () => {
    const failure = new Error('Error!');
    handler.handleFailure(failure);

    expect(processStdoutWriteSpy).toHaveBeenCalled();
  });
});
