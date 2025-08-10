import { describe, it, expect, beforeEach, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import CartButton from '../CartButton';

// Mock the cart hydration hook
const mockToggleCart = vi.fn();
const mockGetItemCount = vi.fn();

vi.mock('@/lib/hooks/useCartHydration', () => ({
  useCartStoreHydrated: () => ({
    toggleCart: mockToggleCart,
    getItemCount: mockGetItemCount,
  }),
}));

describe('CartButton Component', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    mockGetItemCount.mockReturnValue(0);
  });

  it('should render cart button with shopping cart icon', () => {
    render(<CartButton />);

    const button = screen.getByRole('button');
    expect(button).toBeInTheDocument();
    expect(button).toHaveClass('relative');
  });

  it('should display item count when cart has items', () => {
    mockGetItemCount.mockReturnValue(3);

    render(<CartButton />);

    expect(screen.getByText('3')).toBeInTheDocument();
  });

  it('should not display count when cart is empty', () => {
    mockGetItemCount.mockReturnValue(0);

    render(<CartButton />);

    expect(screen.queryByText('0')).not.toBeInTheDocument();
  });

  it('should call toggleCart when clicked', () => {
    render(<CartButton />);

    const button = screen.getByRole('button');
    fireEvent.click(button);

    expect(mockToggleCart).toHaveBeenCalledTimes(1);
  });

  it('should display correct count for large numbers', () => {
    mockGetItemCount.mockReturnValue(99);

    render(<CartButton />);

    expect(screen.getByText('99')).toBeInTheDocument();
  });

  it('should handle very large item counts', () => {
    mockGetItemCount.mockReturnValue(999);

    render(<CartButton />);

    const countElement = screen.getByText('99+'); // Should show 99+ for counts > 99
    expect(countElement).toBeInTheDocument();
    expect(countElement).toHaveClass('bg-orange-500'); // Should have notification styling
  });

  it('should have proper styling classes', () => {
    mockGetItemCount.mockReturnValue(1);

    render(<CartButton />);

    const button = screen.getByRole('button');
    expect(button).toHaveClass('relative');

    const countBadge = screen.getByText('1');
    expect(countBadge).toHaveClass('absolute', '-top-2', '-right-2');
  });
});
