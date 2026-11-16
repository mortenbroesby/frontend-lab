import type { Meta, StoryObj } from '@storybook/react-vite';
import { Accordion, AccordionItem, AccordionTrigger, AccordionContent } from '../src/accordion';

const meta = {
  title: 'Navigation/Accordion',
  component: Accordion,
  tags: ['autodocs'],
  args: { type: 'single', collapsible: true },
  render: (args) => (
    <Accordion {...args}>
      <AccordionItem value="run">
        <AccordionTrigger>How do I run a demo?</AccordionTrigger>
        <AccordionContent>Run its workspace dev command from the repository root.</AccordionContent>
      </AccordionItem>
      <AccordionItem value="share">
        <AccordionTrigger>Can I share it?</AccordionTrigger>
        <AccordionContent>Build and host the standalone app.</AccordionContent>
      </AccordionItem>
      <AccordionItem value="soon" disabled>
        <AccordionTrigger>Coming soon</AccordionTrigger>
        <AccordionContent>Not available yet.</AccordionContent>
      </AccordionItem>
    </Accordion>
  ),
} satisfies Meta<typeof Accordion>;
export default meta;
type Story = StoryObj<typeof meta>;
export const Default: Story = {};
