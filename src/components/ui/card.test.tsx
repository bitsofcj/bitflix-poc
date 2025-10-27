import { render } from '@testing-library/react';
import {
  Card,
  CardHeader,
  CardFooter,
  CardTitle,
  CardAction,
  CardDescription,
  CardContent,
} from './card';

describe('Card Components', () => {
  it('should render Card component', () => {
    const { container } = render(<Card>Card content</Card>);
    const card = container.querySelector('[data-slot="card"]');
    expect(card).toBeInTheDocument();
    expect(card).toHaveTextContent('Card content');
  });

  it('should render CardHeader component', () => {
    const { container } = render(<CardHeader>Header content</CardHeader>);
    const header = container.querySelector('[data-slot="card-header"]');
    expect(header).toBeInTheDocument();
    expect(header).toHaveTextContent('Header content');
  });

  it('should render CardTitle component', () => {
    const { container } = render(<CardTitle>Title</CardTitle>);
    const title = container.querySelector('[data-slot="card-title"]');
    expect(title).toBeInTheDocument();
    expect(title).toHaveTextContent('Title');
  });

  it('should render CardDescription component', () => {
    const { container } = render(
      <CardDescription>Description</CardDescription>
    );
    const description = container.querySelector(
      '[data-slot="card-description"]'
    );
    expect(description).toBeInTheDocument();
    expect(description).toHaveTextContent('Description');
  });

  it('should render CardAction component', () => {
    const { container } = render(<CardAction>Action</CardAction>);
    const action = container.querySelector('[data-slot="card-action"]');
    expect(action).toBeInTheDocument();
    expect(action).toHaveTextContent('Action');
  });

  it('should render CardContent component', () => {
    const { container } = render(<CardContent>Content</CardContent>);
    const content = container.querySelector('[data-slot="card-content"]');
    expect(content).toBeInTheDocument();
    expect(content).toHaveTextContent('Content');
  });

  it('should render CardFooter component', () => {
    const { container } = render(<CardFooter>Footer</CardFooter>);
    const footer = container.querySelector('[data-slot="card-footer"]');
    expect(footer).toBeInTheDocument();
    expect(footer).toHaveTextContent('Footer');
  });
});
