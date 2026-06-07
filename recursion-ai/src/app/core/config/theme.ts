import { definePreset } from '@primeuix/themes';
import Aura from '@primeuix/themes/aura';

/**
 * Тема PrimeNG, подогнанная под дизайн-токены Figma (plan.txt, раздел 2).
 * Все стили PrimeNG заданы через систему design-токенов (definePreset),
 * без ручных ::ng-deep-переопределений.
 *
 * Источник по токенам: PrimeNG v20 Theming (Context7 /websites/v20_primeng).
 * - цвета → semantic.colorScheme.light.*
 * - радиусы (scheme-independent) → semantic.formField.borderRadius / semantic.content.borderRadius
 *   (кнопки и инпуты наследуют радиус из form.field)
 * - стили конкретных компонентов → components.<name>.*
 */
export const ZidiumPreset = definePreset(Aura, {
  // Примитив red → danger-оттенок #a9120a (Delete и severity="danger" наследуют его)
  primitive: {
    red: {
      50: '#fbeae9',
      100: '#f4c4c1',
      200: '#e89993',
      300: '#db6e66',
      400: '#c93d33',
      500: '#a9120a',
      600: '#970f08',
      700: '#7e0d07',
      800: '#660a05',
      900: '#4f0804',
      950: '#2e0402',
    },
  },
  semantic: {
    // Палитра primary = #005baa
    primary: {
      50: '#e6eff6',
      100: '#b3cce4',
      200: '#80a9d2',
      300: '#4d86c0',
      400: '#2671b3',
      500: '#005baa',
      600: '#005299',
      700: '#004988',
      800: '#003f77',
      900: '#003566',
      950: '#002244',
    },
    // Радиусы из макета: контролы (кнопки/инпуты) 8px, поверхности (карточки/таблица) 10px
    formField: {
      borderRadius: '8px',
    },
    content: {
      borderRadius: '10px',
    },
    colorScheme: {
      light: {
        primary: {
          color: '#005baa',
          contrastColor: '#ffffff',
          hoverColor: '#004988',
          activeColor: '#003f77',
        },
        formField: {
          borderColor: '#dee2e6',
          placeholderColor: '#dee2e6',
          focusBorderColor: '{primary.color}',
          hoverBorderColor: '{primary.color}',
        },
      },
    },
  },
  components: {
    // Высота всех текстовых инпутов — 40px (распространяется и на p-password,
    // у внутреннего input есть класс .p-inputtext).
    inputtext: {
      css: () => `
        .p-inputtext {
          height: 40px;
        }
      `,
    },
    // Таблица из макета (Figma 476-16480), pixel-perfect:
    //   header cell — высота 40px, padding 12×16; body cell — высота 40px, padding 10×16.
    // Шапка #f9fafc, мягкие разделители, подсветка строки при наведении.
    datatable: {
      columnTitle: {
        fontWeight: '500',
      },
      headerCell: {
        padding: '12px 16px',
      },
      bodyCell: {
        padding: '10px 16px',
      },
      colorScheme: {
        light: {
          headerCell: {
            background: '#f9fafc',
            color: '#263238',
            borderColor: '#e5e7eb',
          },
          bodyCell: {
            borderColor: '#eef0f2',
          },
          row: {
            hoverBackground: '#f9fafc',
          },
        },
      },
      // Pixel-perfect 40px: header = 12+16+12, body = 10+20+10 (padding + line-height контента).
      css: () => `
        .p-datatable-thead > tr > th {
          height: 40px;
          line-height: 16px;
          box-sizing: border-box;
        }
        .p-datatable-tbody > tr > td {
          height: 40px;
          line-height: 16px;
          box-sizing: border-box;
          vertical-align: middle;
        }
      `,
    },
    // Confirm dialog из макета (Figma 476-13733): радиус 12px, внешние отступы
    // 20px 24px 24px 24px. Секции диалога пересобираем под вертикальный ритм,
    // кнопки выравниваем слева (Close — серая secondary, Delete — danger).
    // Скоупим по .p-confirmdialog, чтобы не задеть обычные диалоги (Add/Edit).
    confirmdialog: {
      css: () => `
        .p-confirmdialog {
          border-radius: 12px;
          min-width: 400px;
        }
        .p-confirmdialog .p-dialog-header {
          padding: 20px 24px 0 24px;
        }
        .p-confirmdialog .p-dialog-content {
          padding: 16px 24px 0 24px;
        }
        .p-confirmdialog .p-dialog-footer {
          padding: 24px 24px 24px 24px;
          justify-content: flex-start;
          gap: 12px;
        }
      `,
    },
  },
});
