import type { Meta, StoryObj } from '@storybook/react-vite';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '../src/tabs';

const meta = {
  title: 'Navigation/Tabs',
  component: Tabs,
  tags: ['autodocs'],
  args: { defaultValue: 'overview', orientation: 'horizontal' },
  render: (args) => (
    <Tabs {...args}>
      <TabsList aria-label="Project details">
        <TabsTrigger value="overview">Overview</TabsTrigger>
        <TabsTrigger value="settings">Settings</TabsTrigger>
        <TabsTrigger value="history" disabled>
          History
        </TabsTrigger>
      </TabsList>
      <TabsContent value="overview">A standalone demo with shared UI.</TabsContent>
      <TabsContent value="settings">Use the controls below to change orientation.</TabsContent>
    </Tabs>
  ),
} satisfies Meta<typeof Tabs>;
export default meta;
type Story = StoryObj<typeof meta>;
export const Default: Story = {};
export const Vertical: Story = { args: { orientation: 'vertical' } };
