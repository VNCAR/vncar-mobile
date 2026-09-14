import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Alert } from 'react-native';
import MapView, { Marker, PROVIDER_GOOGLE } from 'react-native-maps';
import Geolocation from '@react-native-community/geolocation';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { io, Socket } from 'socket.io-client';
import { theme } from '../../theme';
import auth from '@react-native-firebase/auth';
import { useAuthStore } from '../../store/useAuthStore';

const API_URL = 'http://localhost:3000';

const ActiveRideScreen = ({ route, navigation }: any) => {
  const { rideId, driverId } = route.params;
  const insets = useSafeAreaInsets();
  const role = useAuthStore((state) => state.role); // customer or driver
  const [socket, setSocket] = useState<Socket | null>(null);
  const [driverLocation, setDriverLocation] = useState<{ lat: number, lng: number } | null>(null);
  
  useEffect(() => {
    const newSocket = io(API_URL);
    setSocket(newSocket);

    newSocket.on('connect', () => {
      newSocket.emit('join_ride', rideId);
    });

    if (role === 'customer') {
      // Khách hàng lắng nghe vị trí tài xế
      newSocket.on('driver_location', (data) => {
        setDriverLocation({ lat: data.lat, lng: data.lng });
      });
    } else {
      // Tài xế gửi vị trí liên tục
      const watchId = Geolocation.watchPosition(
        (position) => {
          const { latitude, longitude, heading } = position.coords;
          setDriverLocation({ lat: latitude, lng: longitude }); // Update UI cho tài xế xem luôn
          newSocket.emit('driver_location_update', {
            rideId,
            driverId,
            lat: latitude,
            lng: longitude,
            heading
          });
        },
        (error) => console.log(error),
        { enableHighAccuracy: true, distanceFilter: 10, interval: 3000, fastestInterval: 2000 }
      );

      return () => {
        Geolocation.clearWatch(watchId);
        newSocket.disconnect();
      };
    }

    return () => {
      newSocket.disconnect();
    };
  }, [rideId, role]);

  const handleCompleteRide = async () => {
    try {
      const user = auth().currentUser;
      const token = user ? await user.getIdToken() : '';
      const response = await fetch(`${API_URL}/api/rides/${rideId}/complete`, {
        method: 'POST',
        headers: { 'Authorization': `Bearer ${token}` }
      });
      if (response.ok) {
        navigation.replace('RatingScreen', { rideId, targetUserId: role === 'driver' ? 'customer_id' : driverId });
      }
    } catch (e) {
      Alert.alert('Lỗi', 'Không thể hoàn thành chuyến đi');
    }
  };

  return (
    <View style={styles.container}>
      <MapView
        provider={PROVIDER_GOOGLE}
        style={StyleSheet.absoluteFillObject}
        initialRegion={{
          latitude: 21.0285,
          longitude: 105.8542,
          latitudeDelta: 0.05,
          longitudeDelta: 0.05,
        }}
        region={driverLocation ? {
          latitude: driverLocation.lat,
          longitude: driverLocation.lng,
          latitudeDelta: 0.01,
          longitudeDelta: 0.01,
        } : undefined}
      >
        {driverLocation && (
          <Marker
            coordinate={{ latitude: driverLocation.lat, longitude: driverLocation.lng }}
            title="Tài xế đang ở đây"
          >
            <View style={styles.carMarker}>
              <Text>🚗</Text>
            </View>
          </Marker>
        )}
      </MapView>

      {/* Thông tin chuyến đi & Điều khiển */}
      <View style={[styles.bottomCard, { paddingBottom: insets.bottom || 24 }]}>
        <View style={styles.dragHandle} />
        <Text style={styles.statusText}>
          {role === 'customer' ? 'Tài xế đang đến đón bạn' : 'Đang di chuyển cùng khách'}
        </Text>
        
        {role === 'driver' && (
          <TouchableOpacity style={styles.completeButton} onPress={handleCompleteRide}>
            <Text style={styles.completeButtonText}>Hoàn Thành Chuyến Đi</Text>
          </TouchableOpacity>
        )}
        {role === 'customer' && (
          <TouchableOpacity style={styles.completeButton} onPress={() => navigation.replace('RatingScreen', { rideId, targetUserId: driverId })}>
            <Text style={styles.completeButtonText}>Tài Xế Đã Tới Nơi (Test)</Text>
          </TouchableOpacity>
        )}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  carMarker: {
    backgroundColor: '#FFFFFF',
    padding: 8,
    borderRadius: 20,
    borderWidth: 2,
    borderColor: '#2563EB',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  bottomCard: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: '#FFFFFF',
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    padding: 24,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: -4 },
    shadowOpacity: 0.1,
    shadowRadius: 12,
    elevation: 10,
    alignItems: 'center',
  },
  dragHandle: {
    width: 40,
    height: 4,
    backgroundColor: '#E2E8F0',
    borderRadius: 2,
    marginBottom: 16,
  },
  statusText: {
    fontFamily: theme.typography.fontFamily,
    fontSize: 18,
    fontWeight: '700',
    color: '#0F172A',
    marginBottom: 20,
  },
  completeButton: {
    backgroundColor: '#10B981', // Emerald 500
    width: '100%',
    height: 56,
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
  },
  completeButtonText: {
    fontFamily: theme.typography.fontFamily,
    fontSize: 16,
    fontWeight: '600',
    color: '#FFFFFF',
  }
});

export default ActiveRideScreen;
