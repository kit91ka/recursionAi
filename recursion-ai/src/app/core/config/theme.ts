import { definePreset } from '@primeuix/themes';
import Aura from '@primeuix/themes/aura';

export const ZidiumPreset = definePreset(Aura, {
  primitive: {
    red: {
      500: '#a9120a',
    },
  },
  semantic: {
    primary: {
      50: '#e6eff7',
      100: '#b3d0e9',
      200: '#80b1db',
      300: '#4d92cd',
      400: '#1a73bf',
      500: '#005baa',
      600: '#004e91',
      700: '#004078',
      800: '#00335f',
      900: '#002646',
      950: '#00192d',
    },
    colorScheme: {
      light: {
        primary: {
          color: '{primary.500}',
          contrastColor: '#ffffff',
          hoverColor: '{primary.600}',
          activeColor: '{primary.700}',
        },
        formField: {
          borderRadius: '8px',
        },
        content: {
          borderRadius: '10px',
        },
        surface: {
          0: '#ffffff',
          50: '#f9fafc',
          100: '#f4f4f5',
        },
        datatable: {
          headerBackground: '#f9fafc',
          headerCellPadding: '0.75rem 1rem',
          bodyCellPadding: '0.75rem 1rem',
          borderColor: '#dee2e6',
          rowStripedBackground: '#f9fafc',
        },
      },
    },
  },
});
