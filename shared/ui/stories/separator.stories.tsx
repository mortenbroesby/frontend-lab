import type { Meta, StoryObj } from '@storybook/react-vite';
import { Separator } from '../src/separator';

const meta = {
  title: 'Content/Separator',
  component: Separator,
  tags: ['autodocs'],
  args: { orientation: 'horizontal', decorative: true },
  render: (args) => (
    <div className="space-y-4">
      <p>Project overview</p>
      <Separator {...args} />
      <p>Last edited today</p>
    </div>
  ),
} satisfies Meta<typeof Separator>;
export default meta;
type Story = StoryObj<typeof meta>;
export const Default: Story = {};

export const Vertical: Story = {
  args: { orientation: 'vertical' },
  render: (args) => (
    <div className="flex h-8 items-center gap-4">
      <span>Overview</span>
      <Separator {...args} />
      <span>Activity</span>
    </div>
  ),
};
