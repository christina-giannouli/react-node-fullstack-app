import '@testing-library/jest-dom/vitest';
import { cleanup } from '@testing-library/react';
import { afterEach } from 'vitest';

// Unmount rendered components between tests, since we don't use Vitest globals.
afterEach(() => {
  cleanup();
});
