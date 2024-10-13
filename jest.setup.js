// Remove the axios configuration as it's causing issues
jest.setTimeout(30000); // Increase timeout for all tests

// If you need any global test setup, you can add it here

beforeEach(() => {
  jest.resetAllMocks();
  jest.clearAllMocks();
});