import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Platform,
  Alert,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import Svg, { Path, Circle, Defs, LinearGradient, Stop, Rect, G } from 'react-native-svg';
import { theme } from '../../theme';
import auth from '@react-native-firebase/auth';

// --- Icons ---

const BellIcon = () => (
  <Svg width="20" height="20" viewBox="0 0 24 24" fill="none">
    <Path d="M18 8A6 6 0 0 0 6 8C6 15 3 17 3 17H21C21 17 18 15 18 8Z" stroke="#0F172A" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
    <Path d="M13.73 21A2 2 0 0 1 10.27 21" stroke="#0F172A" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
  </Svg>
);

const SearchIcon = () => (
  <Svg width="16" height="16" viewBox="0 0 24 24" fill="none">
    <Circle cx="11" cy="11" r="8" stroke="#94A3B8" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
    <Path d="M21 21L16.65 16.65" stroke="#94A3B8" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
  </Svg>
);

const SquareOutlineIcon = () => (
  <Svg width="12" height="12" viewBox="0 0 24 24" fill="none">
    <Rect x="4" y="4" width="16" height="16" stroke="#94A3B8" strokeWidth="2.5" rx="2" />
  </Svg>
);

const MicIcon = () => (
  <Svg width="16" height="16" viewBox="0 0 24 24" fill="none">
    <Path d="M12 2A3 3 0 0 0 9 5V11A3 3 0 0 0 15 11V5A3 3 0 0 0 12 2Z" fill="#FFFFFF"/>
    <Path d="M19 10V11A7 7 0 0 1 5 11V10" stroke="#FFFFFF" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
    <Path d="M12 18V22M8 22H16" stroke="#FFFFFF" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
  </Svg>
);

const ChevronRightIcon = ({ color = "#FFFFFF" }: { color?: string }) => (
  <Svg width="16" height="16" viewBox="0 0 24 24" fill="none">
    <Path d="M9 18L15 12L9 6" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
  </Svg>
);

const RouteIcon = () => (
  <Svg width="20" height="20" viewBox="0 0 24 24" fill="none">
    <Path d="M9 18L2 18L2 13" stroke="#2563EB" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
    <Path d="M2 18L10 10C11.1 8.9 12.9 8.9 14 10L16 12C17.1 13.1 18.9 13.1 20 12L22 10" stroke="#2563EB" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
    <Circle cx="22" cy="10" r="2" fill="#2563EB" />
    <Circle cx="2" cy="18" r="2" fill="#2563EB" />
  </Svg>
);

// Bottom Nav Icons
const HomeIconActive = () => (
  <Svg width="24" height="24" viewBox="0 0 24 24" fill="none">
    <Path d="M3 9L12 2L21 9V20C21 20.5304 20.7893 21.0391 20.4142 21.4142C20.0391 21.7893 19.5304 22 19 22H5C4.46957 22 3.96086 21.7893 3.58579 21.4142C3.21071 21.0391 3 20.5304 3 20V9Z" stroke="#2563EB" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
    <Path d="M9 22V12H15V22" stroke="#2563EB" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
  </Svg>
);

const DocumentIcon = () => (
  <Svg width="24" height="24" viewBox="0 0 24 24" fill="none">
    <Path d="M14 2H6C5.46957 2 4.96086 2.21071 4.58579 2.58579C4.21071 2.96086 4 3.46957 4 4V20C4 20.5304 4.21071 21.0391 4.58579 21.4142C4.96086 21.7893 5.46957 22 6 22H18C18.5304 22 19.0391 21.7893 19.4142 21.4142C19.7893 21.0391 20 20.5304 20 20V8L14 2Z" stroke="#94A3B8" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
    <Path d="M14 2V8H20" stroke="#94A3B8" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
    <Path d="M16 13H8" stroke="#94A3B8" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
    <Path d="M16 17H8" stroke="#94A3B8" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
    <Path d="M10 9H8" stroke="#94A3B8" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
  </Svg>
);

const UserIcon = () => (
  <Svg width="24" height="24" viewBox="0 0 24 24" fill="none">
    <Path d="M20 21V19C20 17.9391 19.5786 16.9217 18.8284 16.1716C18.0783 15.4214 17.0609 15 16 15H8C6.93913 15 5.92172 15.4214 5.17157 16.1716C4.42143 16.9217 4 17.9391 4 19V21" stroke="#94A3B8" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
    <Circle cx="12" cy="7" r="4" stroke="#94A3B8" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
  </Svg>
);

import MapView, { Marker, PROVIDER_GOOGLE } from 'react-native-maps';
import Geolocation from '@react-native-community/geolocation';

const MapPreview = () => {
  const [currentPosition, setCurrentPosition] = React.useState<any>(null);

  React.useEffect(() => {
    Geolocation.getCurrentPosition(
      info => setCurrentPosition({
        latitude: info.coords.latitude,
        longitude: info.coords.longitude,
        latitudeDelta: 0.05,
        longitudeDelta: 0.05,
      }),
      error => console.warn(error),
      { enableHighAccuracy: true, timeout: 20000, maximumAge: 1000 }
    );
  }, []);

  return (
    <View style={styles.mapContainer}>
      <MapView
        provider={PROVIDER_GOOGLE}
        style={StyleSheet.absoluteFillObject}
        initialRegion={currentPosition || {
          latitude: 21.0285, // Default to Hanoi
          longitude: 105.8542,
          latitudeDelta: 0.0922,
          longitudeDelta: 0.0421,
        }}
        region={currentPosition}
        showsUserLocation={true}
        showsMyLocationButton={true}
      />
      {/* Compass */}
      <View style={styles.compassContainer}>
        <Svg width="16" height="16" viewBox="0 0 24 24" fill="none">
          <Path d="M12 2L15 9L22 12L15 15L12 22L9 15L2 12L9 9L12 2Z" fill="#2563EB" stroke="#1D4ED8" strokeWidth="1"/>
        </Svg>
      </View>
      {/* Nearby Driver Badge */}
      <View style={styles.nearbyBadge}>
        <View style={styles.nearbyDot} />
        <Text style={styles.nearbyText}>3 tài xế gần đây</Text>
      </View>
    </View>
  );
};


// --- Main Component ---

import AiBookingModal from './components/AiBookingModal';

const PassengerHomeScreen = ({ navigation }: any) => {
  const insets = useSafeAreaInsets();
  const [isAiModalVisible, setAiModalVisible] = React.useState(false);

  const handleAiParsed = async (data: any) => {
    try {
      // 1. Tạo chuyến đi
      const user = auth().currentUser;
      const token = user ? await user.getIdToken() : '';
      const response = await fetch('http://10.0.2.2:3000/api/rides', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          originLat: data.originLat || 21.0285, // Fallback nếu Gemini không lấy được
          originLng: data.originLng || 105.8542,
          originAddress: data.pickup,
          destinationLat: data.destLat || 21.0, 
          destinationLng: data.destLng || 105.8,
          destinationAddress: data.dropoff,
          priceRangeMin: data.price,
          priceRangeMax: data.price + 50000,
          carType: data.carType
        })
      });

      const result = await response.json();
      if (response.ok && result.ride) {
        // 2. Điều hướng qua màn hình chờ
        navigation.navigate('RideWaitingScreen', { 
          rideId: result.ride.id,
          predictedDistance: data.distance_km,
          predictedDuration: data.duration_mins
        });
      } else {
        throw new Error(result.error);
      }
    } catch (error: any) {
      console.error(error);
      Alert.alert('Lỗi', 'Không thể tạo chuyến đi. Vui lòng thử lại.');
    }
  };

  return (
    <View style={[styles.container, { paddingTop: insets.top, paddingBottom: insets.bottom }]}>
      
      {/* Top Header */}
      <View style={styles.header}>
        <View style={styles.headerTextGroup}>
          <Text style={styles.greetingText}>Xin chào 👋</Text>
          <Text style={styles.titleText}>Bạn muốn đi đâu hôm nay?</Text>
        </View>
        <TouchableOpacity style={styles.notificationBtn}>
          <BellIcon />
          <View style={styles.notificationDot} />
        </TouchableOpacity>
      </View>

      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        
        {/* Destination Search Card */}
        <View style={styles.searchCard}>
          {/* Row 1: Search */}
          <TouchableOpacity style={styles.searchRow}>
            <SearchIcon />
            <Text style={styles.searchText}>Bạn muốn đi đâu?</Text>
          </TouchableOpacity>
          <View style={styles.divider} />
          
          {/* Row 2: Pickup */}
          <TouchableOpacity style={styles.pickupRow}>
            <View style={styles.blueDot} />
            <View style={styles.locationTextGroup}>
              <Text style={styles.labelSmall}>ĐIỂM ĐÓN</Text>
              <Text style={styles.locationMainText}>Vị trí hiện tại của bạn</Text>
            </View>
          </TouchableOpacity>
          <View style={styles.dividerSubtle} />

          {/* Row 3: Destination */}
          <TouchableOpacity style={styles.destinationRow}>
            <SquareOutlineIcon />
            <Text style={styles.destinationText}>Nhập điểm đến...</Text>
          </TouchableOpacity>
        </View>

        {/* Map Section */}
        <MapPreview />

        {/* AI Voice Search Button */}
        <TouchableOpacity 
          style={styles.voiceButton}
          activeOpacity={0.8}
          onPress={() => setAiModalVisible(true)}
        >
          <View style={styles.voiceLeftGroup}>
            <View style={styles.micContainer}>
              <MicIcon />
            </View>
            <View>
              <Text style={styles.voiceMainText}>Đặt xe bằng giọng nói</Text>
              <Text style={styles.voiceSubText}>Nói yêu cầu của bạn</Text>
            </View>
          </View>
          <ChevronRightIcon />
        </TouchableOpacity>

        {/* Recent Trips */}
        <View style={styles.recentSection}>
          <Text style={styles.sectionTitle}>Chuyến gần đây</Text>
          
          <TouchableOpacity style={styles.recentCard} activeOpacity={0.7}>
            <View style={styles.recentIconContainer}>
              <RouteIcon />
            </View>
            <View style={styles.recentTextGroup}>
              <Text style={styles.recentRoute}>Lê Văn Lương → Mỹ Đình</Text>
              <Text style={styles.recentDetails}>Xe 4 chỗ · <Text style={styles.recentPrice}>130.000đ</Text></Text>
            </View>
            <ChevronRightIcon color="#94A3B8" />
          </TouchableOpacity>
        </View>

      </ScrollView>

      {/* Bottom Navigation */}
      <View style={styles.bottomNav}>
        <TouchableOpacity style={styles.navItemActive}>
          <HomeIconActive />
          <Text style={styles.navTextActive}>Trang chủ</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.navItem} onPress={() => navigation.navigate('MyTrips')}>
          <DocumentIcon />
          <Text style={styles.navText}>Chuyến đi</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.navItem} onPress={() => navigation.navigate('CustomerAccount')}>
          <UserIcon />
          <Text style={styles.navText}>Tài khoản</Text>
        </TouchableOpacity>
      </View>

      {/* Modals */}
      <AiBookingModal 
        visible={isAiModalVisible} 
        onClose={() => setAiModalVisible(false)} 
        onParsed={handleAiParsed}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F8FAFC',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingTop: 12,
    paddingBottom: 16,
  },
  headerTextGroup: {
    flex: 1,
  },
  greetingText: {
    fontFamily: theme.typography.fontFamily,
    fontSize: 13,
    color: '#64748B',
    marginBottom: 4,
  },
  titleText: {
    fontFamily: theme.typography.fontFamily,
    fontSize: 20,
    fontWeight: '700',
    color: '#0F172A',
  },
  notificationBtn: {
    width: 36,
    height: 36,
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#E2E8F0',
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    position: 'relative',
  },
  notificationDot: {
    position: 'absolute',
    top: 8,
    right: 8,
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: '#EF4444',
    borderWidth: 1,
    borderColor: '#FFFFFF',
  },
  scrollContent: {
    paddingHorizontal: 16,
    paddingBottom: 100, // Space for bottom nav
  },
  searchCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    paddingHorizontal: 16,
    shadowColor: '#0F172A',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.05,
    shadowRadius: 12,
    elevation: 3,
    marginBottom: 20,
  },
  searchRow: {
    flexDirection: 'row',
    alignItems: 'center',
    height: 48,
  },
  searchText: {
    fontFamily: theme.typography.fontFamily,
    fontSize: 14,
    color: '#94A3B8',
    marginLeft: 12,
  },
  divider: {
    height: 1,
    backgroundColor: '#E2E8F0',
  },
  pickupRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
  },
  blueDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#2563EB',
    marginLeft: 4, // Align with icons
    marginRight: 16,
  },
  locationTextGroup: {
    flex: 1,
  },
  labelSmall: {
    fontFamily: theme.typography.fontFamily,
    fontSize: 10,
    fontWeight: '600',
    color: '#2563EB',
    marginBottom: 2,
  },
  locationMainText: {
    fontFamily: theme.typography.fontFamily,
    fontSize: 14,
    fontWeight: '600',
    color: '#0F172A',
  },
  dividerSubtle: {
    height: 1,
    backgroundColor: '#F1F5F9',
    marginLeft: 28, // Indent past icon
  },
  destinationRow: {
    flexDirection: 'row',
    alignItems: 'center',
    height: 48,
    paddingLeft: 2, // Fine tune alignment
  },
  destinationText: {
    fontFamily: theme.typography.fontFamily,
    fontSize: 14,
    color: '#94A3B8',
    marginLeft: 14,
  },
  mapContainer: {
    width: '100%',
    height: 200,
    borderRadius: 16,
    overflow: 'hidden',
    backgroundColor: '#F1F5F9',
    marginBottom: -10, // Slight overlap for the voice button
    position: 'relative',
    borderWidth: 1,
    borderColor: '#E2E8F0',
  },
  compassContainer: {
    position: 'absolute',
    top: 12,
    right: 12,
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: '#FFFFFF',
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  nearbyBadge: {
    position: 'absolute',
    bottom: 30,
    right: 12,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  nearbyDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: '#22C55E',
    marginRight: 6,
  },
  nearbyText: {
    fontFamily: theme.typography.fontFamily,
    fontSize: 11,
    fontWeight: '600',
    color: '#0F172A',
  },
  voiceButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: '#2563EB',
    height: 56,
    borderRadius: 14,
    paddingHorizontal: 16,
    marginBottom: 24,
    shadowColor: '#2563EB',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 5,
    zIndex: 10,
  },
  voiceLeftGroup: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  micContainer: {
    width: 36,
    height: 36,
    borderRadius: 10,
    backgroundColor: 'rgba(255,255,255,0.2)',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  voiceMainText: {
    fontFamily: theme.typography.fontFamily,
    fontSize: 15,
    fontWeight: '700',
    color: '#FFFFFF',
    marginBottom: 2,
  },
  voiceSubText: {
    fontFamily: theme.typography.fontFamily,
    fontSize: 11,
    color: 'rgba(255,255,255,0.8)',
  },
  recentSection: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontFamily: theme.typography.fontFamily,
    fontSize: 15,
    fontWeight: '700',
    color: '#0F172A',
    marginBottom: 12,
  },
  recentCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#E2E8F0',
    borderRadius: 14,
    height: 64,
    paddingHorizontal: 16,
    shadowColor: '#0F172A',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.03,
    shadowRadius: 8,
    elevation: 1,
  },
  recentIconContainer: {
    width: 36,
    height: 36,
    borderRadius: 10,
    backgroundColor: '#F1F5F9',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  recentTextGroup: {
    flex: 1,
  },
  recentRoute: {
    fontFamily: theme.typography.fontFamily,
    fontSize: 14,
    fontWeight: '600',
    color: '#0F172A',
    marginBottom: 4,
  },
  recentDetails: {
    fontFamily: theme.typography.fontFamily,
    fontSize: 12,
    color: '#64748B',
  },
  recentPrice: {
    color: '#2563EB',
    fontWeight: '600',
  },
  bottomNav: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    height: Platform.OS === 'ios' ? 84 : 72,
    backgroundColor: '#FFFFFF',
    borderTopWidth: 1,
    borderTopColor: '#E2E8F0',
    flexDirection: 'row',
    justifyContent: 'space-around',
    paddingTop: 12,
    paddingBottom: Platform.OS === 'ios' ? 24 : 12,
  },
  navItem: {
    alignItems: 'center',
    justifyContent: 'center',
    flex: 1,
  },
  navItemActive: {
    alignItems: 'center',
    justifyContent: 'center',
    flex: 1,
    backgroundColor: '#EFF6FF',
    marginHorizontal: 16,
    borderRadius: 12,
    paddingVertical: 6,
  },
  navText: {
    fontFamily: theme.typography.fontFamily,
    fontSize: 10,
    fontWeight: '500',
    color: '#94A3B8',
    marginTop: 4,
  },
  navTextActive: {
    fontFamily: theme.typography.fontFamily,
    fontSize: 10,
    fontWeight: '700',
    color: '#2563EB',
    marginTop: 4,
  },
});

export default PassengerHomeScreen;
