import { fireEvent, render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { vi } from 'vitest';
import Login from './Login';

vi.mock('../context/AuthContext', () => ({
  useAuth: () => ({ login: vi.fn() })
}));

vi.mock('react-hot-toast', () => ({
  default: { success: vi.fn(), error: vi.fn() }
}));

test('links users to forgot password from login', () => {
  render(
    <MemoryRouter>
      <Login />
    </MemoryRouter>
  );

  fireEvent.click(screen.getByRole('link', { name: 'Forgot password?' }));
  expect(screen.getByRole('link', { name: 'Forgot password?' })).toHaveAttribute('href', '/forgot-password');
});
