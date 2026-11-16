import type { Preview } from '@storybook/react-vite';
import './preview.css';

const preview: Preview = {
  tags: ['autodocs'],
  parameters: {
    layout: 'padded',
    controls: { matchers: { color: /(background|color)$/i, date: /Date$/i } },
    options: {
      storySort: { order: ['Actions', 'Forms', 'Content', 'Navigation', 'Overlays', 'Feedback'] },
    },
  },
};

export default preview;
