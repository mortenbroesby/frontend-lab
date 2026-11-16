import type { Meta, StoryObj } from '@storybook/react-vite';
import { Alert, AlertTitle, AlertDescription } from '../src/alert';

const meta = {
  title: 'Feedback/Alert',
  component: Alert,
  tags: ['autodocs'],
  args: { variant: 'default' },
  render: (args) => (
    <Alert {...args}>
      <AlertTitle>Draft saved</AlertTitle>
      <AlertDescription>Your changes are ready to preview.</AlertDescription>
    </Alert>
  ),
} satisfies Meta<typeof Alert>;
export default meta;
type Story = StoryObj<typeof meta>;
export const Default: Story = {};
export const Error: Story = {
  args: { variant: 'destructive' },
  render: (args) => (
    <Alert {...args}>
      <AlertTitle>Upload failed</AlertTitle>
      <AlertDescription>Try a smaller file.</AlertDescription>
    </Alert>
  ),
};
