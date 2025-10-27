# Testing Guide

This document describes the testing setup and strategy for the StationBoard application.

## Testing Framework

The project uses **Jest** as the testing framework for both frontend and backend:

- **Backend**: Jest + ts-jest for TypeScript support
- **Frontend**: Jest + React Testing Library for component testing

## Running Tests

### Backend Tests

```bash
cd backend
npm test                  # Run all tests once
npm run test:watch       # Run tests in watch mode
npm run test:coverage    # Run tests with coverage report
```

### Frontend Tests

```bash
cd frontend
npm test                  # Run all tests once
npm run test:watch       # Run tests in watch mode
npm run test:coverage    # Run tests with coverage report
```

### Running All Tests

From the root directory:

```bash
npm --prefix backend test && npm --prefix frontend test
```

## Test Structure

### Backend Tests

Located in `backend/src/**/__tests__/`:

- **Service Tests**: API integration tests (e.g., `darwin.service.test.ts`)
- **Utility Tests**: Helper function tests (e.g., `validation.test.ts`)
- **Data Tests**: Data validation tests (e.g., `stations.test.ts`)

### Frontend Tests

Located in `frontend/src/**/__tests__/`:

- **Component Tests**: React component testing (e.g., `BoardRow.test.tsx`)
- **Integration Tests**: Component interaction tests
- **Accessibility Tests**: A11y testing with jest-dom

## Test Coverage

Current test coverage includes:

### Backend
- ✅ Darwin service API calls
- ✅ CRS code validation
- ✅ Station data structure validation
- ⏸️ WebSocket handlers (TODO)
- ⏸️ Route handlers (TODO)

### Frontend
- ✅ BoardRow component rendering
- ✅ FlipText component rendering
- ⏸️ FlipCharacter animation (TODO)
- ⏸️ StationSelector component (TODO)
- ⏸️ useRealtimeBoard hook (TODO)

## Writing New Tests

### Backend Test Example

```typescript
import { functionToTest } from '../module';

describe('Module Name', () => {
  describe('functionName', () => {
    it('should handle valid input', () => {
      const result = functionToTest('valid-input');
      expect(result).toBe(expectedValue);
    });

    it('should handle edge cases', () => {
      const result = functionToTest('');
      expect(result).toBeDefined();
    });
  });
});
```

### Frontend Component Test Example

```typescript
import { render, screen } from '@testing-library/react';
import Component from '../Component';

describe('Component', () => {
  it('renders correctly', () => {
    render(<Component prop="value" />);
    expect(screen.getByText('Expected Text')).toBeInTheDocument();
  });
});
```

## Test Best Practices

1. **Test Structure**: Use `describe` blocks to group related tests
2. **Test Names**: Use descriptive test names that explain what's being tested
3. **Arrange-Act-Assert**: Structure tests with setup, execution, and verification
4. **Mocking**: Mock external dependencies (APIs, WebSockets, etc.)
5. **Coverage**: Aim for >80% coverage on business logic
6. **Isolation**: Each test should be independent and not rely on others

## Mocking External Services

### Mocking API Calls

```typescript
import axios from 'axios';
jest.mock('axios');

it('should handle API calls', async () => {
  (axios.get as jest.Mock).mockResolvedValue({ data: mockData });
  const result = await functionThatUsesAxios();
  expect(result).toEqual(expectedResult);
});
```

### Mocking WebSockets

```typescript
import { io } from 'socket.io-client';
jest.mock('socket.io-client');

it('should handle WebSocket messages', () => {
  const mockSocket = {
    on: jest.fn(),
    emit: jest.fn(),
  };
  (io as jest.Mock).mockReturnValue(mockSocket);
  // Test implementation
});
```

## Continuous Integration

Tests run automatically on:

- Pull requests
- Before merging to main
- On commit to feature branches (optional)

To configure CI, add to `.github/workflows/test.yml`:

```yaml
name: Tests
on: [push, pull_request]
jobs:
  test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - uses: actions/setup-node@v3
      - run: npm --prefix backend test
      - run: npm --prefix frontend test
```

## Troubleshooting

### Tests Not Finding Modules

Ensure paths are configured correctly in:
- `jest.config.js`
- `tsconfig.json`

### Timeout Issues

Increase timeout in test:

```typescript
it('long running test', async () => {
  // test code
}, 10000); // 10 second timeout
```

### Mock Not Working

Ensure mocks are in the right scope:

```typescript
beforeEach(() => {
  jest.clearAllMocks();
});
```

## Next Steps

Additional test areas to implement:

- [ ] E2E tests with Playwright
- [ ] Visual regression tests
- [ ] Performance tests
- [ ] Load testing for WebSocket connections
- [ ] Accessibility tests (WCAG compliance)


