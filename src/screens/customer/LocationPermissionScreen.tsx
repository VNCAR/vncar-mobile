import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  SafeAreaView,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import Svg, { Path, Circle, Defs, LinearGradient, Stop, G, Rect } from 'react-native-svg';
import { theme } from '../../theme';

// --- SVGs ---



const PinIconWhite = () => (
  <Svg width="18" height="18" viewBox="0 0 24 24" fill="none" style={{ marginRight: 8 }}>
    <Path
      d="M12 2C8.13 2 5 5.13 5 9C5 14.25 12 22 12 22C12 22 19 14.25 19 9C19 5.13 15.87 2 12 2ZM12 11.5C10.62 11.5 9.5 10.38 9.5 9C9.5 7.62 10.62 6.5 12 6.5C13.38 6.5 14.5 7.62 14.5 9C14.5 10.38 13.38 11.5 12 11.5Z"
      fill="#FFFFFF"
    />
  </Svg>
);

const ShieldIcon = () => (
  <Svg width="16" height="16" viewBox="0 0 24 24" fill="none">
    <Path
      d="M12 22C12 22 20 18 20 12V5L12 2L4 5V12C4 18 12 22 12 22Z"
      stroke="#64748B"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <Path
      d="M9 12L11 14L15 10"
      stroke="#64748B"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </Svg>
);

// Map Illustration Components
const MapBackground = () => (
  <Svg width="260" height="260" viewBox="0 0 260 260">
    {/* Pale Blue Circle */}
    <Circle cx="130" cy="130" r="120" fill="#DBEAFE" opacity="0.4" />
    <Circle cx="130" cy="130" r="85" stroke="#BFDBFE" strokeWidth="1" fill="none" opacity="0.6" />
    <Circle cx="130" cy="130" r="45" stroke="#BFDBFE" strokeWidth="1" fill="none" opacity="0.6" />
    
    {/* Grid Lines */}
    <Path d="M130 10 L130 250" stroke="#BFDBFE" strokeWidth="1" strokeDasharray="4 4" opacity="0.6" />
    <Path d="M10 130 L250 130" stroke="#BFDBFE" strokeWidth="1" strokeDasharray="4 4" opacity="0.6" />
    <Path d="M45 45 L215 215" stroke="#BFDBFE" strokeWidth="1" strokeDasharray="4 4" opacity="0.4" />
    <Path d="M45 215 L215 45" stroke="#BFDBFE" strokeWidth="1" strokeDasharray="4 4" opacity="0.4" />
    
    {/* Central Pin Large */}
    <G x="90" y="70">
      <Defs>
        <LinearGradient id="mainPinGrad" x1="0%" y1="0%" x2="0%" y2="100%">
          <Stop offset="0%" stopColor="#3B82F6" />
          <Stop offset="100%" stopColor="#1D4ED8" />
        </LinearGradient>
      </Defs>
      <Path 
        d="M40 10 C20 10, 5 25, 5 45 C5 65, 35 95, 38 98 C39 99, 41 99, 42 98 C45 95, 75 65, 75 45 C75 25, 60 10, 40 10 Z" 
        fill="url(#mainPinGrad)" 
      />
      {/* Car inside Pin */}
      <Path 
        d="M26 42 L29 36 C30 34.5, 32 33, 34 33 L46 33 C48 33, 50 34.5, 51 36 L54 42 C55.5 42, 57 43.5, 57 45 L57 48 C57 49, 56 50, 55 50 L53 50 L53 52 C53 53, 52 54, 51 54 L49.5 54 C48.5 54, 47.5 53, 47.5 52 L47.5 50 L32.5 50 L32.5 52 C32.5 53, 31.5 54, 30.5 54 L29 54 C28 54, 27 53, 27 52 L27 50 L25 50 C24 50, 23 49, 23 48 L23 45 C23 43.5, 24.5 42, 26 42 Z" 
        fill="#FFFFFF" 
      />
      <Path d="M30 37 L50 37 L52.5 41.5 L27.5 41.5 Z" fill="#2563EB" />
    </G>
  </Svg>
);

const MiniCarBadge = ({ distance, style }: { distance: string, style: any }) => (
  <View style={[styles.miniCarBadge, style]}>
    <Svg width="18" height="10" viewBox="0 0 32 18">
      <Path d="M6 8 L8 3 C9 1, 11 0, 14 0 L18 0 C21 0, 23 1, 24 3 L26 8 C29 8, 32 10, 32 13 L32 15 L30 15 L30 17 C30 18, 29 18, 28 18 L26 18 C25 18, 24 18, 24 17 L24 15 L8 15 L8 17 C8 18, 7 18, 6 18 L4 18 C3 18, 2 18, 2 17 L2 15 L0 15 L0 13 C0 10, 3 8, 6 8 Z" fill="#2563EB" />
    </Svg>
    <Text style={styles.miniCarText}>{distance}</Text>
  </View>
);


// --- Component ---

const LocationPermissionScreen = ({ navigation }: any) => {
  const insets = useSafeAreaInsets();

  return (
    <View style={[styles.container, { paddingTop: insets.top, paddingBottom: insets.bottom }]}>
      


      {/* Main Content Wrapper */}
      <View style={styles.content}>
        
        {/* Illustration */}
        <View style={styles.illustrationWrapper}>
          <MapBackground />
          <MiniCarBadge distance="1.4 km" style={{ position: 'absolute', left: 20, bottom: 60 }} />
          <MiniCarBadge distance="0.8 km" style={{ position: 'absolute', right: 30, top: 50 }} />
        </View>

        {/* Text Section */}
        <View style={styles.textSection}>
          <Text style={styles.title}>Cho phép truy cập vị trí</Text>
          <Text style={styles.description}>
            Vicar cần vị trí của bạn để tìm tài xế gần{'\n'}
            nhất và theo dõi chuyến đi theo thời gian{'\n'}
            thực.
          </Text>
        </View>

        {/* Buttons */}
        <View style={styles.actionSection}>
          <TouchableOpacity 
            style={styles.primaryButton}
            onPress={() => navigation.navigate('PassengerHome')}
          >
            <PinIconWhite />
            <Text style={styles.primaryButtonText}>Cho phép vị trí</Text>
          </TouchableOpacity>

          <TouchableOpacity 
            style={styles.secondaryButton}
            onPress={() => console.log('Skip Location')}
          >
            <Text style={styles.secondaryButtonText}>Để sau</Text>
          </TouchableOpacity>
        </View>

      </View>

      {/* Footer */}
      <View style={styles.footer}>
        <View style={styles.shieldContainer}>
          <ShieldIcon />
        </View>
        <Text style={styles.footerText}>
          Vị trí của bạn chỉ được sử dụng để cung cấp dịch vụ và bảo{'\n'}
          vệ chuyến đi.
        </Text>
      </View>

    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F8FAFC',
  },

  content: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 24,
    paddingBottom: 40,
  },
  illustrationWrapper: {
    width: 260,
    height: 260,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 40,
  },
  miniCarBadge: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    paddingHorizontal: 8,
    paddingVertical: 4,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
    borderWidth: 1,
    borderColor: '#F1F5F9',
  },
  miniCarText: {
    fontFamily: theme.typography.fontFamily,
    fontSize: 8,
    fontWeight: '600',
    color: '#64748B',
    marginTop: 2,
  },
  textSection: {
    alignItems: 'center',
    marginBottom: 40,
  },
  title: {
    fontFamily: theme.typography.fontFamily,
    fontSize: 22,
    fontWeight: '700',
    color: '#0F172A',
    marginBottom: 12,
  },
  description: {
    fontFamily: theme.typography.fontFamily,
    fontSize: 14,
    color: '#64748B',
    textAlign: 'center',
    lineHeight: 22,
  },
  actionSection: {
    width: '100%',
    alignItems: 'center',
  },
  primaryButton: {
    flexDirection: 'row',
    width: '100%',
    maxWidth: 286,
    height: 48,
    backgroundColor: '#2563EB',
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 16,
    shadowColor: '#2563EB',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 4,
  },
  primaryButtonText: {
    fontFamily: theme.typography.fontFamily,
    fontSize: 15,
    fontWeight: '600',
    color: '#FFFFFF',
  },
  secondaryButton: {
    paddingVertical: 8,
    paddingHorizontal: 16,
  },
  secondaryButtonText: {
    fontFamily: theme.typography.fontFamily,
    fontSize: 14,
    fontWeight: '500',
    color: '#64748B',
  },
  footer: {
    alignItems: 'center',
    paddingHorizontal: 24,
    paddingBottom: 24,
  },
  shieldContainer: {
    width: 28,
    height: 28,
    borderRadius: 8,
    backgroundColor: '#F1F5F9',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 8,
  },
  footerText: {
    fontFamily: theme.typography.fontFamily,
    fontSize: 11,
    color: '#64748B',
    textAlign: 'center',
    lineHeight: 16,
  },
});

export default LocationPermissionScreen;
