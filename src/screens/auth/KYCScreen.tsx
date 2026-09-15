import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Image,
  ActivityIndicator,
  Alert,
  SafeAreaView
} from 'react-native';
import { launchImageLibrary, Asset } from 'react-native-image-picker';
import storage from '@react-native-firebase/storage';
import auth from '@react-native-firebase/auth';
import { theme } from '../../theme';

interface KycImages {
  frontIdCardUrl: string | null;
  backIdCardUrl: string | null;
  selfieUrl: string | null;
  vehicleFrontUrl: string | null;
  vehicleBackUrl: string | null;
  vehicleLeftUrl: string | null;
  vehicleRightUrl: string | null;
  businessLicenseUrl: string | null;
}

type KycField = keyof KycImages;

const KYCScreen = ({ navigation }: any) => {
  const [images, setImages] = useState<KycImages>({
    frontIdCardUrl: null,
    backIdCardUrl: null,
    selfieUrl: null,
    vehicleFrontUrl: null,
    vehicleBackUrl: null,
    vehicleLeftUrl: null,
    vehicleRightUrl: null,
    businessLicenseUrl: null,
  });

  const [isLoading, setIsLoading] = useState(false);
  const user = auth().currentUser;

  const pickImage = async (field: KycField) => {
    try {
      const result = await launchImageLibrary({
        mediaType: 'photo',
        quality: 0.8,
      });

      if (result.didCancel) return;

      if (result.assets && result.assets.length > 0) {
        const selectedAsset = result.assets[0];
        setImages(prev => ({ ...prev, [field]: selectedAsset.uri || null }));
      }
    } catch (error) {
      console.error("Error picking image:", error);
      Alert.alert("Lỗi", "Không thể chọn ảnh.");
    }
  };

  const uploadImageToStorage = async (uri: string, filename: string): Promise<string> => {
    if (!user) throw new Error("Not authenticated");
    
    const reference = storage().ref(`kyc/${user.uid}/${filename}`);
    await reference.putFile(uri);
    const downloadURL = await reference.getDownloadURL();
    return downloadURL;
  };

  const handleSubmit = async () => {
    if (!user) return;

    // Basic validation
    if (!images.frontIdCardUrl || !images.backIdCardUrl || !images.selfieUrl || 
        !images.vehicleFrontUrl || !images.vehicleBackUrl || !images.vehicleLeftUrl || !images.vehicleRightUrl) {
      Alert.alert('Thiếu thông tin', 'Vui lòng cung cấp đầy đủ các ảnh bắt buộc (CMND/CCCD, Ảnh selfie và 4 góc xe).');
      return;
    }

    try {
      setIsLoading(true);

      // Upload all images in parallel
      const uploadPromises: Promise<{ field: KycField, url: string }>[] = [];

      for (const [key, uri] of Object.entries(images)) {
        if (uri && !uri.startsWith('http')) {
          const field = key as KycField;
          const ext = uri.split('.').pop();
          const filename = `${field}_${Date.now()}.${ext}`;
          
          uploadPromises.push(
            uploadImageToStorage(uri, filename).then(url => ({ field, url }))
          );
        }
      }

      const uploadedResults = await Promise.all(uploadPromises);
      
      const payload: Partial<KycImages> = {};
      uploadedResults.forEach(res => {
        payload[res.field] = res.url;
      });

      const token = await user.getIdToken();
      // NOTE: For physical devices, 'localhost' will work if you run: adb reverse tcp:3000 tcp:3000
      const apiUrl = 'http://10.0.2.2:3000';

      const response = await fetch(`${apiUrl}/api/user/kyc`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(payload)
      });

      if (!response.ok) {
        throw new Error('Failed to submit KYC data');
      }

      Alert.alert('Thành công', 'Hồ sơ xác thực của bạn đã được gửi và đang chờ phê duyệt.', [
        { text: 'OK', onPress: () => navigation.navigate('PassengerHome') } // TODO: Navigate to DriverHome or WaitingScreen
      ]);

    } catch (error: any) {
      console.error(error);
      Alert.alert('Lỗi', 'Có lỗi xảy ra trong quá trình tải lên. Vui lòng thử lại.');
    } finally {
      setIsLoading(false);
    }
  };

  const renderImagePicker = (field: KycField, label: string, required: boolean = true) => {
    const uri = images[field];
    return (
      <View style={styles.imagePickerContainer}>
        <Text style={styles.imageLabel}>
          {label} {required && <Text style={styles.requiredMark}>*</Text>}
        </Text>
        <TouchableOpacity 
          style={styles.imageBox} 
          onPress={() => pickImage(field)}
          disabled={isLoading}
        >
          {uri ? (
            <Image source={{ uri }} style={styles.imagePreview} />
          ) : (
            <View style={styles.imagePlaceholder}>
              <Text style={styles.placeholderText}>+ Chọn ảnh</Text>
            </View>
          )}
        </TouchableOpacity>
      </View>
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Xác thực Tài xế (e-KYC)</Text>
      </View>

      <ScrollView style={styles.scrollView} contentContainerStyle={styles.scrollContent}>
        <Text style={styles.sectionTitle}>1. Giấy tờ tuỳ thân</Text>
        <View style={styles.row}>
          {renderImagePicker('frontIdCardUrl', 'CMND/CCCD (Mặt trước)')}
          {renderImagePicker('backIdCardUrl', 'CMND/CCCD (Mặt sau)')}
        </View>

        <Text style={styles.sectionTitle}>2. Ảnh chân dung</Text>
        {renderImagePicker('selfieUrl', 'Ảnh Selfie khuôn mặt')}

        <Text style={styles.sectionTitle}>3. Hình ảnh phương tiện</Text>
        <View style={styles.row}>
          {renderImagePicker('vehicleFrontUrl', 'Góc trước xe')}
          {renderImagePicker('vehicleBackUrl', 'Góc sau xe')}
        </View>
        <View style={styles.row}>
          {renderImagePicker('vehicleLeftUrl', 'Góc hông trái')}
          {renderImagePicker('vehicleRightUrl', 'Góc hông phải')}
        </View>

        <Text style={styles.sectionTitle}>4. Giấy tờ bổ sung (Nâng cao)</Text>
        {renderImagePicker('businessLicenseUrl', 'Giấy phép ĐKKD (Doanh nghiệp)', false)}

        <TouchableOpacity 
          style={[styles.submitButton, isLoading && styles.submitButtonDisabled]}
          onPress={handleSubmit}
          disabled={isLoading}
        >
          {isLoading ? (
            <ActivityIndicator color="#FFFFFF" />
          ) : (
            <Text style={styles.submitButtonText}>Gửi hồ sơ duyệt</Text>
          )}
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F8FAFC',
  },
  header: {
    padding: 16,
    backgroundColor: '#FFFFFF',
    borderBottomWidth: 1,
    borderBottomColor: '#E2E8F0',
  },
  headerTitle: {
    fontFamily: theme.typography.fontFamily,
    fontSize: 18,
    fontWeight: '700',
    color: '#0F172A',
    textAlign: 'center',
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    padding: 20,
    paddingBottom: 40,
  },
  sectionTitle: {
    fontFamily: theme.typography.fontFamily,
    fontSize: 16,
    fontWeight: '600',
    color: '#1E293B',
    marginTop: 20,
    marginBottom: 12,
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 12,
  },
  imagePickerContainer: {
    flex: 1,
    marginHorizontal: 4,
    marginBottom: 12,
  },
  imageLabel: {
    fontFamily: theme.typography.fontFamily,
    fontSize: 13,
    color: '#475569',
    marginBottom: 8,
  },
  requiredMark: {
    color: '#EF4444',
  },
  imageBox: {
    height: 120,
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#CBD5E1',
    borderStyle: 'dashed',
    borderRadius: 8,
    overflow: 'hidden',
    justifyContent: 'center',
    alignItems: 'center',
  },
  imagePreview: {
    width: '100%',
    height: '100%',
    resizeMode: 'cover',
  },
  imagePlaceholder: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  placeholderText: {
    fontFamily: theme.typography.fontFamily,
    fontSize: 14,
    color: '#94A3B8',
    fontWeight: '500',
  },
  submitButton: {
    backgroundColor: '#2563EB',
    padding: 16,
    borderRadius: 12,
    alignItems: 'center',
    marginTop: 30,
  },
  submitButtonDisabled: {
    backgroundColor: '#93C5FD',
  },
  submitButtonText: {
    fontFamily: theme.typography.fontFamily,
    fontSize: 16,
    fontWeight: '600',
    color: '#FFFFFF',
  },
});

export default KYCScreen;
