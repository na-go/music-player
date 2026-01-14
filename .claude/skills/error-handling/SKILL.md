---
name: error-handling
description: >
  Guide for error handling using Result type (neverthrow).
  Use when dealing with error handling, null checks, undefined values, or when user mentions Result type or neverthrow.
---

# Error Handling with Result Type

## Rule

**Never use `null` or `undefined` for error cases.** Use `Result<T, E>` type from neverthrow.

## Pattern

```typescript
import { ok, err, type Result } from "neverthrow";

// Function that can fail
export const getElementById = (id: string): Result<HTMLElement, string> => {
  const element = document.getElementById(id);
  return element !== null
    ? ok(element)           // Success
    : err("Element not found");  // Failure
};

// Usage - .match() forces error handling
getElementById("app").match(
  (element) => {
    // Success case
    createRoot(element).render(<App />);
  },
  (error) => {
    // Error case
    alert(error);
  }
);
```

## Why Result Type?

**Bad (traditional approach):**
```typescript
export const getElementById = (id: string): HTMLElement | null => {
  return document.getElementById(id);
};

// Easy to forget null check
const element = getElementById("app");
element.appendChild(node);  // Runtime error if element is null!
```

**Good (Result type):**
```typescript
export const getElementById = (id: string): Result<HTMLElement, string> => {
  const element = document.getElementById(id);
  return element !== null ? ok(element) : err("Element not found");
};

// Compiler forces you to handle both cases
getElementById("app").match(
  (element) => element.appendChild(node),  // Success
  (error) => console.error(error)          // Error
);
```

## Result Utilities

```typescript
// ok() - Create success Result
const result = ok(42);  // Result<number, never>

// err() - Create error Result
const result = err("Failed");  // Result<never, string>

// .match() - Handle both cases
result.match(
  (value) => console.log(value),   // Success handler
  (error) => console.error(error)  // Error handler
);

// .map() - Transform success value
const doubled = result.map(x => x * 2);

// .mapErr() - Transform error value
const withContext = result.mapErr(e => `Error: ${e}`);

// .isOk() / .isErr() - Check type
if (result.isOk()) {
  console.log(result.value);
}
```

## Chaining Operations

```typescript
const result = getElementById("app")
  .map(element => element.querySelector('.container'))
  .map(container => container.textContent)
  .mapErr(err => `UI Error: ${err}`);

result.match(
  (text) => console.log(text),
  (error) => alert(error)
);
```

## When to Use

Use Result type when:
- Function can fail (DOM queries, parsing, validation)
- Error handling should be explicit
- Null/undefined checks would be needed

Don't need Result type for:
- Functions that always succeed
- Errors that should crash (use `throw`)
- React component props (use optional types)

## Examples in Codebase

See: `src/utils/dom/get-element-by-id/index.tsx`

```typescript
import { err, ok, type Result } from "neverthrow";

export const getElementById = (id: string): Result<HTMLElement, string> => {
  const element = document.getElementById(id);
  return element !== null ? ok(element) : err("Element not found");
};
```

Used in: `src/index.tsx`

```typescript
getElementById("app").match(
  (element) => createRoot(element).render(<App />),
  (err) => alert(err)
);
```

## Checklist

- [ ] Never return `null` or `undefined` for errors
- [ ] Use `Result<T, E>` type from neverthrow
- [ ] Use `.match()` to force error handling
- [ ] Error messages are descriptive strings
