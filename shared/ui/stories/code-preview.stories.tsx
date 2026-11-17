import type { Meta, StoryObj } from '@storybook/react-vite';
import { CodePreview } from '../src/code-preview';

const meta = {
  title: 'Content/Code preview',
  component: CodePreview,
  tags: ['autodocs'],
  args: {
    filename: 'hello.ts',
    language: 'TypeScript',
    code: 'export function hello(name: string) {\n  return `Hello, ${name}`;\n}',
  },
} satisfies Meta<typeof CodePreview>;
export default meta;
type Story = StoryObj<typeof meta>;
export const Default: Story = {};
export const LongLine: Story = {
  args: {
    code: 'const message = "This deliberately long line stays intact and scrolls horizontally instead of expanding the surrounding page or losing its formatting.";',
  },
};
export const PlainText: Story = {
  args: {
    filename: 'notes.txt',
    language: undefined,
    code: 'Write a small experiment.\nChange one thing at a time.',
  },
};
