import type { Meta, StoryObj } from '@storybook/react';
import { fn } from '@storybook/test';
import Pagination from './Pagination';

const meta: Meta<typeof Pagination> = {
  title: 'Components/Pagination',
  component: Pagination,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
  args: {
    onPageChange: fn(),
  },
};

export default meta;
type Story = StoryObj<typeof Pagination>;

export const FirstPage: Story = {
  args: {
    currentPage: 1,
    totalPages: 10,
  },
};

export const MiddlePage: Story = {
  args: {
    currentPage: 5,
    totalPages: 10,
  },
};

export const LastPage: Story = {
  args: {
    currentPage: 10,
    totalPages: 10,
  },
};

export const FewPages: Story = {
  args: {
    currentPage: 2,
    totalPages: 3,
  },
};

export const ManyPages: Story = {
  args: {
    currentPage: 50,
    totalPages: 100,
  },
};

export const SinglePage: Story = {
  args: {
    currentPage: 1,
    totalPages: 1,
  },
};
