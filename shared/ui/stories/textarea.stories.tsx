import type { Meta, StoryObj } from '@storybook/react-vite';
import { Label } from '../src/label';
import { Textarea } from '../src/textarea';

const meta = {
  title: 'Forms/Textarea',
  component: Textarea,
  tags: ['autodocs'],
  args: {
    'aria-label': 'Project description',
    placeholder: 'Describe your idea',
    disabled: false,
    rows: 4,
    maxLength: 280,
  },
} satisfies Meta<typeof Textarea>;
export default meta;
type Story = StoryObj<typeof meta>;
export const Default: Story = {};
export const Disabled: Story = { args: { disabled: true } };
export const Invalid: Story = {
  args: {
    'aria-invalid': true,
    'aria-describedby': 'description-error',
    id: 'description-invalid',
  },
  render: (args) => (
    <div className="space-y-2">
      <Label htmlFor="description-invalid">Project description</Label>
      <Textarea {...args} />
      <p id="description-error" className="text-sm text-destructive">
        Enter a description before continuing.
      </p>
    </div>
  ),
};
