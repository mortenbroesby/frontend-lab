import type { Meta, StoryObj } from '@storybook/react-vite';
import { Label } from '../src/label';
import { Input } from '../src/input';

const meta = {
  title: 'Forms/Label',
  component: Label,
  tags: ['autodocs'],
  args: { children: 'Project name', htmlFor: 'project-name' },
  render: (args) => (
    <div className="space-y-2">
      <Label {...args} />
      <Input id="project-name" placeholder="My demo" />
    </div>
  ),
} satisfies Meta<typeof Label>;
export default meta;
type Story = StoryObj<typeof meta>;
export const Default: Story = {};
