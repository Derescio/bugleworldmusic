# Testing Strategy - Bugle World Music

## Overview

This document outlines the comprehensive testing strategy for the Bugle World Music website, ensuring code quality, reliability, and maintainability.

## Testing Pyramid

Our testing strategy follows the testing pyramid approach:

```
    /\
   /  \
  /    \  E2E Tests (Few)
 /______\
 /      \
/        \ Integration Tests (Some)
\________/
/        \
\        / Unit Tests (Many)
 \______/
```

## Testing Frameworks & Tools

- **Unit/Integration Testing**: Vitest + React Testing Library
- **E2E Testing**: Playwright (planned)
- **Coverage**: Vitest Coverage (c8)
- **Mocking**: Vitest built-in mocks
- **CI/CD**: GitHub Actions

## Test Categories

### 1. Unit Tests

**Purpose**: Test individual functions, components, and utilities in isolation.

**Coverage Areas**:

- ✅ Utility functions (`cn`, `formatPrice`, `calculateDiscount`)
- ✅ Data layer functions (product search, music catalog)
- ✅ UI components (Button, CartButton)
- ✅ Type definitions and interfaces

**Location**: `__tests__` folders alongside source files
**Naming**: `*.test.ts` or `*.test.tsx`

**Example**:

```typescript
// app/lib/utils/__tests__/cn.test.ts
describe('cn utility function', () => {
  it('should merge class names correctly', () => {
    expect(cn('text-red-500', 'bg-blue-500')).toBe('text-red-500 bg-blue-500');
  });
});
```

### 2. Integration Tests

**Purpose**: Test component interactions and user workflows.

**Coverage Areas**:

- ✅ Cart functionality (add/remove items, quantity updates)
- ✅ Product catalog interactions
- ✅ Search and filtering
- 🔄 Form submissions (planned)
- 🔄 Navigation flows (planned)

**Example**:

```typescript
// app/components/cart/__tests__/CartButton.test.tsx
describe('CartButton Component', () => {
  it('should display item count when cart has items', () => {
    mockGetItemCount.mockReturnValue(3)
    render(<CartButton />)
    expect(screen.getByText('3')).toBeInTheDocument()
  })
})
```

### 3. End-to-End Tests (Planned)

**Purpose**: Test complete user journeys from start to finish.

**Coverage Areas** (Future):

- User can browse products and add to cart
- User can complete checkout process
- User can search for music and view details
- User can submit booking inquiry
- Mobile responsive behavior

## Testing Standards

### File Organization

```
app/
├── components/
│   └── ui/
│       ├── button.tsx
│       └── __tests__/
│           └── button.test.tsx
├── lib/
│   └── utils/
│       ├── cn.ts
│       └── __tests__/
│           └── cn.test.ts
└── tests/
    └── setup.ts
```

### Naming Conventions

- Test files: `ComponentName.test.tsx` or `functionName.test.ts`
- Test suites: Descriptive names matching the component/function
- Test cases: Should describe the expected behavior

### Code Coverage Goals

- **Minimum**: 70% overall coverage
- **Target**: 85% overall coverage
- **Critical paths**: 95% coverage (cart, checkout, forms)

### Mock Strategy

1. **External Dependencies**: Always mock (APIs, localStorage, etc.)
2. **Next.js Components**: Mock Image, Link, Router
3. **Third-party Libraries**: Mock when needed for isolation
4. **Internal Modules**: Mock only when necessary

## Test Configuration

### Vitest Configuration (`vitest.config.ts`)

```typescript
export default defineConfig({
  plugins: [react()],
  test: {
    globals: true,
    environment: 'jsdom',
    setupFiles: ['./tests/setup.ts'],
    coverage: {
      reporter: ['text', 'json', 'html'],
      exclude: ['node_modules/', 'tests/', '**/*.d.ts'],
    },
  },
});
```

### Setup File (`tests/setup.ts`)

- Global test configuration
- DOM cleanup after each test
- Mock implementations for Next.js components
- Global mocks (localStorage, ResizeObserver, etc.)

## CI/CD Integration

### GitHub Actions Workflow

```yaml
- name: Run tests
  run: npm run test:run

- name: Run tests with coverage
  run: npm run test:coverage

- name: Upload coverage reports
  uses: codecov/codecov-action@v4
```

### Quality Gates

Tests must pass before:

- ✅ Merging to main branch
- ✅ Deployment to production
- ✅ Creating releases

## Testing Commands

```bash
# Run all tests
npm run test

# Run tests in watch mode
npm run test:watch

# Run tests once (CI)
npm run test:run

# Run with coverage
npm run test:coverage

# Run with UI
npm run test:ui
```

## Best Practices

### Writing Tests

1. **Arrange, Act, Assert**: Structure tests clearly
2. **Single Responsibility**: One assertion per test when possible
3. **Descriptive Names**: Test names should explain the expected behavior
4. **Data-driven**: Use test cases for multiple scenarios
5. **Cleanup**: Ensure tests don't affect each other

### Component Testing

1. **User-centric**: Test what users see and do
2. **Accessibility**: Test ARIA labels, keyboard navigation
3. **Edge Cases**: Empty states, loading states, error states
4. **Props**: Test different prop combinations
5. **Events**: Test user interactions

### Example Test Structure

```typescript
describe('ProductCard Component', () => {
  const mockProduct = {
    id: '1',
    name: 'Test Product',
    price: 2999,
    // ... other props
  }

  beforeEach(() => {
    vi.clearAllMocks()
  })

  describe('rendering', () => {
    it('should display product information', () => {
      render(<ProductCard product={mockProduct} />)

      expect(screen.getByText('Test Product')).toBeInTheDocument()
      expect(screen.getByText('$29.99')).toBeInTheDocument()
    })
  })

  describe('interactions', () => {
    it('should call onAddToCart when add button is clicked', () => {
      const onAddToCart = vi.fn()
      render(<ProductCard product={mockProduct} onAddToCart={onAddToCart} />)

      fireEvent.click(screen.getByText('Add to Cart'))

      expect(onAddToCart).toHaveBeenCalledWith(mockProduct)
    })
  })
})
```

## Current Test Status

### ✅ Completed

- Unit tests for utility functions
- Unit tests for data layer functions
- Component tests for UI components
- Cart functionality tests
- Testing infrastructure setup

### 🔄 In Progress

- Integration tests for user flows
- Form validation tests

### 📋 Planned

- E2E tests with Playwright
- Visual regression tests
- Performance tests
- Accessibility tests

## Maintenance

### Regular Tasks

1. **Weekly**: Review test coverage reports
2. **Monthly**: Update test dependencies
3. **Per Release**: Run full test suite
4. **Per Feature**: Add corresponding tests

### Metrics to Track

- Test coverage percentage
- Test execution time
- Test failure rate
- Flaky test identification

## Troubleshooting

### Common Issues

1. **Mock not working**: Check import paths and mock placement
2. **Tests timing out**: Increase timeout or optimize async operations
3. **Coverage gaps**: Use coverage reports to identify untested code
4. **Flaky tests**: Add proper waits and cleanup

### Debug Commands

```bash
# Run specific test file
npm run test -- ProductCard.test.tsx

# Run tests with verbose output
npm run test -- --reporter=verbose

# Debug specific test
npm run test -- --inspect-brk
```

## Resources

- [Vitest Documentation](https://vitest.dev/)
- [React Testing Library](https://testing-library.com/docs/react-testing-library/intro/)
- [Testing Best Practices](https://kentcdodds.com/blog/common-mistakes-with-react-testing-library)
- [Jest DOM Matchers](https://github.com/testing-library/jest-dom)

---

_This document is living and should be updated as our testing strategy evolves._
