import { render, screen, fireEvent } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import Pagination from './Pagination';

describe('Pagination', () => {
  const mockOnPageChange = jest.fn();

  beforeEach(() => {
    mockOnPageChange.mockClear();
    // Mock window.scrollTo
    window.scrollTo = jest.fn();
  });

  it('should render current page and total pages', () => {
    render(
      <MemoryRouter>
        <Pagination
          currentPage={1}
          totalPages={10}
          onPageChange={mockOnPageChange}
        />
      </MemoryRouter>
    );
    expect(screen.getByText('1')).toBeInTheDocument();
    expect(screen.getByText('10')).toBeInTheDocument();
  });

  it('should disable Previous button on first page', () => {
    render(
      <MemoryRouter>
        <Pagination
          currentPage={1}
          totalPages={10}
          onPageChange={mockOnPageChange}
        />
      </MemoryRouter>
    );
    const prevButton = screen.getByRole('button', { name: /previous/i });
    expect(prevButton).toBeDisabled();
  });

  it('should disable Next button on last page', () => {
    render(
      <MemoryRouter>
        <Pagination
          currentPage={10}
          totalPages={10}
          onPageChange={mockOnPageChange}
        />
      </MemoryRouter>
    );
    const nextButton = screen.getByRole('button', { name: /next/i });
    expect(nextButton).toBeDisabled();
  });

  it('should call onPageChange when clicking next', () => {
    render(
      <MemoryRouter>
        <Pagination
          currentPage={1}
          totalPages={10}
          onPageChange={mockOnPageChange}
        />
      </MemoryRouter>
    );
    const nextButton = screen.getByRole('button', { name: /next/i });
    fireEvent.click(nextButton);
    expect(mockOnPageChange).toHaveBeenCalledWith(2);
  });

  it('should call onPageChange when clicking previous', () => {
    render(
      <MemoryRouter>
        <Pagination
          currentPage={5}
          totalPages={10}
          onPageChange={mockOnPageChange}
        />
      </MemoryRouter>
    );
    const prevButton = screen.getByRole('button', { name: /previous/i });
    fireEvent.click(prevButton);
    expect(mockOnPageChange).toHaveBeenCalledWith(4);
  });

  it('should call onPageChange when clicking page number', () => {
    render(
      <MemoryRouter>
        <Pagination
          currentPage={1}
          totalPages={10}
          onPageChange={mockOnPageChange}
        />
      </MemoryRouter>
    );
    const pageThreeButton = screen.getByRole('button', { name: '3' });
    fireEvent.click(pageThreeButton);
    expect(mockOnPageChange).toHaveBeenCalledWith(3);
  });

  it('should scroll to top when changing pages', () => {
    render(
      <MemoryRouter>
        <Pagination
          currentPage={1}
          totalPages={10}
          onPageChange={mockOnPageChange}
        />
      </MemoryRouter>
    );
    const nextButton = screen.getByRole('button', { name: /next/i });
    fireEvent.click(nextButton);
    expect(window.scrollTo).toHaveBeenCalledWith({
      top: 0,
      behavior: 'smooth',
    });
  });

  it('should show ellipsis for many pages', () => {
    render(
      <MemoryRouter>
        <Pagination
          currentPage={5}
          totalPages={20}
          onPageChange={mockOnPageChange}
        />
      </MemoryRouter>
    );
    expect(screen.getAllByText('...').length).toBeGreaterThan(0);
  });

  it('should highlight current page', () => {
    render(
      <MemoryRouter>
        <Pagination
          currentPage={5}
          totalPages={10}
          onPageChange={mockOnPageChange}
        />
      </MemoryRouter>
    );
    const currentPageButton = screen.getByRole('button', { name: '5' });
    expect(currentPageButton).toHaveClass('bg-primary');
  });

  it('should show all pages when total is 5 or less', () => {
    render(
      <MemoryRouter>
        <Pagination
          currentPage={2}
          totalPages={5}
          onPageChange={mockOnPageChange}
        />
      </MemoryRouter>
    );
    expect(screen.getByRole('button', { name: '1' })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: '2' })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: '3' })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: '4' })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: '5' })).toBeInTheDocument();
    expect(screen.queryByText('...')).not.toBeInTheDocument();
  });
});
