import type { Meta, StoryObj } from '@storybook/react-vite';
import {
  Sheet,
  SheetTrigger,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetDescription,
  SheetFooter,
  SheetClose,
} from '../src/sheet';
import { Button } from '../src/button';

const meta = {
  title: 'Overlays/Sheet',
  component: SheetContent,
  tags: ['autodocs'],
  args: { side: 'right' },
  argTypes: { side: { control: 'select', options: ['top', 'right', 'bottom', 'left'] } },
  render: (args) => (
    <Sheet>
      <SheetTrigger asChild>
        <Button>Open sheet</Button>
      </SheetTrigger>
      <SheetContent {...args}>
        <SheetHeader>
          <SheetTitle>Project details</SheetTitle>
          <SheetDescription>
            Inspect this overlay, then press Escape to return focus.
          </SheetDescription>
        </SheetHeader>
        <SheetFooter>
          <SheetClose asChild>
            <Button variant="outline">Done</Button>
          </SheetClose>
        </SheetFooter>
      </SheetContent>
    </Sheet>
  ),
} satisfies Meta<typeof SheetContent>;
export default meta;
type Story = StoryObj<typeof meta>;
export const Default: Story = {};
