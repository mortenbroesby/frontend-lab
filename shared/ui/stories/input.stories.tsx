import type { Meta, StoryObj } from '@storybook/react-vite';
import { Input } from '../src/input';

const meta = {
  title: 'Forms/Input',
  component: Input,
  tags: ['autodocs'],
  args: { 'aria-label': 'Project name', placeholder: 'Name your project', disabled: false },
} satisfies Meta<typeof Input>;
export default meta;
type Story = StoryObj<typeof meta>;
export const Default: Story = {};
export const Disabled: Story = { args: { disabled: true } };
export const Invalid: Story = {
  args: { 'aria-invalid': true, 'aria-describedby': 'name-error' },
  render: (args) => (
    <div className="space-y-2">
      <Input {...args} />
      <p id="name-error" className="text-sm text-destructive">
        Enter a name before continuing.
      </p>
    </div>
  ),
};
