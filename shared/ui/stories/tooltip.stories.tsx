import type { Meta, StoryObj } from '@storybook/react-vite';
import { Tooltip, TooltipProvider, TooltipTrigger, TooltipContent } from '../src/tooltip';
import { Button } from '../src/button';

const meta = {
  title: 'Overlays/Tooltip',
  component: Tooltip,
  tags: ['autodocs'],
  render: (args) => (
    <TooltipProvider>
      <Tooltip {...args}>
        <TooltipTrigger asChild>
          <Button variant="outline">Save draft</Button>
        </TooltipTrigger>
        <TooltipContent>Keep your changes for later</TooltipContent>
      </Tooltip>
    </TooltipProvider>
  ),
} satisfies Meta<typeof Tooltip>;
export default meta;
type Story = StoryObj<typeof meta>;
export const Default: Story = {};
