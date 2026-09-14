import React, { useEffect, useRef } from 'react';
import { View, Text, StyleSheet, Animated, Easing, SafeAreaView } from 'react-native';
import Svg, { Path, Circle, Defs, LinearGradient, Stop } from 'react-native-svg';
import { theme } from '../../theme';

const VicarLogo = () => {
  return (
    <View style={styles.logoContainer}>
      <Svg width="140" height="140" viewBox="0 0 100 100">
        <Defs>
          <LinearGradient id="pinGrad" x1="0%" y1="0%" x2="0%" y2="100%">
            <Stop offset="0%" stopColor="#3B82F6" />
            <Stop offset="100%" stopColor="#1D4ED8" />
          </LinearGradient>
        </Defs>
        
        {/* Location Pin */}
        <Path 
          d="M50 15 C33 15, 20 28, 20 45 C20 62, 45 88, 48 91 C49 92, 51 92, 52 91 C55 88, 80 62, 80 45 C80 28, 67 15, 50 15 Z" 
          fill="url(#pinGrad)" 
        />
        
        {/* White Car Body */}
        <Path 
          d="M32 54 L36 46 C37 44, 40 42, 43 42 L57 42 C60 42, 63 44, 64 46 L68 54 C70 54, 72 56, 72 59 L72 63 C72 64.5, 71 66, 69.5 66 L67 66 L67 68 C67 69.5, 65.5 71, 64 71 L62 71 C60.5 71, 59 69.5, 59 68 L59 66 L41 66 L41 68 C41 69.5, 39.5 71, 38 71 L36 71 C34.5 71, 33 69.5, 33 68 L33 66 L30.5 66 C29 66, 28 64.5, 28 63 L28 59 C28 56, 30 54, 32 54 Z" 
          fill="#FFFFFF" 
        />
        
        {/* Windshield */}
        <Path d="M38 47 L62 47 L65 53 L35 53 Z" fill="#2563EB" />
        
        {/* Green Live Indicator */}
        <Circle cx="72" cy="25" r="7" fill="#16A34A" stroke="#F8FAFC" strokeWidth="2.5" />
        <Circle cx="72" cy="25" r="2" fill="#FFFFFF" />
      </Svg>
    </View>
  );
};

const SplashScreen = ({ navigation }: any) => {
  // Animation Values
  const logoScale = useRef(new Animated.Value(0.95)).current;
  const logoOpacity = useRef(new Animated.Value(0)).current;
  const textOpacity = useRef(new Animated.Value(0)).current;
  
  const dot1Opacity = useRef(new Animated.Value(0.3)).current;
  const dot2Opacity = useRef(new Animated.Value(0.3)).current;
  const dot3Opacity = useRef(new Animated.Value(0.3)).current;

  useEffect(() => {
    // 1. Logo Animation
    Animated.parallel([
      Animated.timing(logoOpacity, {
        toValue: 1,
        duration: 800,
        useNativeDriver: true,
      }),
      Animated.timing(logoScale, {
        toValue: 1,
        duration: 800,
        easing: Easing.out(Easing.back(1.5)),
        useNativeDriver: true,
      }),
    ]).start(() => {
      // 2. Text Animation after logo
      Animated.timing(textOpacity, {
        toValue: 1,
        duration: 600,
        useNativeDriver: true,
      }).start();
    });

    // 3. Loading Dots Animation Loop
    const animateDots = () => {
      Animated.sequence([
        Animated.timing(dot1Opacity, { toValue: 1, duration: 300, useNativeDriver: true }),
        Animated.parallel([
          Animated.timing(dot1Opacity, { toValue: 0.3, duration: 300, useNativeDriver: true }),
          Animated.timing(dot2Opacity, { toValue: 1, duration: 300, useNativeDriver: true }),
        ]),
        Animated.parallel([
          Animated.timing(dot2Opacity, { toValue: 0.3, duration: 300, useNativeDriver: true }),
          Animated.timing(dot3Opacity, { toValue: 1, duration: 300, useNativeDriver: true }),
        ]),
        Animated.timing(dot3Opacity, { toValue: 0.3, duration: 300, useNativeDriver: true }),
      ]).start(() => animateDots());
    };

    animateDots();

    return () => {};
  }, []);

  return (
    <SafeAreaView style={styles.container}>
      {/* Soft Radial Glow - approximated with a view */}
      <View style={styles.glowBackground} />

      <View style={styles.content}>
        {/* Logo Section */}
        <Animated.View style={{ alignItems: 'center', opacity: logoOpacity, transform: [{ scale: logoScale }] }}>
          <VicarLogo />
          
          {/* Brand Name & Tagline */}
          <Animated.View style={[styles.textContainer, { opacity: textOpacity }]}>
            <Text style={[styles.brandName, { marginLeft: 6 }]}>Vicar</Text>
            <Svg width="40" height="2" style={{ marginTop: 16, marginBottom: 16 }}>
              <Defs>
                <LinearGradient id="lineGrad" x1="0%" y1="0%" x2="100%" y2="0%">
                  <Stop offset="0%" stopColor="#2563EB" />
                  <Stop offset="100%" stopColor="#16A34A" />
                </LinearGradient>
              </Defs>
              <Path d="M0 1 L40 1" stroke="url(#lineGrad)" strokeWidth="2" />
            </Svg>
            <Text style={styles.tagline}>Đặt chuyến nhanh · Chủ động · An tâm</Text>
          </Animated.View>
        </Animated.View>
      </View>

      {/* Loading Section */}
      <View style={styles.loadingContainer}>
        <View style={styles.dotsWrapper}>
          <Animated.View style={[styles.dot, { opacity: dot1Opacity }]} />
          <Animated.View style={[styles.dot, styles.middleDot, { opacity: dot2Opacity }]} />
          <Animated.View style={[styles.dot, { opacity: dot3Opacity }]} />
        </View>
        <Text style={styles.loadingText}>Đang khởi động...</Text>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.colors.background,
    alignItems: 'center',
    justifyContent: 'center',
  },
  glowBackground: {
    position: 'absolute',
    width: '150%',
    aspectRatio: 1,
    borderRadius: 999,
    backgroundColor: 'rgba(37, 99, 235, 0.05)',
    top: '-20%',
  },
  content: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 40, // offset slightly to push it "slightly above the middle" as requested
  },
  logoContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    width: 140,
    height: 140,
  },
  textContainer: {
    alignItems: 'center',
    marginTop: 20,
  },
  brandName: {
    fontFamily: theme.typography.fontFamily,
    fontSize: 34,
    fontWeight: '800',
    color: '#0F172A',
    letterSpacing: 6,
  },
  tagline: {
    fontFamily: theme.typography.fontFamily,
    fontSize: 13,
    fontWeight: '400',
    color: theme.colors.textSecondary, // #64748B
    marginTop: 8,
  },
  loadingContainer: {
    position: 'absolute',
    bottom: 60,
    alignItems: 'center',
  },
  dotsWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 12,
  },
  dot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#2563EB',
    marginHorizontal: 4,
  },
  middleDot: {
    width: 20,
  },
  loadingText: {
    fontFamily: theme.typography.fontFamily,
    fontSize: 12,
    color: '#94A3B8',
  },
});

export default SplashScreen;
