import { useId } from 'react';
import type { Meta, StoryObj } from '@storybook/react-vite';
import { Checkbox } from '../src/checkbox';
import { Label } from '../src/label';

const meta = {
  title: 'Forms/Checkbox',
  component: Checkbox,
  tags: ['autodocs'],
  args: { disabled: false, 'aria-label': 'Enable notifications' },
  render: function CheckboxStory(args) {
    const id = useId();
    return (
      <div className="flex items-center gap-3">
        <Checkbox {...args} id={id} />
        <Label htmlFor={id}>Enable notifications</Label>
      </div>
    );
  },
} satisfies Meta<typeof Checkbox>;
export default meta;
type Story = StoryObj<typeof meta>;
export const Default: Story = {};
export const Checked: Story = { args: { defaultChecked: true } };
export const Disabled: Story = { args: { disabled: true } };
export const Indeterminate: Story = { args: { checked: 'indeterminate' } };
