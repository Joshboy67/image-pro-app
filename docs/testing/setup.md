# Testing Setup

## Configuration

### Jest Configuration
- Environment: jest-environment-jsdom
- Coverage threshold: 80%
- Module aliases configured
- Test setup file configured

### Test Environment
- Mocked Supabase client
- Mocked Next.js navigation
- Mocked Next.js Image component
- Mocked window.matchMedia

## Test Structure

### Test Files
- Location: `__tests__` directory
- Naming: `*.test.ts` or `*.test.tsx`
- Coverage requirements:
  - Branches: 80%
  - Functions: 80%
  - Lines: 80%
  - Statements: 80%

### Mocked Services
- Supabase Auth
- Supabase Storage
- Supabase Database
- Next.js Router
- Next.js Image

## Running Tests

### Commands
```bash
# Run all tests
npm test

# Run tests in watch mode
npm test -- --watch

# Run tests with coverage
npm test -- --coverage

# Run specific test file
npm test -- path/to/test.ts
```

### Coverage Report
- Generated in `coverage` directory
- HTML report available
- Console summary provided

## Best Practices

### Writing Tests
- Use descriptive test names
- Follow AAA pattern (Arrange, Act, Assert)
- Mock external dependencies
- Test error cases
- Test edge cases

### Test Organization
- Group related tests
- Use describe blocks
- Use beforeEach/afterEach hooks
- Keep tests independent
- Clean up after tests

## Continuous Integration

### GitHub Actions
- Run tests on push
- Run tests on pull requests
- Generate coverage report
- Check coverage thresholds

### Pre-commit Hooks
- Run tests before commit
- Check code formatting
- Check linting
- Prevent commits if tests fail 