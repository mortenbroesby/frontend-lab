import type { Meta, StoryObj } from '@storybook/react-vite';
import { ThemeControl } from '../src/theme-control';

const meta = {
  title: 'Actions/Theme control',
  component: ThemeControl,
  parameters: {
    docs: {
      description: {
        component:
          'Applies the selected theme to this preview and remembers it locally. System follows the device preference.',
      },
    },
  },
} satisfies Meta<typeof ThemeControl>;

export default meta;
type Story = StoryObj<typeof meta>;
export const Default: Story = {};
