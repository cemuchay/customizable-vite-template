import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import Dashboard from '../Dashboard';

// Set up a clean QueryClient for the test environment
const createTestQueryClient = () => new QueryClient({
  defaultOptions: {
    queries: {
      retry: false, // Turn off retries for fast testing failures
    },
  },
});

describe('Dashboard Component', () => {
  it('renders stats titles and header username', () => {
    const queryClient = createTestQueryClient();
    
    render(
      <QueryClientProvider client={queryClient}>
        <Dashboard />
      </QueryClientProvider>
    );

    // Verify user profile title displays
    expect(screen.getByText(/Welcome back, Developer/i)).toBeInTheDocument();
    
    // Verify structural grid headings render
    expect(screen.getByText(/Active Users/i)).toBeInTheDocument();
    expect(screen.getByText(/API Requests/i)).toBeInTheDocument();
    expect(screen.getByText(/Server Load/i)).toBeInTheDocument();
  });
});
