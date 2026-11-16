import type { Meta, StoryObj } from '@storybook/react-vite';
import { Skeleton } from '../src/skeleton';

const meta = {
  title: 'Feedback/Skeleton',
  component: Skeleton,
  tags: ['autodocs'],
  args: { className: 'h-5 w-48' },
} satisfies Meta<typeof Skeleton>;
export default meta;
type Story = StoryObj<typeof meta>;
export const Default: Story = {};
export const CardPlaceholder: Story = {
  render: () => (
    <div role="status" aria-label="Loading project" className="space-y-3">
      <Skeleton className="h-32 w-full" />
      <Skeleton className="h-5 w-48" />
      <Skeleton className="h-4 w-64" />
    </div>
  ),
};
