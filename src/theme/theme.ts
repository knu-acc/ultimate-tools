'use client';

import { createTheme, alpha } from '@mui/material/styles';
import type { Theme } from '@mui/material/styles';
import { outlinedInputClasses } from '@mui/material/OutlinedInput';
import { switchClasses } from '@mui/material/Switch';
import { accordionClasses } from '@mui/material/Accordion';

// MD3 Motion tokens
const md3Motion = {
  easing: {
    standard: 'cubic-bezier(0.2, 0, 0, 1)',
    standardDecelerate: 'cubic-bezier(0, 0, 0, 1)',
    standardAccelerate: 'cubic-bezier(0.3, 0, 1, 1)',
    emphasized: 'cubic-bezier(0.2, 0, 0, 1)',
    emphasizedDecelerate: 'cubic-bezier(0.05, 0.7, 0.1, 1)',
    emphasizedAccelerate: 'cubic-bezier(0.3, 0, 0.8, 0.15)',
  },
  duration: {
    short1: '50ms',
    short2: '100ms',
    short3: '150ms',
    short4: '200ms',
    medium1: '250ms',
    medium2: '300ms',
    medium3: '350ms',
    medium4: '400ms',
    long1: '450ms',
    long2: '500ms',
  },
};

// Shape scale — 2 sizes: small (10px) and large (18px)
const md3Shape = {
  none: 0,
  extraSmall: 10,
  small: 10,
  medium: 18,
  large: 18,
  extraLarge: 18,
  full: 999,
};

// MD3 Elevation (tonal + shadow)
const md3Elevation = {
  level0: 'none',
  level1: '0px 1px 2px rgba(0,0,0,0.3), 0px 1px 3px 1px rgba(0,0,0,0.15)',
  level2: '0px 1px 2px rgba(0,0,0,0.3), 0px 2px 6px 2px rgba(0,0,0,0.15)',
  level3: '0px 4px 8px 3px rgba(0,0,0,0.15), 0px 1px 3px rgba(0,0,0,0.3)',
  level4: '0px 6px 10px 4px rgba(0,0,0,0.15), 0px 2px 3px rgba(0,0,0,0.3)',
  level5: '0px 8px 12px 6px rgba(0,0,0,0.15), 0px 4px 4px rgba(0,0,0,0.3)',
};

// ----- MUI module augmentation for MD3 -----
declare module '@mui/material/styles' {
  interface Palette {
    surfaceContainerLowest: string;
    surfaceContainerLow: string;
    surfaceContainer: string;
    surfaceContainerHigh: string;
    surfaceContainerHighest: string;
    surfaceVariant: string;
    onSurfaceVariant: string;
    primaryContainer: string;
    onPrimaryContainer: string;
    secondaryContainer: string;
    onSecondaryContainer: string;
    tertiary?: string;
    onTertiary?: string;
    tertiaryContainer?: string;
    onTertiaryContainer?: string;
    outline?: string;
    outlineVariant?: string;
  }
  interface PaletteOptions {
    surfaceContainerLowest?: string;
    surfaceContainerLow?: string;
    surfaceContainer?: string;
    surfaceContainerHigh?: string;
    surfaceContainerHighest?: string;
    surfaceVariant?: string;
    onSurfaceVariant?: string;
    primaryContainer?: string;
    onPrimaryContainer?: string;
    secondaryContainer?: string;
    onSecondaryContainer?: string;
    tertiary?: string;
    onTertiary?: string;
    tertiaryContainer?: string;
    onTertiaryContainer?: string;
    outline?: string;
    outlineVariant?: string;
  }
  interface Shape {
    borderRadius: number;
    extraSmall?: number;
    small?: number;
    medium?: number;
    large?: number;
    extraLarge?: number;
    full?: number;
  }
  interface Theme {
    md3: { shape: typeof md3Shape; motion: typeof md3Motion; elevation: typeof md3Elevation };
  }
  interface ThemeOptions {
    md3?: { shape: typeof md3Shape; motion: typeof md3Motion; elevation: typeof md3Elevation };
  }
  interface TypographyVariants {
    fontFamilyMono: string;
  }
  interface TypographyVariantsOptions {
    fontFamilyMono?: string;
  }
}

const commonComponents = {
  MuiCssBaseline: {
    styleOverrides: {
      body: {
        transitionProperty: 'background-color, color',
        transitionDuration: md3Motion.duration.medium2,
        transitionTimingFunction: md3Motion.easing.standard,
      },
    },
  },
  // MD3: focus-visible handled via globals.css :focus-visible rules
  MuiButton: {
    defaultProps: { disableElevation: true },
    styleOverrides: {
      root: {
        borderRadius: md3Shape.full,
        padding: '10px 24px',
        fontSize: '0.875rem',
        fontWeight: 500,
        letterSpacing: '0.1px',
        lineHeight: '20px',
        minHeight: 40,
        // MD3: animate only specific properties, never 'all'
        transitionProperty: 'background-color, box-shadow, color',
        transitionDuration: md3Motion.duration.short4,
        transitionTimingFunction: md3Motion.easing.standard,
      },
      contained: {
        '&:hover': {
          boxShadow: md3Elevation.level1,
        },
      },
      outlined: {
        borderWidth: 1,
        '&:hover': { borderWidth: 1 },
      },
      sizeSmall: {
        padding: '6px 16px',
        fontSize: '0.8125rem',
        minHeight: 32,
      },
      sizeLarge: {
        padding: '12px 32px',
        fontSize: '0.9375rem',
        minHeight: 48,
      },
    },
  },
  MuiFab: {
    styleOverrides: {
      root: {
        borderRadius: md3Shape.large,
        boxShadow: md3Elevation.level3,
        textTransform: 'none' as const,
        '&:hover': { boxShadow: md3Elevation.level4 },
      },
    },
  },
  MuiCard: {
    styleOverrides: {
      root: {
        borderRadius: md3Shape.large,
        // MD3: animate only specific properties, never 'all'
        transitionProperty: 'background-color, box-shadow',
        transitionDuration: md3Motion.duration.medium1,
        transitionTimingFunction: md3Motion.easing.standard,
      },
    },
  },
  MuiChip: {
    styleOverrides: {
      root: {
        borderRadius: md3Shape.small,
        fontWeight: 500,
        letterSpacing: '0.1px',
        // MD3: animate only specific properties, never 'all'
        transitionProperty: 'background-color, color, border-color',
        transitionDuration: md3Motion.duration.short4,
        transitionTimingFunction: md3Motion.easing.standard,
      },
      // MD3 Chip spec: height = 32dp. Touch target handled via padding, not height inflation.
      sizeMedium: {
        height: 32,
        '& .MuiChip-label': {
          paddingLeft: 12,
          paddingRight: 12,
        },
      },
      sizeSmall: {
        height: 32,
        '& .MuiChip-label': {
          paddingLeft: 10,
          paddingRight: 10,
          fontSize: '0.8125rem',
        },
        '& .MuiChip-icon': {
          fontSize: '1rem',
          marginLeft: 6,
        },
        '& .MuiChip-deleteIcon': {
          fontSize: '1rem',
          marginRight: 6,
        },
      },
    },
  },
  MuiTextField: {
    styleOverrides: {
      root: {
        '& .MuiOutlinedInput-root': {
          borderRadius: md3Shape.extraSmall,
          // MD3: border stays 1px on hover, only color changes; 2px only on focus
          '& fieldset': { borderWidth: 1 },
          '&:hover fieldset': { borderWidth: 1 },
          [`&.${outlinedInputClasses.focused} fieldset`]: { borderWidth: 2 },
        },
        '& .MuiFilledInput-root': {
          borderRadius: `${md3Shape.extraSmall}px ${md3Shape.extraSmall}px 0 0`,
        },
      },
    },
  },
  MuiPaper: {
    styleOverrides: {
      root: {
        borderRadius: md3Shape.medium,
        backgroundImage: 'none',
      },
      elevation0: {
        boxShadow: 'none',
        border: 'none',
      },
      // MD3 Tonal Elevation: primary color overlay at increasing opacity levels
      // Uses backgroundImage gradient (same technique MUI uses for dark mode elevation)
      elevation1: ({ theme }: { theme: Theme }) => ({
        boxShadow: md3Elevation.level1,
        backgroundImage: `linear-gradient(${alpha(theme.palette.primary.main, 0.05)}, ${alpha(theme.palette.primary.main, 0.05)})`,
      }),
      elevation2: ({ theme }: { theme: Theme }) => ({
        boxShadow: md3Elevation.level2,
        backgroundImage: `linear-gradient(${alpha(theme.palette.primary.main, 0.08)}, ${alpha(theme.palette.primary.main, 0.08)})`,
      }),
      elevation3: ({ theme }: { theme: Theme }) => ({
        boxShadow: md3Elevation.level3,
        backgroundImage: `linear-gradient(${alpha(theme.palette.primary.main, 0.11)}, ${alpha(theme.palette.primary.main, 0.11)})`,
      }),
      elevation4: ({ theme }: { theme: Theme }) => ({
        boxShadow: md3Elevation.level4,
        backgroundImage: `linear-gradient(${alpha(theme.palette.primary.main, 0.12)}, ${alpha(theme.palette.primary.main, 0.12)})`,
      }),
      elevation5: ({ theme }: { theme: Theme }) => ({
        boxShadow: md3Elevation.level5,
        backgroundImage: `linear-gradient(${alpha(theme.palette.primary.main, 0.14)}, ${alpha(theme.palette.primary.main, 0.14)})`,
      }),
    },
  },
  MuiAppBar: {
    styleOverrides: {
      root: {
        boxShadow: 'none',
      },
    },
  },
  MuiDrawer: {
    styleOverrides: {
      paper: {
        borderRadius: `0 ${md3Shape.large}px ${md3Shape.large}px 0`,
      },
    },
  },
  MuiDialog: {
    styleOverrides: {
      paper: {
        borderRadius: md3Shape.extraLarge,
      },
    },
  },
  MuiTooltip: {
    styleOverrides: {
      tooltip: {
        borderRadius: md3Shape.extraSmall,
        fontSize: '0.75rem',
        fontWeight: 500,
        letterSpacing: '0.4px',
      },
    },
  },
  MuiSwitch: {
    styleOverrides: {
      root: { padding: 8 },
      switchBase: {
        padding: 11,
        [`&.${switchClasses.checked}`]: {
          [`& + .${switchClasses.track}`]: { opacity: 1 },
        },
      },
      track: {
        borderRadius: md3Shape.full,
        opacity: 1,
      },
      thumb: {
        width: 16,
        height: 16,
        boxShadow: 'none',
      },
    },
  },
  MuiLinearProgress: {
    styleOverrides: {
      root: {
        borderRadius: md3Shape.full,
        height: 4,
      },
    },
  },
  MuiTabs: {
    styleOverrides: {
      indicator: {
        borderRadius: `${md3Shape.extraSmall}px ${md3Shape.extraSmall}px 0 0`,
        height: 3,
      },
    },
  },
  MuiTab: {
    styleOverrides: {
      root: {
        textTransform: 'none' as const,
        fontWeight: 500,
        letterSpacing: '0.1px',
        minHeight: 48,
      },
    },
  },
  MuiSlider: {
    styleOverrides: {
      root: { height: 4 },
      thumb: {
        width: 20,
        height: 20,
        '&:before': { boxShadow: 'none' },
        '&:hover, &.Mui-focusVisible': (props: { theme: Theme }) => ({
          boxShadow: `0 0 0 8px ${props.theme.palette.action.focus}`,
        }),
      },
      track: { borderRadius: 2 },
      rail: { borderRadius: 2, opacity: 0.3 },
    },
  },
  MuiAlert: {
    styleOverrides: {
      root: { borderRadius: md3Shape.medium },
    },
  },
  MuiSnackbarContent: {
    styleOverrides: {
      root: { borderRadius: md3Shape.extraSmall },
    },
  },
  MuiListItemButton: {
    styleOverrides: {
      root: {
        borderRadius: md3Shape.full,
        transitionProperty: 'background-color',
        transitionDuration: md3Motion.duration.short4,
        transitionTimingFunction: md3Motion.easing.standard,
      },
    },
  },
  MuiIconButton: {
    styleOverrides: {
      root: {
        borderRadius: md3Shape.full,
        minWidth: 48,
        minHeight: 48,
        transitionProperty: 'background-color',
        transitionDuration: md3Motion.duration.short3,
        transitionTimingFunction: md3Motion.easing.standard,
      },
    },
  },
  MuiMenu: {
    styleOverrides: {
      paper: {
        borderRadius: md3Shape.medium,
      },
    },
  },
  MuiPopover: {
    styleOverrides: {
      paper: {
        borderRadius: md3Shape.medium,
      },
    },
  },
  MuiAutocomplete: {
    styleOverrides: {
      paper: {
        borderRadius: md3Shape.medium,
      },
      listbox: {
        padding: '4px 0',
      },
    },
  },
  MuiSelect: {
    styleOverrides: {
      root: {
        borderRadius: md3Shape.extraSmall,
      },
    },
  },
  MuiToggleButton: {
    styleOverrides: {
      root: {
        borderRadius: md3Shape.full,
        textTransform: 'none' as const,
        fontWeight: 500,
        letterSpacing: '0.1px',
      },
    },
  },
  MuiToggleButtonGroup: {
    styleOverrides: {
      root: {
        borderRadius: md3Shape.full,
      },
    },
  },
  MuiAccordion: {
    styleOverrides: {
      root: {
        borderRadius: `${md3Shape.medium}px !important`,
        '&:before': { display: 'none' },
        overflow: 'hidden',
        transitionProperty: 'border-color',
        transitionDuration: md3Motion.duration.short4,
        transitionTimingFunction: md3Motion.easing.standard,
        [`&.${accordionClasses.expanded}`]: {
          margin: '8px 0',
        },
      },
    },
  },
  MuiAccordionSummary: {
    styleOverrides: {
      root: {
        minHeight: 56,
        padding: '0 20px',
        transitionProperty: 'background-color',
        transitionDuration: md3Motion.duration.short4,
        transitionTimingFunction: md3Motion.easing.standard,
        '& .MuiAccordionSummary-content': {
          margin: '16px 0',
        },
        '& .MuiAccordionSummary-expandIconWrapper': {
          transitionProperty: 'transform',
          transitionDuration: md3Motion.duration.medium2,
          transitionTimingFunction: md3Motion.easing.standard,
        },
      },
    },
  },
  MuiAccordionDetails: {
    styleOverrides: {
      root: {
        padding: '0 20px 20px',
      },
    },
  },
  MuiBadge: {
    styleOverrides: {
      badge: {
        borderRadius: md3Shape.full,
      },
    },
  },
  MuiAvatar: {
    styleOverrides: {
      root: {
        borderRadius: md3Shape.full,
      },
    },
  },
  MuiTableContainer: {
    styleOverrides: {
      root: {
        borderRadius: md3Shape.medium,
      },
    },
  },
  MuiInputBase: {
    styleOverrides: {
      root: {
        borderRadius: md3Shape.extraSmall,
      },
    },
  },
};

const typography = {
  fontFamily: '"Roboto", "Noto Sans", -apple-system, BlinkMacSystemFont, sans-serif',
  fontFamilyMono: '"JetBrains Mono", "Fira Code", "Cascadia Code", "Consolas", monospace',
  h1: { fontSize: '3.5rem', fontWeight: 400, lineHeight: 1.12, letterSpacing: '-0.25px' }, // Display Large
  h2: { fontSize: '2.8125rem', fontWeight: 400, lineHeight: 1.15, letterSpacing: '0px' }, // Display Medium
  h3: { fontSize: '2.25rem', fontWeight: 400, lineHeight: 1.22, letterSpacing: '0px' }, // Display Small
  h4: { fontSize: '2rem', fontWeight: 400, lineHeight: 1.25, letterSpacing: '0px' }, // Headline Large
  h5: { fontSize: '1.75rem', fontWeight: 400, lineHeight: 1.29, letterSpacing: '0px' }, // Headline Medium
  h6: { fontSize: '1.375rem', fontWeight: 400, lineHeight: 1.27, letterSpacing: '0px' }, // Title Large
  subtitle1: { fontSize: '1rem', fontWeight: 500, lineHeight: 1.5, letterSpacing: '0.15px' }, // Title Medium
  subtitle2: { fontSize: '0.875rem', fontWeight: 500, lineHeight: 1.43, letterSpacing: '0.1px' }, // Title Small
  body1: { fontSize: '1rem', fontWeight: 400, lineHeight: 1.5, letterSpacing: '0.5px' }, // Body Large
  body2: { fontSize: '0.875rem', fontWeight: 400, lineHeight: 1.43, letterSpacing: '0.25px' }, // Body Medium
  button: { textTransform: 'none' as const, fontWeight: 500, fontSize: '0.875rem', letterSpacing: '0.1px' }, // Label Large
  caption: { fontSize: '0.75rem', fontWeight: 500, lineHeight: 1.33, letterSpacing: '0.5px' }, // Label Medium
  overline: { fontSize: '0.6875rem', fontWeight: 500, lineHeight: 1.45, letterSpacing: '0.5px', textTransform: 'uppercase' as const }, // Label Small
};

const baseLightTheme = createTheme({
  typography,
  shape: {
    borderRadius: 1, // multiplier=1: sx `borderRadius: N` = N px directly
    ...md3Shape,
  },
  shadows: [
    md3Elevation.level0,
    md3Elevation.level1,
    md3Elevation.level2,
    md3Elevation.level3,
    md3Elevation.level4,
    md3Elevation.level5,
    md3Elevation.level5,
    md3Elevation.level5,
    md3Elevation.level5,
    md3Elevation.level5,
    md3Elevation.level5,
    md3Elevation.level5,
    md3Elevation.level5,
    md3Elevation.level5,
    md3Elevation.level5,
    md3Elevation.level5,
    md3Elevation.level5,
    md3Elevation.level5,
    md3Elevation.level5,
    md3Elevation.level5,
    md3Elevation.level5,
    md3Elevation.level5,
    md3Elevation.level5,
    md3Elevation.level5,
    md3Elevation.level5,
  ] as Theme['shadows'],
  components: commonComponents as any,
  palette: {
    mode: 'light',
    primary: {
      main: '#6750A4',
      light: '#EADDFF',
      dark: '#4F378B',
      contrastText: '#FFFFFF',
    },
    secondary: {
      main: '#625B71',
      light: '#E8DEF8',
      dark: '#4A4458',
      contrastText: '#FFFFFF',
    },
    error: {
      main: '#B3261E',
      light: '#F9DEDC',
      dark: '#8C1D18',
      contrastText: '#FFFFFF',
    },
    warning: { main: '#7D5700', light: '#FFDDB3', dark: '#5C4200' },
    info: { main: '#0061A4', light: '#D1E4FF', dark: '#001D36' },
    success: { main: '#386A20', light: '#C4EFAA', dark: '#1F4100' },
    background: {
      default: '#FEF7FF',
      paper: '#FFFBFE',
    },
    text: {
      primary: '#1D1B20',
      secondary: '#49454F',
    },
    divider: 'rgba(29, 27, 32, 0.12)',
    action: {
      hover: 'rgba(103, 80, 164, 0.08)',
      selected: 'rgba(103, 80, 164, 0.12)',
      focus: 'rgba(103, 80, 164, 0.12)',
      disabled: 'rgba(29, 27, 32, 0.12)',
      disabledBackground: 'rgba(29, 27, 32, 0.12)',
    },
    // MD3 surface color extensions
    surfaceContainerLowest: '#FFFFFF',
    surfaceContainerLow: '#F7F2FA',
    surfaceContainer: '#F3EDF7',
    surfaceContainerHigh: '#ECE6F0',
    surfaceContainerHighest: '#E6E0E9',
    surfaceVariant: '#E7E0EC',
    onSurfaceVariant: '#49454F',
    primaryContainer: '#EADDFF',
    onPrimaryContainer: '#21005D',
    secondaryContainer: '#E8DEF8',
    onSecondaryContainer: '#1D192B',
    tertiary: '#7D5260',
    onTertiary: '#FFFFFF',
    tertiaryContainer: '#FFD8E4',
    onTertiaryContainer: '#31111D',
    outline: '#79747E',
    outlineVariant: '#E7E0EC',
  },
});

export const lightTheme = {
  ...baseLightTheme,
  md3: { shape: md3Shape, motion: md3Motion, elevation: md3Elevation },
} as typeof baseLightTheme;

const baseDarkTheme = createTheme({
  typography,
  shape: {
    borderRadius: 1, // multiplier=1: sx `borderRadius: N` = N px directly
    ...md3Shape,
  },
  shadows: [
    md3Elevation.level0,
    md3Elevation.level1,
    md3Elevation.level2,
    md3Elevation.level3,
    md3Elevation.level4,
    md3Elevation.level5,
    md3Elevation.level5,
    md3Elevation.level5,
    md3Elevation.level5,
    md3Elevation.level5,
    md3Elevation.level5,
    md3Elevation.level5,
    md3Elevation.level5,
    md3Elevation.level5,
    md3Elevation.level5,
    md3Elevation.level5,
    md3Elevation.level5,
    md3Elevation.level5,
    md3Elevation.level5,
    md3Elevation.level5,
    md3Elevation.level5,
    md3Elevation.level5,
    md3Elevation.level5,
    md3Elevation.level5,
    md3Elevation.level5,
  ] as Theme['shadows'],
  components: commonComponents as any,
  palette: {
    mode: 'dark',
    primary: {
      main: '#D0BCFF',
      light: '#EADDFF',
      dark: '#6750A4',
      contrastText: '#381E72',
    },
    secondary: {
      main: '#CCC2DC',
      light: '#E8DEF8',
      dark: '#625B71',
      contrastText: '#332D41',
    },
    error: {
      main: '#F2B8B5',
      light: '#F9DEDC',
      dark: '#B3261E',
      contrastText: '#601410',
    },
    warning: { main: '#FFB951', light: '#FFDDB3', dark: '#4A3800' },
    info: { main: '#A0CAFD', light: '#D1E4FF', dark: '#003258' },
    success: { main: '#A8D18D', light: '#C4EFAA', dark: '#0F3900' },
    background: {
      default: '#141218',
      paper: '#211F26',
    },
    text: {
      primary: '#E6E0E9',
      secondary: '#CAC4D0',
    },
    divider: 'rgba(230, 224, 233, 0.12)',
    action: {
      hover: 'rgba(208, 188, 255, 0.08)',
      selected: 'rgba(208, 188, 255, 0.12)',
      focus: 'rgba(208, 188, 255, 0.12)',
      disabled: 'rgba(230, 224, 233, 0.12)',
      disabledBackground: 'rgba(230, 224, 233, 0.12)',
    },
    // MD3 surface color extensions
    surfaceContainerLowest: '#0F0D13',
    surfaceContainerLow: '#1D1B20',
    surfaceContainer: '#211F26',
    surfaceContainerHigh: '#2B2930',
    surfaceContainerHighest: '#36343B',
    surfaceVariant: '#49454F',
    onSurfaceVariant: '#CAC4D0',
    primaryContainer: '#4F378B',
    onPrimaryContainer: '#EADDFF',
    secondaryContainer: '#4A4458',
    onSecondaryContainer: '#E8DEF8',
    tertiary: '#EFB8C8',
    onTertiary: '#492532',
    tertiaryContainer: '#633B48',
    onTertiaryContainer: '#FFD8E4',
    outline: '#938F99',
    outlineVariant: '#49454F',
  },
});

export const darkTheme = {
  ...baseDarkTheme,
  md3: { shape: md3Shape, motion: md3Motion, elevation: md3Elevation },
} as typeof baseDarkTheme;

export { md3Shape, md3Motion, md3Elevation };
