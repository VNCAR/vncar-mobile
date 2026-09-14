import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, TextInput, Alert, ActivityIndicator } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import auth from '@react-native-firebase/auth';
import { theme } from '../../theme';
import { useAuthStore } from '../../store/useAuthStore';

const API_URL = 'http://localhost:3000';

const RatingScreen = ({ route, navigation }: any) => {
  const { rideId, targetUserId } = route.params;
  const insets = useSafeAreaInsets();
  const role = useAuthStore((state) => state.role);
  
  const [rating, setRating] = useState(5);
  const [comment, setComment] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async () => {
    setIsSubmitting(true);
    try {
      const user = auth().currentUser;
      const token = user ? await user.getIdToken() : '';
      const response = await fetch(`${API_URL}/api/rides/${rideId}/rate`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ rating, comment, targetUserId })
      });

      if (response.ok) {
        Alert.alert('Cảm ơn!', 'Đánh giá của bạn đã được ghi nhận.', [
          { 
            text: 'Về trang chủ', 
            onPress: () => navigation.replace(role === 'driver' ? 'DriverHomeScreen' : 'PassengerHome') 
          }
        ]);
      } else {
        throw new Error('Lỗi từ máy chủ');
      }
    } catch (e) {
      Alert.alert('Lỗi', 'Không thể gửi đánh giá lúc này.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <View style={[styles.container, { paddingTop: insets.top, paddingBottom: insets.bottom }]}>
      <Text style={styles.title}>Chuyến đi hoàn tất! 🎉</Text>
      <Text style={styles.subtitle}>
        Vui lòng đánh giá trải nghiệm của bạn với {role === 'customer' ? 'tài xế' : 'khách hàng'} nhé.
      </Text>

      {/* Star Selector (Demo UI) */}
      <View style={styles.starsContainer}>
        {[1, 2, 3, 4, 5].map((star) => (
          <TouchableOpacity key={star} onPress={() => setRating(star)}>
            <Text style={[styles.starIcon, rating >= star ? styles.starSelected : styles.starUnselected]}>
              ⭐
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      <TextInput
        style={styles.textInput}
        placeholder="Để lại nhận xét (tuỳ chọn)..."
        placeholderTextColor="#94A3B8"
        multiline
        value={comment}
        onChangeText={setComment}
      />

      <TouchableOpacity 
        style={styles.submitButton} 
        onPress={handleSubmit} 
        disabled={isSubmitting}
      >
        {isSubmitting ? (
          <ActivityIndicator color="#FFFFFF" />
        ) : (
          <Text style={styles.submitButtonText}>Gửi Đánh Giá</Text>
        )}
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
    padding: 24,
    alignItems: 'center',
    justifyContent: 'center'
  },
  title: {
    fontFamily: theme.typography.fontFamily,
    fontSize: 24,
    fontWeight: '800',
    color: '#0F172A',
    marginBottom: 12,
  },
  subtitle: {
    fontFamily: theme.typography.fontFamily,
    fontSize: 16,
    color: '#64748B',
    textAlign: 'center',
    marginBottom: 40,
    paddingHorizontal: 20,
  },
  starsContainer: {
    flexDirection: 'row',
    marginBottom: 40,
    gap: 12,
  },
  starIcon: {
    fontSize: 40,
  },
  starSelected: {
    opacity: 1,
  },
  starUnselected: {
    opacity: 0.3,
  },
  textInput: {
    width: '100%',
    height: 120,
    backgroundColor: '#F8FAFC',
    borderRadius: 16,
    padding: 16,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    fontFamily: theme.typography.fontFamily,
    fontSize: 15,
    color: '#1E293B',
    textAlignVertical: 'top',
    marginBottom: 40,
  },
  submitButton: {
    backgroundColor: '#2563EB', // Blue 600
    width: '100%',
    height: 56,
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
  },
  submitButtonText: {
    fontFamily: theme.typography.fontFamily,
    fontSize: 16,
    fontWeight: '600',
    color: '#FFFFFF',
  }
});

export default RatingScreen;
