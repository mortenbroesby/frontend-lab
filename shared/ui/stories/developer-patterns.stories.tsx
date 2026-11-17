import type { Meta, StoryObj } from '@storybook/react-vite';
import { Snippet } from '../src/snippet';
import { EmptyState } from '../src/empty-state';
import { Kbd } from '../src/kbd';
import { Button } from '../src/button';

const meta = {
  title: 'Content/Developer patterns',
  component: Snippet,
  tags: ['autodocs'],
  args: { code: 'npm run dev' },
} satisfies Meta<typeof Snippet>;
export default meta;
type Story = StoryObj<typeof meta>;
export const Command: Story = {};
export const MultipleLines: Story = { args: { code: 'npm install\nnpm run dev' } };
export const Empty: Story = {
  render: () => (
    <EmptyState
      title="No matching demos"
      description="Try a different search or clear your filters."
    >
      <Button variant="outline">Clear filters</Button>
    </EmptyState>
  ),
};
export const KeyboardHint: Story = {
  render: () => (
    <p>
      Open commands with <Kbd>Ctrl</Kbd> + <Kbd>K</Kbd>.
    </p>
  ),
};
