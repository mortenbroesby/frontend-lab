import type { Meta, StoryObj } from '@storybook/react-vite';
import { Slider } from '../src/slider';

const meta = {
  title: 'Forms/Slider',
  component: Slider,
  tags: ['autodocs'],
  args: { defaultValue: [40], min: 0, max: 100, step: 1, 'aria-label': 'Volume', disabled: false },
} satisfies Meta<typeof Slider>;
export default meta;
type Story = StoryObj<typeof meta>;
export const Default: Story = {};
export const Range: Story = {
  args: { defaultValue: [20, 80], thumbLabels: ['Minimum price', 'Maximum price'] },
};
export const Disabled: Story = { args: { disabled: true } };
