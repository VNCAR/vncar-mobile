import React, { useState, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  SafeAreaView,
  KeyboardAvoidingView,
  Platform,
  TouchableWithoutFeedback,
  Keyboard,
  Alert,
  ActivityIndicator,
} from 'react-native';
import Svg, { Path, Circle, Defs, LinearGradient, Stop } from 'react-native-svg';
import { theme } from '../../theme';

// --- SVGs ---

const BackIcon = () => (
  <Svg width="20" height="20" viewBox="0 0 24 24" fill="none">
    <Path
      d="M15 18L9 12L15 6"
      stroke="#0F172A"
      strokeWidth="2.5"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </Svg>
);

const AppIcon = () => (
  <View style={styles.appIconContainer}>
    <Svg width="80" height="80" viewBox="0 0 100 100">
      <Defs>
        <LinearGradient id="smallPinGrad" x1="0%" y1="0%" x2="0%" y2="100%">
          <Stop offset="0%" stopColor="#3B82F6" />
          <Stop offset="100%" stopColor="#1D4ED8" />
        </LinearGradient>
      </Defs>
      <Path 
        d="M50 15 C33 15, 20 28, 20 45 C20 62, 45 88, 48 91 C49 92, 51 92, 52 91 C55 88, 80 62, 80 45 C80 28, 67 15, 50 15 Z" 
        fill="url(#smallPinGrad)" 
      />
      <Path 
        d="M32 54 L36 46 C37 44, 40 42, 43 42 L57 42 C60 42, 63 44, 64 46 L68 54 C70 54, 72 56, 72 59 L72 63 C72 64.5, 71 66, 69.5 66 L67 66 L67 68 C67 69.5, 65.5 71, 64 71 L62 71 C60.5 71, 59 69.5, 59 68 L59 66 L41 66 L41 68 C41 69.5, 39.5 71, 38 71 L36 71 C34.5 71, 33 69.5, 33 68 L33 66 L30.5 66 C29 66, 28 64.5, 28 63 L28 59 C28 56, 30 54, 32 54 Z" 
        fill="#FFFFFF" 
      />
      <Path d="M38 47 L62 47 L65 53 L35 53 Z" fill="#2563EB" />
      <Circle cx="72" cy="25" r="7" fill="#16A34A" stroke="#F8FAFC" strokeWidth="2.5" />
      <Circle cx="72" cy="25" r="2" fill="#FFFFFF" />
    </Svg>
  </View>
);

// --- Component ---

const OTPVerificationScreen = ({ route, navigation }: any) => {
  const { confirmation, phoneNumber } = route.params || {};
  const [otp, setOtp] = useState(['', '', '', '', '', '']);
  const [isLoading, setIsLoading] = useState(false);
  const inputRefs = useRef<Array<TextInput | null>>([]);

  const handleOtpChange = (text: string, index: number) => {
    const newOtp = [...otp];
    newOtp[index] = text;
    setOtp(newOtp);

    // Auto focus next input
    if (text && index < 5) {
      inputRefs.current[index + 1]?.focus();
    }
  };

  const handleKeyPress = (e: any, index: number) => {
    // Handle backspace to focus previous input
    if (e.nativeEvent.key === 'Backspace' && !otp[index] && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }
  };

  const isOtpComplete = otp.every((digit) => digit.length === 1);

  const verifyOTP = async () => {
    if (!isOtpComplete || !confirmation) return;
    try {
      setIsLoading(true);
      const code = otp.join('');
      await confirmation.confirm(code);
      // Firebase auth state change listener in App.tsx handles the navigation automatically
    } catch (error: any) {
      console.error('Invalid OTP', error);
      Alert.alert('Lỗi', 'Mã OTP không hợp lệ hoặc đã hết hạn');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <KeyboardAvoidingView 
        style={styles.keyboardView} 
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      >
        <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
          <View style={styles.innerContainer}>
            
            {/* Header: Back Button */}
            <View style={styles.header}>
              <TouchableOpacity 
                style={styles.backButton}
                onPress={() => navigation?.goBack()}
              >
                <BackIcon />
              </TouchableOpacity>
            </View>

            {/* Center Wrapper */}
            <View style={styles.centerWrapper}>
              {/* Logo & Titles */}
              <View style={styles.titleSection}>
                <AppIcon />
              <Text style={styles.title}>Xác nhận số điện thoại</Text>
              <Text style={styles.description}>Nhập mã OTP đã được gửi tới</Text>
              <Text style={styles.phoneNumber}>{phoneNumber || '+84 912 *** 123'}</Text>
            </View>

            {/* Form Section */}
            <View style={styles.formSection}>
              {/* OTP Inputs */}
              <View style={styles.otpContainer}>
                {otp.map((digit, index) => (
                  <TextInput
                    key={index}
                    ref={(ref) => (inputRefs.current[index] = ref)}
                    style={[
                      styles.otpBox,
                      digit ? styles.otpBoxFilled : {},
                      index === 0 && !digit && !otp.some(v => v) ? styles.otpBoxActive : {} // Initial state focus on first box
                    ]}
                    value={digit}
                    onChangeText={(text) => handleOtpChange(text, index)}
                    onKeyPress={(e) => handleKeyPress(e, index)}
                    keyboardType="number-pad"
                    maxLength={1}
                    autoFocus={index === 0}
                    editable={!isLoading}
                  />
                ))}
              </View>

              {/* Resend Timer */}
              <View style={styles.resendContainer}>
                <Text style={styles.resendText}>
                  Gửi lại mã sau <Text style={styles.resendTimer}>22</Text> giây
                </Text>
              </View>

              {/* Confirm Button */}
              <TouchableOpacity 
                style={[
                  styles.primaryButton,
                  (!isOtpComplete || isLoading) && styles.primaryButtonDisabled
                ]}
                disabled={!isOtpComplete || isLoading}
                onPress={verifyOTP}
              >
                {isLoading ? (
                  <ActivityIndicator color="#FFFFFF" />
                ) : (
                  <Text style={styles.primaryButtonText}>Xác nhận</Text>
                )}
              </TouchableOpacity>


            </View>
            </View>

            {/* Footer */}
            <View style={styles.footer}>
              <Text style={styles.footerText}>
                Bằng việc tiếp tục, bạn đồng ý với{' '}
                <Text style={styles.linkText}>Điều khoản sử dụng</Text> và{'\n'}
                <Text style={styles.linkText}>Chính sách bảo mật</Text> của Vicar.
              </Text>
            </View>

          </View>
        </TouchableWithoutFeedback>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F8FAFC',
  },
  keyboardView: {
    flex: 1,
  },
  innerContainer: {
    flex: 1,
  },
  centerWrapper: {
    flex: 1,
    justifyContent: 'center',
  },
  header: {
    marginTop: 16,
    marginBottom: 24,
    paddingHorizontal: 24,
  },
  backButton: {
    width: 34,
    height: 34,
    borderRadius: 10,
    backgroundColor: '#F1F5F9',
    alignItems: 'center',
    justifyContent: 'center',
  },
  titleSection: {
    alignItems: 'center',
    marginBottom: 32,
    paddingHorizontal: 24,
  },
  appIconContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 8,
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
    fontWeight: '400',
    marginBottom: 4,
  },
  phoneNumber: {
    fontFamily: theme.typography.fontFamily,
    fontSize: 14,
    color: '#0F172A',
    fontWeight: '600',
  },
  formSection: {
    alignItems: 'center',
    width: '100%',
    paddingHorizontal: 24,
  },
  otpContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    width: '100%',
    maxWidth: 320,
    gap: 8, // Space between OTP boxes
    marginBottom: 32,
  },
  otpBox: {
    width: 44,
    height: 52,
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#E2E8F0',
    borderRadius: 12,
    fontSize: 22,
    fontWeight: '600',
    color: '#0F172A',
    textAlign: 'center',
  },
  otpBoxFilled: {
    borderColor: '#E2E8F0',
  },
  otpBoxActive: {
    borderColor: '#2563EB',
    shadowColor: '#2563EB',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 2,
  },
  resendContainer: {
    marginBottom: 24,
  },
  resendText: {
    fontFamily: theme.typography.fontFamily,
    fontSize: 13,
    color: '#64748B',
  },
  resendTimer: {
    color: '#0F172A',
    fontWeight: '500',
  },
  primaryButton: {
    width: '100%',
    maxWidth: 286,
    height: 48,
    backgroundColor: '#2563EB',
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 16,
  },
  primaryButtonDisabled: {
    opacity: 0.6,
  },
  primaryButtonText: {
    fontFamily: theme.typography.fontFamily,
    fontSize: 15,
    fontWeight: '600',
    color: '#FFFFFF',
  },
  demoHelperText: {
    fontFamily: theme.typography.fontFamily,
    fontSize: 11,
    color: '#94A3B8',
  },
  demoCode: {
    color: '#3B82F6', // slightly blue
  },
  footer: {
    marginBottom: 16,
    alignItems: 'center',
    paddingHorizontal: 24,
  },
  footerText: {
    fontFamily: theme.typography.fontFamily,
    fontSize: 11,
    color: '#64748B',
    textAlign: 'center',
    lineHeight: 18,
  },
  linkText: {
    color: '#2563EB',
    fontWeight: '500',
  },
});

export default OTPVerificationScreen;
