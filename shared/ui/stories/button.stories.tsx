import type { Meta, StoryObj } from '@storybook/react-vite';
import { Button } from '../src/button';

const meta = {
  title: 'Actions/Button',
  component: Button,
  tags: ['autodocs'],
  args: { children: 'Save changes', disabled: false, variant: 'default', size: 'default' },
  argTypes: {
    asChild: { control: false },
    variant: {
      control: 'select',
      options: ['default', 'secondary', 'outline', 'ghost', 'destructive', 'link'],
    },
    size: { control: 'select', options: ['default', 'xs', 'sm', 'lg'] },
  },
} satisfies Meta<typeof Button>;
export default meta;
type Story = StoryObj<typeof meta>;
export const Default: Story = {};
export const Disabled: Story = { args: { disabled: true } };
export const Destructive: Story = { args: { variant: 'destructive', children: 'Delete draft' } };
export const Link: Story = {
  args: { asChild: true, children: <a href="#details">View details</a> },
};
