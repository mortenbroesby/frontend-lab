import type { Meta, StoryObj } from '@storybook/react-vite';
import { ScrollArea } from '../src/scroll-area';

const meta = {
  title: 'Content/ScrollArea',
  component: ScrollArea,
  tags: ['autodocs'],
  args: { className: 'h-48 rounded-md border', viewportProps: { 'aria-label': 'Activity log' } },
  render: (args) => (
    <ScrollArea {...args}>
      <div className="space-y-3 p-4">
        {Array.from({ length: 20 }, (_, index) => (
          <p key={index}>Activity {index + 1}: saved a draft.</p>
        ))}
      </div>
    </ScrollArea>
  ),
} satisfies Meta<typeof ScrollArea>;
export default meta;
type Story = StoryObj<typeof meta>;
export const Default: Story = {};
