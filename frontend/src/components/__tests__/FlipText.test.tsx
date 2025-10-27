import { render, screen } from '@testing-library/react';
import FlipText from '../FlipText';

describe('FlipText', () => {
  it('renders text correctly', () => {
    render(<FlipText text="TEST" />);
    expect(screen.getByText('T')).toBeInTheDocument();
    expect(screen.getByText('E')).toBeInTheDocument();
    expect(screen.getByText('S')).toBeInTheDocument();
    expect(screen.getByText('T')).toBeInTheDocument();
  });

  it('handles empty strings', () => {
    render(<FlipText text="" />);
    // Should render without errors
    const container = screen.getByRole('generic');
    expect(container).toBeInTheDocument();
  });

  it('applies custom className', () => {
    const { container } = render(<FlipText text="TEST" className="custom-class" />);
    expect(container.querySelector('.custom-class')).toBeInTheDocument();
  });

  it('renders each character separately', () => {
    render(<FlipText text="ABC" />);
    const chars = screen.getAllByText(/[ABC]/);
    expect(chars.length).toBeGreaterThanOrEqual(3); // Each character renders multiple times due to flip structure
  });
});


