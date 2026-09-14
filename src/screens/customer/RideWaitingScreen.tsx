import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  ActivityIndicator,
  Alert
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { theme } from '../../theme';
import auth from '@react-native-firebase/auth';
import { io, Socket } from 'socket.io-client';

const API_URL = 'http://localhost:3000';

interface Bid {
  id: string;
  price: number;
  driverId: string;
  driver: {
    name: string;
    phone: string;
    rating: number;
    vehicleFrontUrl: string;
  };
}

const RideWaitingScreen = ({ route, navigation }: any) => {
  const { rideId } = route.params;
  const insets = useSafeAreaInsets();
  const [socket, setSocket] = useState<Socket | null>(null);
  const [bids, setBids] = useState<Bid[]>([]);

  useEffect(() => {
    // Connect to Socket.IO
    const newSocket = io(API_URL);
    setSocket(newSocket);

    newSocket.on('connect', () => {
      console.log('Customer connected to Socket.IO, joining room for ride:', rideId);
      newSocket.emit('join_ride', rideId);
    });

    newSocket.on('new_bid', (bid: Bid) => {
      console.log('New bid received:', bid);
      setBids((prevBids) => {
        // Cập nhật lại giá nếu tài xế gửi giá mới, hoặc thêm vào danh sách
        const existingIndex = prevBids.findIndex(b => b.driverId === bid.driverId);
        if (existingIndex >= 0) {
          const newBids = [...prevBids];
          newBids[existingIndex] = bid;
          return newBids;
        }
        return [bid, ...prevBids];
      });
    });

    newSocket.on('ride_accepted', (data) => {
      if (data.rideId === rideId) {
        Alert.alert('Thành công', 'Chuyến đi đã được xác nhận!', [
          { text: 'OK', onPress: () => navigation.replace('PassengerHomeScreen') } // Tạm thời quay về Home
        ]);
      }
    });

    return () => {
      newSocket.disconnect();
    };
  }, [rideId]);

  const handleAcceptBid = (bidId: string, driverId: string) => {
    if (socket) {
      socket.emit('accept_bid', {
        rideId,
        bidId,
        driverId
      });
    }
  };

  const renderBidItem = ({ item }: { item: Bid }) => (
    <View style={styles.bidCard}>
      <View style={styles.bidInfo}>
        <Text style={styles.driverName}>{item.driver.name} (⭐ {item.driver.rating})</Text>
        <Text style={styles.driverPhone}>📞 {item.driver.phone}</Text>
        <Text style={styles.priceLabel}>Mức giá đưa ra: <Text style={styles.priceHighlight}>{item.price.toLocaleString()}đ</Text></Text>
      </View>
      
      <TouchableOpacity 
        style={styles.acceptButton}
        onPress={() => handleAcceptBid(item.id, item.driverId)}
      >
        <Text style={styles.acceptButtonText}>Chấp Nhận</Text>
      </TouchableOpacity>
    </View>
  );

  return (
    <View style={[styles.container, { paddingTop: insets.top, paddingBottom: insets.bottom }]}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Đang Tìm Tài Xế...</Text>
      </View>

      <View style={styles.radarContainer}>
        <ActivityIndicator size="large" color="#2563EB" />
        <Text style={styles.radarText}>Đang chờ các tài xế trả giá</Text>
      </View>

      <View style={styles.listContainer}>
        <Text style={styles.listTitle}>Danh sách báo giá ({bids.length})</Text>
        <FlatList
          data={bids.sort((a, b) => a.price - b.price)} // Sắp xếp giá từ thấp đến cao
          keyExtractor={(item) => item.id}
          renderItem={renderBidItem}
          contentContainerStyle={styles.listContent}
          showsVerticalScrollIndicator={false}
        />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F8FAFC',
  },
  header: {
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
  radarContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 40,
  },
  radarText: {
    fontFamily: theme.typography.fontFamily,
    fontSize: 14,
    color: '#64748B',
    marginTop: 12,
  },
  listContainer: {
    flex: 1,
    backgroundColor: '#FFFFFF',
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    paddingTop: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: -2 },
    shadowOpacity: 0.05,
    shadowRadius: 10,
    elevation: 5,
  },
  listTitle: {
    fontFamily: theme.typography.fontFamily,
    fontSize: 16,
    fontWeight: '700',
    color: '#0F172A',
    paddingHorizontal: 20,
    marginBottom: 12,
  },
  listContent: {
    paddingHorizontal: 20,
    paddingBottom: 20,
  },
  bidCard: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 16,
    backgroundColor: '#F8FAFC',
    borderRadius: 12,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: '#E2E8F0',
  },
  bidInfo: {
    flex: 1,
  },
  driverName: {
    fontFamily: theme.typography.fontFamily,
    fontSize: 15,
    fontWeight: '700',
    color: '#1E293B',
    marginBottom: 4,
  },
  driverPhone: {
    fontFamily: theme.typography.fontFamily,
    fontSize: 13,
    color: '#64748B',
    marginBottom: 8,
  },
  priceLabel: {
    fontFamily: theme.typography.fontFamily,
    fontSize: 14,
    color: '#475569',
  },
  priceHighlight: {
    fontWeight: '700',
    color: '#10B981', // Màu xanh cho giá tiền
  },
  acceptButton: {
    backgroundColor: '#10B981',
    paddingVertical: 10,
    paddingHorizontal: 16,
    borderRadius: 8,
    marginLeft: 12,
  },
  acceptButtonText: {
    fontFamily: theme.typography.fontFamily,
    fontSize: 14,
    fontWeight: '600',
    color: '#FFFFFF',
  },
});

export default RideWaitingScreen;
