import React, { useState, useEffect } from 'react';
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
import auth from '@react-native-firebase/auth';
import { GoogleSignin } from '@react-native-google-signin/google-signin';
import { useAuthStore, UserRole } from '../../store/useAuthStore';

// --- SVGs ---



const AppIcon = () => (
  <View style={styles.appIconContainer}>
    <Svg width="140" height="140" viewBox="0 0 100 100">
      <Defs>
        <LinearGradient id="pinGrad" x1="0%" y1="0%" x2="0%" y2="100%">
          <Stop offset="0%" stopColor="#3B82F6" />
          <Stop offset="100%" stopColor="#1D4ED8" />
        </LinearGradient>
      </Defs>
      <Path 
        d="M50 15 C33 15, 20 28, 20 45 C20 62, 45 88, 48 91 C49 92, 51 92, 52 91 C55 88, 80 62, 80 45 C80 28, 67 15, 50 15 Z" 
        fill="url(#pinGrad)" 
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

const GoogleIcon = () => (
  <Svg width="20" height="20" viewBox="0 0 24 24">
    <Path
      d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
      fill="#4285F4"
    />
    <Path
      d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
      fill="#34A853"
    />
    <Path
      d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
      fill="#FBBC05"
    />
    <Path
      d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
      fill="#EA4335"
    />
  </Svg>
);

const UserIcon = ({ color }: { color: string }) => (
  <Svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
    <Path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
    <Circle cx="12" cy="7" r="4" />
  </Svg>
);

const SteeringWheelIcon = ({ color }: { color: string }) => (
  <Svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
    <Circle cx="12" cy="12" r="10" />
    <Circle cx="12" cy="12" r="3" />
    <Path d="M12 15v7" />
    <Path d="M9.4 10.5L3.4 7" />
    <Path d="M14.6 10.5L20.6 7" />
  </Svg>
);

const PinIconSmall = ({ color }: { color: string }) => (
  <Svg width="16" height="16" viewBox="0 0 24 24" fill={color} stroke={color} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
    <Path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" />
    <Circle cx="12" cy="10" r="3" fill="#FFF" />
  </Svg>
);

const CheckCircleIcon = ({ color }: { color: string }) => (
  <Svg width="20" height="20" viewBox="0 0 24 24" fill={color}>
    <Circle cx="12" cy="12" r="12" fill={color} />
    <Path d="M17 8L10.5 14.5L7 11" stroke="#FFF" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
  </Svg>
);

const UncheckCircleIcon = ({ color }: { color: string }) => (
  <Svg width="20" height="20" viewBox="0 0 24 24">
    <Circle cx="12" cy="12" r="11" fill="#FFF" stroke={color} strokeWidth="1" />
  </Svg>
);

// --- Component ---

const LoginScreen = ({ navigation }: any) => {
  const [phoneNumber, setPhoneNumber] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [selectedRole, setSelectedRole] = useState<UserRole>('customer');
  const setRole = useAuthStore(state => state.setRole);

  useEffect(() => {
    GoogleSignin.configure({
      webClientId: '193471841626-9vo6188s25pv6rrjpbl4l446dllnr313.apps.googleusercontent.com',
    });
  }, []);

  const handlePhoneLogin = async () => {
    if (!phoneNumber) {
      Alert.alert('Lỗi', 'Vui lòng nhập số điện thoại');
      return;
    }
    try {
      setIsLoading(true);
      let formattedNumber = phoneNumber.trim();
      if (formattedNumber.startsWith('0')) {
        formattedNumber = formattedNumber.substring(1);
      }
      formattedNumber = `+84${formattedNumber}`;

      setRole(selectedRole); // Save selected role to global state
      const confirmation = await auth().signInWithPhoneNumber(formattedNumber);
      navigation.navigate('OTPVerification', { confirmation, phoneNumber: formattedNumber });
    } catch (error: any) {
      console.error(error);
      Alert.alert('Lỗi đăng nhập', error.message || 'Không thể gửi mã OTP');
    } finally {
      setIsLoading(false);
    }
  };

  const handleGoogleLogin = async () => {
    try {
      setIsLoading(true);
      await GoogleSignin.hasPlayServices({ showPlayServicesUpdateDialog: true });
      const signInResult = await GoogleSignin.signIn();
      const idToken = signInResult.data?.idToken;

      if (!idToken) {
        throw new Error('No ID token found');
      }
      
      setRole(selectedRole); // Save selected role to global state
      const googleCredential = auth.GoogleAuthProvider.credential(idToken);
      await auth().signInWithCredential(googleCredential);
    } catch (error: any) {
      console.error(error);
      if (error.code !== 'SIGN_IN_CANCELLED' && error.code !== '12501') {
        Alert.alert('Lỗi đăng nhập Google', error.message || 'Đã xảy ra lỗi');
      }
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
            
            {/* Center Wrapper */}
            <View style={styles.centerWrapper}>
              {/* Logo & Titles */}
              <View style={styles.titleSection}>
              <AppIcon />
              <Text style={styles.title}>Chào mừng bạn <Text style={styles.wave}>👋</Text></Text>
              <Text style={styles.subtitle}>Đăng nhập để bắt đầu hành trình cùng Vicar</Text>
            </View>

            {/* Role Selection Section */}
            <View style={styles.roleSection}>
              <Text style={styles.roleTitle}>BẠN MUỐN ĐĂNG NHẬP VỚI VAI TRÒ NÀO?</Text>
              <View style={styles.roleCardsContainer}>
                {/* Customer Card */}
                <TouchableOpacity 
                  style={[styles.roleCard, selectedRole === 'customer' && styles.roleCardActive]}
                  onPress={() => setSelectedRole('customer')}
                >
                  <View style={styles.roleCardCheck}>
                    {selectedRole === 'customer' ? <CheckCircleIcon color="#4F46E5" /> : <UncheckCircleIcon color="#E2E8F0" />}
                  </View>
                  <View style={[styles.roleIconWrapper, selectedRole === 'customer' ? styles.roleIconWrapperActive : null]}>
                    <UserIcon color={selectedRole === 'customer' ? "#4F46E5" : "#64748B"} />
                  </View>
                  <Text style={[styles.roleCardTitle, selectedRole === 'customer' && styles.roleCardTitleActive]}>Người dùng</Text>
                  <Text style={styles.roleCardSubtitle}>Tìm và đặt chuyến</Text>
                </TouchableOpacity>

                {/* Driver Card */}
                <TouchableOpacity 
                  style={[styles.roleCard, selectedRole === 'driver' && styles.roleCardActive]}
                  onPress={() => setSelectedRole('driver')}
                >
                  <View style={styles.roleCardCheck}>
                    {selectedRole === 'driver' ? <CheckCircleIcon color="#4F46E5" /> : <UncheckCircleIcon color="#E2E8F0" />}
                  </View>
                  <View style={[styles.roleIconWrapper, selectedRole === 'driver' ? styles.roleIconWrapperActive : null]}>
                    <SteeringWheelIcon color={selectedRole === 'driver' ? "#4F46E5" : "#64748B"} />
                  </View>
                  <Text style={[styles.roleCardTitle, selectedRole === 'driver' && styles.roleCardTitleActive]}>Lái xe</Text>
                  <Text style={styles.roleCardSubtitle}>Đăng chuyến và nhận khách</Text>
                </TouchableOpacity>
              </View>

              {/* Info Box */}
              <View style={styles.infoBox}>
                <View style={styles.infoBoxIcon}>
                  <PinIconSmall color="#E11D48" />
                </View>
                <Text style={styles.infoBoxText}>
                  {selectedRole === 'customer' 
                    ? "Sau khi xác thực, bạn có thể đặt chuyến và theo dõi hành trình." 
                    : "Sau khi xác thực, bạn có thể đăng chuyến đi và bắt đầu nhận khách."}
                </Text>
              </View>
            </View>

            {/* Form Section */}
            <View style={styles.formSection}>
              <View style={styles.formWrapper}>
                <Text style={styles.inputLabel}>Số điện thoại</Text>
                
                <View style={styles.inputContainer}>
                  <TouchableOpacity style={styles.countryCode}>
                    <Text style={styles.countryText}>VN</Text>
                    <Text style={styles.countryNumber}>+84</Text>
                  </TouchableOpacity>
                  
                  <View style={styles.divider} />
                  
                  <TextInput
                    style={styles.textInput}
                    placeholder="Nhập số điện thoại"
                    placeholderTextColor="#94A3B8"
                    keyboardType="phone-pad"
                    maxLength={11}
                    value={phoneNumber}
                    onChangeText={setPhoneNumber}
                    editable={!isLoading}
                  />
                </View>

                <TouchableOpacity 
                  style={[styles.primaryButton, isLoading && styles.primaryButtonDisabled]}
                  onPress={handlePhoneLogin}
                  disabled={isLoading}
                >
                  {isLoading ? (
                    <ActivityIndicator color="#FFFFFF" />
                  ) : (
                    <Text style={styles.primaryButtonText}>Tiếp tục</Text>
                  )}
                </TouchableOpacity>

                {/* Or Divider */}
                <View style={styles.orContainer}>
                  <View style={styles.orLine} />
                  <Text style={styles.orText}>hoặc</Text>
                  <View style={styles.orLine} />
                </View>

                {/* Google Login */}
                <TouchableOpacity 
                  style={[styles.googleButton, isLoading && styles.primaryButtonDisabled]} 
                  onPress={handleGoogleLogin}
                  disabled={isLoading}
                >
                  <View style={styles.googleIconWrapper}>
                    <GoogleIcon />
                  </View>
                  <Text style={styles.googleButtonText}>Tiếp tục với Google</Text>
                </TouchableOpacity>
              </View>
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

  titleSection: {
    alignItems: 'center',
    marginBottom: 40,
    paddingHorizontal: 24,
  },
  appIconContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 8,
  },
  title: {
    fontFamily: theme.typography.fontFamily,
    fontSize: 24,
    fontWeight: '700',
    color: '#0F172A',
    marginBottom: 8,
  },
  wave: {
    fontSize: 22,
  },
  subtitle: {
    fontFamily: theme.typography.fontFamily,
    fontSize: 14,
    color: '#64748B',
    fontWeight: '400',
  },
  roleSection: {
    paddingHorizontal: 24,
    marginBottom: 24,
    alignItems: 'center',
  },
  roleTitle: {
    fontFamily: theme.typography.fontFamily,
    fontSize: 12,
    fontWeight: '700',
    color: '#64748B',
    marginBottom: 16,
    alignSelf: 'flex-start',
  },
  roleCardsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
    marginBottom: 16,
  },
  roleCard: {
    flex: 1,
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#E2E8F0',
    borderRadius: 16,
    padding: 16,
    alignItems: 'center',
    marginHorizontal: 4,
    position: 'relative',
  },
  roleCardActive: {
    borderColor: '#4F46E5',
    backgroundColor: '#F5F8FF', // Light blue tint
  },
  roleCardCheck: {
    position: 'absolute',
    top: 10,
    right: 10,
  },
  roleIconWrapper: {
    width: 48,
    height: 48,
    borderRadius: 12,
    backgroundColor: '#F1F5F9',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 12,
  },
  roleIconWrapperActive: {
    backgroundColor: '#E0E7FF',
  },
  roleCardTitle: {
    fontFamily: theme.typography.fontFamily,
    fontSize: 15,
    fontWeight: '700',
    color: '#0F172A',
    marginBottom: 4,
  },
  roleCardTitleActive: {
    color: '#4F46E5',
  },
  roleCardSubtitle: {
    fontFamily: theme.typography.fontFamily,
    fontSize: 12,
    color: '#64748B',
    textAlign: 'center',
  },
  infoBox: {
    flexDirection: 'row',
    backgroundColor: '#F5F8FF',
    borderRadius: 12,
    padding: 12,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#E0E7FF',
    width: '100%',
  },
  infoBoxIcon: {
    marginRight: 12,
  },
  infoBoxText: {
    fontFamily: theme.typography.fontFamily,
    fontSize: 13,
    color: '#4F46E5',
    flex: 1,
    lineHeight: 18,
  },
  formSection: {
    alignItems: 'center', // Centers the form block in the screen
    width: '100%',
    paddingHorizontal: 24,
  },
  formWrapper: {
    width: '100%',
    maxWidth: 320, 
  },
  inputLabel: {
    fontFamily: theme.typography.fontFamily,
    fontSize: 14,
    fontWeight: '500',
    color: '#0F172A',
    alignSelf: 'flex-start',
    marginBottom: 8,
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    width: '100%',
    height: 52,
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#E2E8F0',
    borderRadius: 12,
    paddingHorizontal: 16,
    marginBottom: 16,
  },
  countryCode: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  countryText: {
    fontFamily: theme.typography.fontFamily,
    fontSize: 14,
    fontWeight: '500',
    color: '#0F172A',
    marginRight: 4,
  },
  countryNumber: {
    fontFamily: theme.typography.fontFamily,
    fontSize: 14,
    fontWeight: '500',
    color: '#0F172A',
  },
  divider: {
    width: 1,
    height: 24,
    backgroundColor: '#E2E8F0',
    marginHorizontal: 12,
  },
  textInput: {
    flex: 1,
    fontFamily: theme.typography.fontFamily,
    fontSize: 15,
    color: '#0F172A',
    height: '100%',
  },
  primaryButton: {
    width: '100%',
    height: 52,
    backgroundColor: '#2563EB',
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 24,
  },
  primaryButtonText: {
    fontFamily: theme.typography.fontFamily,
    fontSize: 15,
    fontWeight: '600',
    color: '#FFFFFF',
  },
  primaryButtonDisabled: {
    opacity: 0.7,
  },
  orContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    width: '100%',
    marginBottom: 24,
  },
  orLine: {
    flex: 1,
    height: 1,
    backgroundColor: '#E2E8F0',
  },
  orText: {
    fontFamily: theme.typography.fontFamily,
    fontSize: 13,
    color: '#94A3B8',
    paddingHorizontal: 16,
  },
  googleButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    width: '100%',
    height: 52,
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#E2E8F0',
    borderRadius: 12,
    // subtle shadow
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 1,
  },
  googleIconWrapper: {
    position: 'absolute',
    left: 16,
  },
  googleButtonText: {
    fontFamily: theme.typography.fontFamily,
    fontSize: 15,
    fontWeight: '500',
    color: '#0F172A',
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

export default LoginScreen;
