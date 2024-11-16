<!-- omit in toc -->
# Testing Best Practices

> 🤖 **Note:** Add this to the context of AI-assisted development prompts like Aider or Cursor composer to allow the AI to understand our testing methodology and make better recommendations when writing or modifying tests.

## Testing Scope and Philosophy

Our testing approach is designed to be pragmatic, efficient, and focused on system behavior rather than implementation details. This document outlines our core testing principles and strategies.

### 1. Testing Levels

We currently focus on testing at two primary levels:

1. **API to Database Tests**: 
   - Verify the complete round-trip of data through our API layers
   - Ensure data integrity and correct database interactions
   - Test API endpoints from request to database and back to response

2. **User Interaction to API Tests**:
   - Validate user interface interactions with API calls
   - Simulate real-world user scenarios
   - Confirm that UI components correctly interact with backend services

### 2. Behavior-Focused Testing

Our testing philosophy emphasizes testing **what** the system does, not **how** it does it:

- We do not write tests that examine internal code implementation
- Focus on observable system behavior from API and user perspectives
- Tests should be independent of the underlying code structure

### 3. Testing Goals

Our testing strategy aims to:

1. **Enable Speedy Refactoring**:
   - Create tests that can withstand code restructuring
   - Provide confidence when making systemic changes
   - Minimize the risk of breaking existing functionality

2. **Ease of Test Creation**:
   - Keep test writing quick and straightforward
   - Reduce complexity in test development
   - Encourage comprehensive test coverage without significant overhead

3. **Minimize Testing Friction**:
   - Avoid getting bogged down in complex type systems
   - Reduce time spent on intricate mocking
   - Focus on practical, functional testing approaches

### 4. Feature-Centric Testing

We prioritize testing the application's features and user-facing functionality:

- Test the end-to-end flow of features
- Verify that features work as expected from a user's perspective
- Avoid testing internal implementation details

## Conclusion

By adhering to these principles, we create a testing strategy that is:
- Lightweight
- Maintainable
- Focused on real-world functionality
- Supportive of rapid development and refactoring
