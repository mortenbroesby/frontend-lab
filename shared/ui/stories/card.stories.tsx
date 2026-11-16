import type { Meta, StoryObj } from '@storybook/react-vite';
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from '../src/card';
import { Button } from '../src/button';

const meta = {
  title: 'Content/Card',
  component: Card,
  tags: ['autodocs'],
  render: (args) => (
    <Card {...args}>
      <CardHeader>
        <CardTitle>Constellation</CardTitle>
        <CardDescription>A small visualization experiment.</CardDescription>
      </CardHeader>
      <CardContent>Explore the connections between ideas.</CardContent>
      <CardFooter>
        <Button>Open demo</Button>
      </CardFooter>
    </Card>
  ),
} satisfies Meta<typeof Card>;
export default meta;
type Story = StoryObj<typeof meta>;
export const Default: Story = {};
