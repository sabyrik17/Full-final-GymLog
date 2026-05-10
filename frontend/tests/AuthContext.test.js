import { render, screen } from '@testing-library/react';
import { AuthProvider } from '@/context/AuthContext';

describe('AuthContext', () => {
  it('should provide auth context to children', () => {
    render(
      <AuthProvider>
        <div>Test Child</div>
      </AuthProvider>
    );
    
    expect(screen.getByText('Test Child')).toBeInTheDocument();
  });
});
