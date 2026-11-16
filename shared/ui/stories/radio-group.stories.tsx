import { useId } from 'react';
import type { Meta, StoryObj } from '@storybook/react-vite';
import { RadioGroup, RadioGroupItem } from '../src/radio-group';
import { Label } from '../src/label';

const meta = {
  title: 'Forms/RadioGroup',
  component: RadioGroup,
  tags: ['autodocs'],
  args: { defaultValue: 'comfortable', 'aria-label': 'Display density', disabled: false },
  render: function RadioGroupStory(args) {
    const id = useId();
    return (
      <RadioGroup {...args}>
        <div className="flex items-center gap-3">
          <RadioGroupItem id={`${id}-compact`} value="compact" />
          <Label htmlFor={`${id}-compact`}>Compact</Label>
        </div>
        <div className="flex items-center gap-3">
          <RadioGroupItem id={`${id}-comfortable`} value="comfortable" />
          <Label htmlFor={`${id}-comfortable`}>Comfortable</Label>
        </div>
      </RadioGroup>
    );
  },
} satisfies Meta<typeof RadioGroup>;
export default meta;
type Story = StoryObj<typeof meta>;
export const Default: Story = {};
export const Disabled: Story = { args: { disabled: true } };
