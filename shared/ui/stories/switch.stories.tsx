import { useId } from 'react';
import type { Meta, StoryObj } from '@storybook/react-vite';
import { Switch } from '../src/switch';
import { Label } from '../src/label';

const meta = {
  title: 'Forms/Switch',
  component: Switch,
  tags: ['autodocs'],
  args: { disabled: false, 'aria-label': 'Enable notifications' },
  render: function SwitchStory(args) {
    const id = useId();
    return (
      <div className="flex items-center gap-3">
        <Switch {...args} id={id} />
        <Label htmlFor={id}>Enable notifications</Label>
      </div>
    );
  },
} satisfies Meta<typeof Switch>;
export default meta;
type Story = StoryObj<typeof meta>;
export const Default: Story = {};
export const Checked: Story = { args: { defaultChecked: true } };
export const Disabled: Story = { args: { disabled: true } };
