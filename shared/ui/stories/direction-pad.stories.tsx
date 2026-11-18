import type { Meta, StoryObj } from '@storybook/react-vite';
import { fn } from 'storybook/test';
import { DirectionPad } from '../src/direction-pad';

const meta = {
  title: 'Actions/DirectionPad',
  tags: ['autodocs'],
  component: DirectionPad,
  args: { onDirection: fn(), onSelect: fn(), onBack: fn() },
} satisfies Meta<typeof DirectionPad>;
export default meta;
type Story = StoryObj<typeof meta>;
export const Default: Story = {};
export const Horizontal: Story = { args: { horizontal: true, label: 'Focus · Slides' } };
export const Disabled: Story = { args: { disabled: true } };
