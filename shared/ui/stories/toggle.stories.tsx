import type { Meta, StoryObj } from '@storybook/react-vite';
import { Toggle } from '../src/toggle';

const meta = {
  title: 'Actions/Toggle',
  component: Toggle,
  tags: ['autodocs'],
  args: { children: 'Bold', 'aria-label': 'Toggle bold', variant: 'outline', disabled: false },
} satisfies Meta<typeof Toggle>;
export default meta;
type Story = StoryObj<typeof meta>;
export const Default: Story = {};
export const Pressed: Story = { args: { defaultPressed: true } };
export const Disabled: Story = { args: { disabled: true } };
