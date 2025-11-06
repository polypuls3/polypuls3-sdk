# Contributing to Polypuls3 SDK

Thank you for your interest in contributing to the Polypuls3 SDK! This document provides guidelines and instructions for contributing.

## Getting Started

1. Fork the repository
2. Clone your fork: `git clone https://github.com/your-username/polypuls3-sdk.git`
3. Install dependencies: `npm install`
4. Create a new branch: `git checkout -b feature/your-feature-name`

## Development Workflow

### Running in Development Mode

```bash
npm run dev
```

This will run the build in watch mode, automatically recompiling when you make changes.

### Type Checking

```bash
npm run typecheck
```

### Linting

```bash
npm run lint
```

### Building

```bash
npm run build
```

## Code Style

- Use TypeScript for all new code
- Follow the existing code style
- Use meaningful variable and function names
- Add JSDoc comments for public APIs
- Keep functions small and focused

## Project Structure

```
src/
├── core/           # Core types, ABIs, configs, utilities
├── hooks/          # React hooks for contract interactions
├── components/     # UI components
├── subgraph/       # Subgraph queries and hooks
└── styles/         # CSS styles
```

## Adding New Features

### Adding a New Hook

1. Create a new file in `src/hooks/`
2. Export the hook and its types
3. Add exports to `src/hooks/index.ts`
4. Add documentation with examples
5. Update README.md

Example:
```typescript
// src/hooks/useMyFeature.ts
import { useReadContract } from 'wagmi'

export interface UseMyFeatureParams {
  // params
}

export interface UseMyFeatureReturn {
  // return type
}

/**
 * Hook description
 *
 * @example
 * ```tsx
 * const { data } = useMyFeature({ ... })
 * ```
 */
export function useMyFeature(params: UseMyFeatureParams): UseMyFeatureReturn {
  // implementation
}
```

### Adding a New Component

1. Create a new file in `src/components/`
2. Export the component and its props type
3. Add exports to `src/components/index.ts`
4. Use Tailwind classes with `pp-` prefix
5. Add JSDoc with usage examples
6. Update README.md

Example:
```typescript
// src/components/MyComponent.tsx
import React from 'react'
import clsx from 'clsx'

export interface MyComponentProps {
  // props
}

/**
 * Component description
 *
 * @example
 * ```tsx
 * <MyComponent prop={value} />
 * ```
 */
export function MyComponent({ ...props }: MyComponentProps) {
  return (
    <div className="polypuls3-card">
      {/* component */}
    </div>
  )
}
```

## Testing

Currently, the SDK doesn't have a test suite. Adding tests would be a valuable contribution!

Potential testing frameworks to consider:
- Vitest for unit tests
- React Testing Library for component tests
- Wagmi's test utilities for hook tests

## Documentation

- Add JSDoc comments to all public functions and components
- Include usage examples in JSDoc
- Update README.md with new features
- Add examples to `/examples` directory

## Pull Request Process

1. Ensure your code builds without errors
2. Run type checking and fix any issues
3. Run linting and fix any issues
4. Update documentation as needed
5. Commit your changes with clear commit messages
6. Push to your fork
7. Open a pull request with a clear description

### Commit Message Guidelines

Use conventional commit format:

- `feat:` new feature
- `fix:` bug fix
- `docs:` documentation changes
- `style:` formatting, missing semi-colons, etc
- `refactor:` code refactoring
- `test:` adding tests
- `chore:` maintenance tasks

Example:
```
feat: add usePollStatistics hook

- Fetches aggregated poll statistics
- Returns total polls, votes, and active polls
- Includes loading and error states
```

## Release Process

Releases are handled by maintainers:

1. Update version in `package.json`
2. Update CHANGELOG.md
3. Create a git tag
4. Publish to npm

## Need Help?

- Open an issue for bugs or feature requests
- Start a discussion for questions
- Check existing issues and PRs before creating new ones

## Code of Conduct

- Be respectful and inclusive
- Provide constructive feedback
- Focus on what is best for the community

Thank you for contributing to Polypuls3 SDK! 🎉
