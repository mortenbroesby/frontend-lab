import type { Meta, StoryObj } from '@storybook/react-vite';
import { Badge } from '../src/badge';

const meta = {
  title: 'Content/Badge',
  component: Badge,
  tags: ['autodocs'],
  args: { children: 'Preview', variant: 'default' },
  argTypes: {
    variant: {
      control: 'select',
      options: ['default', 'secondary', 'outline', 'ghost', 'destructive', 'link'],
    },
  },
} satisfies Meta<typeof Badge>;
export default meta;
type Story = StoryObj<typeof meta>;
export const Default: Story = {};
export const Outline: Story = { args: { variant: 'outline' } };
