import type { Meta, StoryObj } from '@storybook/react-vite';
import {
  Table,
  TableHeader,
  TableBody,
  TableRow,
  TableHead,
  TableCell,
  TableCaption,
} from '../src/table';

const meta = {
  title: 'Content/Table',
  component: Table,
  tags: ['autodocs'],
  render: (args) => (
    <Table {...args}>
      <TableCaption>Recent demo drafts</TableCaption>
      <TableHeader>
        <TableRow>
          <TableHead scope="col">Demo</TableHead>
          <TableHead scope="col">Status</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        <TableRow>
          <TableCell>Constellation</TableCell>
          <TableCell>Ready</TableCell>
        </TableRow>
        <TableRow>
          <TableCell>Peer room</TableCell>
          <TableCell>Draft</TableCell>
        </TableRow>
      </TableBody>
    </Table>
  ),
} satisfies Meta<typeof Table>;
export default meta;
type Story = StoryObj<typeof meta>;
export const Default: Story = {};
