import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  ActivityIndicator,
  Modal,
  KeyboardAvoidingView,
  Platform,
  TouchableWithoutFeedback,
  Keyboard,
  Alert
} from 'react-native';
import Svg, { Path, Circle } from 'react-native-svg';
import { theme } from '../../../theme';
import auth from '@react-native-firebase/auth';

const MicIcon = () => (
  <Svg width="24" height="24" viewBox="0 0 24 24" fill="none">
    <Path d="M12 2A3 3 0 0 0 9 5V11A3 3 0 0 0 15 11V5A3 3 0 0 0 12 2Z" fill="#2563EB"/>
    <Path d="M19 10V11A7 7 0 0 1 5 11V10" stroke="#2563EB" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
    <Path d="M12 18V22M8 22H16" stroke="#2563EB" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
  </Svg>
);

const CloseIcon = () => (
  <Svg width="24" height="24" viewBox="0 0 24 24" fill="none">
    <Path d="M18 6L6 18M6 6L18 18" stroke="#64748B" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
  </Svg>
);

interface AiBookingModalProps {
  visible: boolean;
  onClose: () => void;
  onParsed: (data: any) => void;
}

const AiBookingModal: React.FC<AiBookingModalProps> = ({ visible, onClose, onParsed }) => {
  const [prompt, setPrompt] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async () => {
    if (!prompt.trim()) {
      Alert.alert('Lỗi', 'Vui lòng nhập nội dung chuyến đi.');
      return;
    }

    try {
      setIsLoading(true);
      const user = auth().currentUser;
      const token = user ? await user.getIdToken() : '';
      
      const apiUrl = 'http://localhost:3000';
      const response = await fetch(`${apiUrl}/api/ai/parse-intent`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ prompt })
      });

      const json = await response.json();
      
      if (!response.ok) {
        throw new Error(json.error || 'Failed to parse intent');
      }

      // Success
      setPrompt('');
      onParsed(json.data);
      onClose();
    } catch (error: any) {
      console.error(error);
      Alert.alert('Lỗi phân tích', error.message || 'Không thể trích xuất thông tin, vui lòng thử lại.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Modal
      visible={visible}
      transparent
      animationType="slide"
      onRequestClose={onClose}
    >
      <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
        <View style={styles.overlay}>
          <KeyboardAvoidingView 
            behavior={Platform.OS === 'ios' ? 'padding' : undefined}
            style={styles.modalContainer}
          >
            <View style={styles.header}>
              <Text style={styles.title}>Trợ lý AI Gemini 🤖</Text>
              <TouchableOpacity onPress={onClose} style={styles.closeButton}>
                <CloseIcon />
              </TouchableOpacity>
            </View>

            <Text style={styles.subtitle}>
              Nhập yêu cầu chuyến đi của bạn. Trợ lý AI sẽ tự động phân tích và tạo chuyến.
            </Text>

            <View style={styles.inputWrapper}>
              <TextInput
                style={styles.input}
                placeholder="Ví dụ: Đặt cho tôi 1 xe 4 chỗ từ Hà Đông lên Bờ Hồ, giá khoảng 150k"
                placeholderTextColor="#94A3B8"
                multiline
                numberOfLines={4}
                value={prompt}
                onChangeText={setPrompt}
                editable={!isLoading}
                textAlignVertical="top"
              />
              <TouchableOpacity style={styles.micButton}>
                <MicIcon />
              </TouchableOpacity>
            </View>

            <TouchableOpacity 
              style={[styles.submitButton, isLoading && styles.submitButtonDisabled]}
              onPress={handleSubmit}
              disabled={isLoading}
            >
              {isLoading ? (
                <ActivityIndicator color="#FFFFFF" />
              ) : (
                <Text style={styles.submitButtonText}>Phân tích Yêu cầu</Text>
              )}
            </TouchableOpacity>

          </KeyboardAvoidingView>
        </View>
      </TouchableWithoutFeedback>
    </Modal>
  );
};

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(15, 23, 42, 0.6)', // Dark overlay
    justifyContent: 'flex-end',
  },
  modalContainer: {
    backgroundColor: '#FFFFFF',
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    padding: 24,
    paddingBottom: Platform.OS === 'ios' ? 40 : 24,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  title: {
    fontFamily: theme.typography.fontFamily,
    fontSize: 20,
    fontWeight: '700',
    color: '#0F172A',
  },
  closeButton: {
    padding: 4,
  },
  subtitle: {
    fontFamily: theme.typography.fontFamily,
    fontSize: 14,
    color: '#64748B',
    marginBottom: 20,
    lineHeight: 20,
  },
  inputWrapper: {
    position: 'relative',
    marginBottom: 24,
  },
  input: {
    backgroundColor: '#F8FAFC',
    borderWidth: 1,
    borderColor: '#E2E8F0',
    borderRadius: 16,
    padding: 16,
    paddingRight: 50, // Space for mic button
    fontFamily: theme.typography.fontFamily,
    fontSize: 15,
    color: '#0F172A',
    height: 120,
  },
  micButton: {
    position: 'absolute',
    bottom: 12,
    right: 12,
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#EFF6FF',
    alignItems: 'center',
    justifyContent: 'center',
  },
  submitButton: {
    backgroundColor: '#2563EB',
    height: 56,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#2563EB',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 5,
  },
  submitButtonDisabled: {
    backgroundColor: '#93C5FD',
    shadowOpacity: 0,
    elevation: 0,
  },
  submitButtonText: {
    fontFamily: theme.typography.fontFamily,
    fontSize: 16,
    fontWeight: '600',
    color: '#FFFFFF',
  },
});

export default AiBookingModal;
