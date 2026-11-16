import type { Meta, StoryObj } from '@storybook/react-vite';
import { Progress } from '../src/progress';

const meta = {
  title: 'Feedback/Progress',
  component: Progress,
  tags: ['autodocs'],
  args: { value: 40, max: 100, 'aria-label': 'Upload progress' },
} satisfies Meta<typeof Progress>;
export default meta;
type Story = StoryObj<typeof meta>;
export const Default: Story = {};
export const Indeterminate: Story = { args: { value: null } };
export const CustomMaximum: Story = { args: { value: 5, max: 20 } };
