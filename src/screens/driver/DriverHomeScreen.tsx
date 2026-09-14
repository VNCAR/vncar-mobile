import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  ActivityIndicator,
  TextInput,
  Alert
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { theme } from '../../theme';
import auth from '@react-native-firebase/auth';
import { io, Socket } from 'socket.io-client';

const API_URL = 'http://localhost:3000';

interface Ride {
  id: string;
  originAddress: string;
  destinationAddress: string;
  priceRangeMin: number;
  priceRangeMax: number;
  carType: string;
  creator: {
    name: string;
    rating: number;
  };
}

const DriverHomeScreen = ({ navigation }: any) => {
  const insets = useSafeAreaInsets();
  const [rides, setRides] = useState<Ride[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [socket, setSocket] = useState<Socket | null>(null);
  const [bidInputs, setBidInputs] = useState<{ [key: string]: string }>({});

  useEffect(() => {
    // Connect to Socket.IO
    const newSocket = io(API_URL);
    setSocket(newSocket);

    newSocket.on('connect', () => {
      console.log('Connected to Socket.IO server as driver');
    });

    fetchRides();

    return () => {
      newSocket.disconnect();
    };
  }, []);

  const fetchRides = async () => {
    try {
      setIsLoading(true);
      const user = auth().currentUser;
      const token = user ? await user.getIdToken() : '';

      const response = await fetch(`${API_URL}/api/rides`, {
        headers: {
          'Authorization': `Bearer ${token}`,
        }
      });
      const data = await response.json();
      
      if (response.ok && data.rides) {
        setRides(data.rides);
      } else {
        throw new Error('Failed to fetch rides');
      }
    } catch (error) {
      console.error(error);
      Alert.alert('Lỗi', 'Không thể lấy danh sách chuyến đi.');
    } finally {
      setIsLoading(false);
    }
  };

  const handlePlaceBid = (rideId: string) => {
    const priceStr = bidInputs[rideId];
    if (!priceStr || isNaN(Number(priceStr))) {
      Alert.alert('Lỗi', 'Vui lòng nhập số tiền hợp lệ');
      return;
    }

    const price = Number(priceStr);
    const user = auth().currentUser;

    if (socket && user) {
      socket.emit('join_ride', rideId); // Join room to listen for acceptance
      socket.emit('place_bid', {
        rideId,
        driverId: user.uid,
        price
      });
      Alert.alert('Thành công', 'Đã gửi mức giá cho khách hàng!');
    }
  };

  useEffect(() => {
    if (socket) {
      socket.on('ride_accepted', (data) => {
        const user = auth().currentUser;
        if (user && data.driverId === user.uid) {
          Alert.alert('Chúc mừng!', 'Khách hàng đã chấp nhận mức giá của bạn!', [
            { text: 'Đi đón khách', onPress: () => navigation.replace('ActiveRideScreen', { rideId: data.rideId, driverId: user.uid }) }
          ]);
        } else if (data.driverId !== user?.uid) {
          // Khách hàng chọn tài xế khác -> Xóa chuyến đi khỏi danh sách hoặc báo "Đã có tài xế nhận"
          setRides((prev) => prev.filter(r => r.id !== data.rideId));
        }
      });
    }
  }, [socket]);

  const renderRideItem = ({ item }: { item: Ride }) => (
    <View style={styles.rideCard}>
      <View style={styles.cardHeader}>
        <Text style={styles.customerName}>{item.creator.name || 'Khách hàng'} (⭐ {item.creator.rating})</Text>
        <Text style={styles.carType}>{item.carType}</Text>
      </View>
      
      <View style={styles.locationContainer}>
        <Text style={styles.locationLabel}>Từ: <Text style={styles.locationText}>{item.originAddress || 'Đang cập nhật'}</Text></Text>
        <Text style={styles.locationLabel}>Đến: <Text style={styles.locationText}>{item.destinationAddress || 'Đang cập nhật'}</Text></Text>
      </View>

      <Text style={styles.priceSuggestion}>
        Giá gợi ý: <Text style={styles.priceHighlight}>{item.priceRangeMin ? `${item.priceRangeMin}đ` : 'Thoả thuận'}</Text>
      </Text>

      <View style={styles.bidActionContainer}>
        <TextInput
          style={styles.bidInput}
          placeholder="Nhập giá (VNĐ)"
          keyboardType="numeric"
          value={bidInputs[item.id] || ''}
          onChangeText={(text) => setBidInputs({ ...bidInputs, [item.id]: text })}
        />
        <TouchableOpacity style={styles.bidButton} onPress={() => handlePlaceBid(item.id)}>
          <Text style={styles.bidButtonText}>Trả Giá</Text>
        </TouchableOpacity>
      </View>
    </View>
  );

  return (
    <View style={[styles.container, { paddingTop: insets.top, paddingBottom: insets.bottom }]}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Chuyến Đi Đang Chờ</Text>
        <TouchableOpacity onPress={fetchRides} style={styles.refreshButton}>
          <Text style={styles.refreshButtonText}>Làm mới</Text>
        </TouchableOpacity>
      </View>

      {isLoading ? (
        <ActivityIndicator size="large" color="#2563EB" style={styles.loader} />
      ) : rides.length === 0 ? (
        <View style={styles.emptyContainer}>
          <Text style={styles.emptyText}>Hiện chưa có chuyến đi nào gần bạn.</Text>
        </View>
      ) : (
        <FlatList
          data={rides}
          keyExtractor={(item) => item.id}
          renderItem={renderRideItem}
          contentContainerStyle={styles.listContent}
        />
      )}
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
  },
  refreshButton: {
    paddingVertical: 6,
    paddingHorizontal: 12,
    backgroundColor: '#EFF6FF',
    borderRadius: 8,
  },
  refreshButtonText: {
    fontFamily: theme.typography.fontFamily,
    fontSize: 13,
    fontWeight: '600',
    color: '#2563EB',
  },
  loader: {
    flex: 1,
    justifyContent: 'center',
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  emptyText: {
    fontFamily: theme.typography.fontFamily,
    fontSize: 15,
    color: '#64748B',
  },
  listContent: {
    padding: 16,
  },
  rideCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 16,
    marginBottom: 16,
    shadowColor: '#0F172A',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  customerName: {
    fontFamily: theme.typography.fontFamily,
    fontSize: 16,
    fontWeight: '700',
    color: '#1E293B',
  },
  carType: {
    fontFamily: theme.typography.fontFamily,
    fontSize: 13,
    fontWeight: '600',
    color: '#059669',
    backgroundColor: '#D1FAE5',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 6,
  },
  locationContainer: {
    marginBottom: 12,
  },
  locationLabel: {
    fontFamily: theme.typography.fontFamily,
    fontSize: 14,
    color: '#64748B',
    marginBottom: 4,
  },
  locationText: {
    fontWeight: '500',
    color: '#0F172A',
  },
  priceSuggestion: {
    fontFamily: theme.typography.fontFamily,
    fontSize: 14,
    color: '#475569',
    marginBottom: 16,
  },
  priceHighlight: {
    fontWeight: '700',
    color: '#E11D48',
  },
  bidActionContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  bidInput: {
    flex: 1,
    height: 48,
    borderWidth: 1,
    borderColor: '#CBD5E1',
    borderRadius: 12,
    paddingHorizontal: 16,
    marginRight: 12,
    fontFamily: theme.typography.fontFamily,
    fontSize: 15,
    color: '#0F172A',
  },
  bidButton: {
    backgroundColor: '#2563EB',
    height: 48,
    paddingHorizontal: 20,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
  },
  bidButtonText: {
    fontFamily: theme.typography.fontFamily,
    fontSize: 15,
    fontWeight: '600',
    color: '#FFFFFF',
  },
});

export default DriverHomeScreen;
