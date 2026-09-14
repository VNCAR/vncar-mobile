import { Platform } from 'react-native';

const fontFamily = Platform.select({
  ios: 'System', // SF Pro on iOS
  android: 'sans-serif', // Default Roboto/Inter on Android
  default: 'sans-serif',
});

export const typography = {
  fontFamily,
  
  // Typography hierarchy
  screenTitle: {
    fontSize: 24,
    fontWeight: '600' as const, // semibold
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600' as const,
  },
  cardTitle: {
    fontSize: 16,
    fontWeight: '600' as const,
  },
  body: {
    fontSize: 15, // 14-16px range
    fontWeight: '400' as const, // regular
  },
  caption: {
    fontSize: 12, // 12-13px range
    fontWeight: '400' as const,
  },
  buttonText: {
    fontSize: 16, // 15-16px range
    fontWeight: '600' as const,
  },
};
