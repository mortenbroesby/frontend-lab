import type { Meta, StoryObj } from '@storybook/react-vite';
import { Avatar, AvatarFallback, AvatarImage, AvatarGroup, AvatarGroupCount } from '../src/avatar';

const meta = {
  title: 'Content/Avatar',
  component: Avatar,
  tags: ['autodocs'],
  args: { size: 'default' },
  argTypes: { size: { control: 'select', options: ['default', 'sm', 'lg'] } },
  render: (args) => (
    <Avatar {...args}>
      <AvatarFallback aria-label="Alex Morgan">AM</AvatarFallback>
    </Avatar>
  ),
} satisfies Meta<typeof Avatar>;
export default meta;
type Story = StoryObj<typeof meta>;
export const Default: Story = {};
export const BrokenImage: Story = {
  render: (args) => (
    <Avatar {...args}>
      <AvatarImage src="data:image/png;base64,invalid" alt="Alex Morgan" />
      <AvatarFallback>AM</AvatarFallback>
    </Avatar>
  ),
};
export const Group: Story = {
  render: () => (
    <AvatarGroup>
      <Avatar>
        <AvatarFallback aria-label="Alex Morgan">AM</AvatarFallback>
      </Avatar>
      <Avatar>
        <AvatarFallback aria-label="Sam Lee">SL</AvatarFallback>
      </Avatar>
      <AvatarGroupCount aria-label="Three more participants">+3</AvatarGroupCount>
    </AvatarGroup>
  ),
};
