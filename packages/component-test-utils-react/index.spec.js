import reactUtils, {shallow} from './index';

describe('component-test-utils-react', () => {
  it('should export by default an object with all methods', () => {
    expect(typeof reactUtils.shallow === 'function').toBeTruthy();
  });

  it('should export shallow method directly', () => {
    expect(typeof shallow === 'function').toBeTruthy();
  });
});
