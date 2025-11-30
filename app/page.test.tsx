import { render } from '@testing-library/react';
import Home from './page';

// Mock MovieBrowser component
jest.mock('@/components/MovieBrowser', () => {
  const MockMovieBrowser = () => <div data-testid="movie-browser">MovieBrowser</div>;
  MockMovieBrowser.displayName = 'MovieBrowser';
  return MockMovieBrowser;
});

describe('Home Page', () => {
  it('should render main element', () => {
    const { container } = render(<Home />);
    const main = container.querySelector('main');
    expect(main).toBeInTheDocument();
  });

  it('should have min-h-screen class on main element', () => {
    const { container } = render(<Home />);
    const main = container.querySelector('main');
    expect(main).toHaveClass('min-h-screen');
  });

  it('should render MovieBrowser component', () => {
    const { getByTestId } = render(<Home />);
    expect(getByTestId('movie-browser')).toBeInTheDocument();
  });
});
