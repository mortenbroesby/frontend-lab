import type { Meta, StoryObj } from '@storybook/react-vite';
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
  SelectGroup,
  SelectLabel,
} from '../src/select';

const meta = {
  title: 'Forms/Select',
  component: Select,
  tags: ['autodocs'],
  args: { defaultValue: 'design', disabled: false },
  render: (args) => (
    <Select {...args}>
      <SelectTrigger aria-label="Track">
        <SelectValue placeholder="Choose a track" />
      </SelectTrigger>
      <SelectContent>
        <SelectGroup>
          <SelectLabel>Tracks</SelectLabel>
          <SelectItem value="design">Design</SelectItem>
          <SelectItem value="quality">Code quality</SelectItem>
          <SelectItem value="future" disabled>
            Coming soon
          </SelectItem>
        </SelectGroup>
      </SelectContent>
    </Select>
  ),
} satisfies Meta<typeof Select>;
export default meta;
type Story = StoryObj<typeof meta>;
export const Default: Story = {};
export const Disabled: Story = { args: { disabled: true } };
