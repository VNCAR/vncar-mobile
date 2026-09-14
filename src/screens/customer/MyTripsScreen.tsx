import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Platform,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import Svg, { Path, Circle, Rect } from 'react-native-svg';
import { theme } from '../../theme';

// --- Icons ---

const ClockIcon = () => (
  <Svg width="14" height="14" viewBox="0 0 24 24" fill="none">
    <Circle cx="12" cy="12" r="9" stroke="#94A3B8" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
    <Path d="M12 7V12L15 15" stroke="#94A3B8" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
  </Svg>
);

const CalendarIcon = () => (
  <Svg width="14" height="14" viewBox="0 0 24 24" fill="none">
    <Rect x="3" y="4" width="18" height="18" rx="2" ry="2" stroke="#94A3B8" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
    <Path d="M16 2V6M8 2V6M3 10H21" stroke="#94A3B8" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
  </Svg>
);

const StarIcon = () => (
  <Svg width="12" height="12" viewBox="0 0 24 24" fill="none">
    <Path d="M12 2L15.09 8.26L22 9.27L17 14.14L18.18 21.02L12 17.77L5.82 21.02L7 14.14L2 9.27L8.91 8.26L12 2Z" fill="#F59E0B" stroke="#F59E0B" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round"/>
  </Svg>
);

const SmallCarIcon = () => (
  <Svg width="14" height="14" viewBox="0 0 24 24" fill="none">
    <Path d="M5 11L7 6C7.5 4.5 9 3 11 3H13C15 3 16.5 4.5 17 6L19 11M2 19V11H22V19H2ZM2 14H22M6 19V21H9V19M15 19V21H18V19" stroke="#94A3B8" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
    <Circle cx="6.5" cy="15.5" r="1.5" fill="#94A3B8"/>
    <Circle cx="17.5" cy="15.5" r="1.5" fill="#94A3B8"/>
  </Svg>
);

const PassengerIcon = ({ color = "#64748B" }) => (
  <Svg width="14" height="14" viewBox="0 0 24 24" fill="none">
    <Path d="M17 21V19C17 17.9391 16.5786 16.9217 15.8284 16.1716C15.0783 15.4214 14.0609 15 13 15H5C3.93913 15 2.92172 15.4214 2.17157 16.1716C1.42143 16.9217 1 17.9391 1 19V21" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
    <Circle cx="9" cy="7" r="4" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
    <Path d="M23 21V19C22.9993 18.1137 22.7044 17.2528 22.1614 16.5523C21.6184 15.8519 20.8581 15.3516 20 15.13" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
    <Path d="M16 3.13C16.8604 3.35031 17.623 3.85071 18.1676 4.55232C18.7122 5.25392 19.0078 6.11683 19.0078 7.005C19.0078 7.89318 18.7122 8.75608 18.1676 9.45768C17.623 10.1593 16.8604 10.6597 16 10.88" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
  </Svg>
);

const CheckIcon = () => (
  <Svg width="10" height="10" viewBox="0 0 24 24" fill="none">
    <Path d="M20 6L9 17L4 12" stroke="#16A34A" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"/>
  </Svg>
);

const ArrowRightIcon = () => (
  <Svg width="14" height="14" viewBox="0 0 24 24" fill="none">
    <Path d="M5 12H19M19 12L12 5M19 12L12 19" stroke="#94A3B8" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
  </Svg>
);

const ChevronRightSmall = ({ color = "#2563EB" }) => (
  <Svg width="12" height="12" viewBox="0 0 24 24" fill="none">
    <Path d="M9 18L15 12L9 6" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
  </Svg>
);

// Bottom Nav Icons
const HomeIcon = () => (
  <Svg width="24" height="24" viewBox="0 0 24 24" fill="none">
    <Path d="M3 9L12 2L21 9V20C21 20.5304 20.7893 21.0391 20.4142 21.4142C20.0391 21.7893 19.5304 22 19 22H5C4.46957 22 3.96086 21.7893 3.58579 21.4142C3.21071 21.0391 3 20.5304 3 20V9Z" stroke="#94A3B8" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
    <Path d="M9 22V12H15V22" stroke="#94A3B8" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
  </Svg>
);

const DocumentIconActive = () => (
  <Svg width="24" height="24" viewBox="0 0 24 24" fill="none">
    <Path d="M14 2H6C5.46957 2 4.96086 2.21071 4.58579 2.58579C4.21071 2.96086 4 3.46957 4 4V20C4 20.5304 4.21071 21.0391 4.58579 21.4142C4.96086 21.7893 5.46957 22 6 22H18C18.5304 22 19.0391 21.7893 19.4142 21.4142C19.7893 21.0391 20 20.5304 20 20V8L14 2Z" stroke="#2563EB" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
    <Path d="M14 2V8H20" stroke="#2563EB" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
    <Path d="M16 13H8" stroke="#2563EB" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
    <Path d="M16 17H8" stroke="#2563EB" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
    <Path d="M10 9H8" stroke="#2563EB" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
  </Svg>
);

const UserIcon = () => (
  <Svg width="24" height="24" viewBox="0 0 24 24" fill="none">
    <Path d="M20 21V19C20 17.9391 19.5786 16.9217 18.8284 16.1716C18.0783 15.4214 17.0609 15 16 15H8C6.93913 15 5.92172 15.4214 5.17157 16.1716C4.42143 16.9217 4 17.9391 4 19V21" stroke="#94A3B8" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
    <Circle cx="12" cy="7" r="4" stroke="#94A3B8" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
  </Svg>
);

// --- Component ---

const MyTripsScreen = ({ navigation }: any) => {
  const insets = useSafeAreaInsets();
  const [activeTab, setActiveTab] = useState('upcoming');

  return (
    <View style={[styles.container, { paddingTop: insets.top, paddingBottom: insets.bottom }]}>
      
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Chuyến đi của tôi</Text>
        <View style={styles.headerBadge}>
          <View style={styles.dotWhite} />
          <Text style={styles.headerBadgeText}>2 sắp tới</Text>
        </View>
      </View>

      {/* Tabs */}
      <View style={styles.tabContainer}>
        <TouchableOpacity 
          style={[styles.tabButton, activeTab === 'upcoming' && styles.tabButtonActive]}
          onPress={() => setActiveTab('upcoming')}
        >
          <Text style={[styles.tabText, activeTab === 'upcoming' && styles.tabTextActive]}>Sắp tới</Text>
          <View style={[styles.countBadge, activeTab === 'upcoming' && styles.countBadgeActive]}>
            <Text style={[styles.countText, activeTab === 'upcoming' && styles.countTextActive]}>2</Text>
          </View>
        </TouchableOpacity>

        <TouchableOpacity 
          style={[styles.tabButton, activeTab === 'completed' && styles.tabButtonActive]}
          onPress={() => setActiveTab('completed')}
        >
          <Text style={[styles.tabText, activeTab === 'completed' && styles.tabTextActive]}>Đã hoàn thành</Text>
          <View style={[styles.countBadge, activeTab === 'completed' && styles.countBadgeActive]}>
            <Text style={[styles.countText, activeTab === 'completed' && styles.countTextActive]}>2</Text>
          </View>
        </TouchableOpacity>
      </View>

      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        
        <Text style={styles.sectionTitle}>CHUYẾN SẮP TỚI</Text>

        {/* Trip Card 1 */}
        <View style={styles.card}>
          
          {/* Route & Status */}
          <View style={styles.cardHeader}>
            <View style={styles.routeContainer}>
              <View style={styles.blueDot} />
              <Text style={styles.routeText}>Hà Nội</Text>
              <View style={styles.arrowContainer}><ArrowRightIcon /></View>
              <View style={styles.greenSquare} />
              <Text style={styles.routeText}>Hải Phòng</Text>
            </View>
            <View style={styles.statusPillSuccess}>
              <CheckIcon />
              <Text style={styles.statusTextSuccess}>Đã xác nhận</Text>
            </View>
          </View>

          {/* Date & Time */}
          <View style={styles.dateTimeRow}>
            <ClockIcon />
            <Text style={styles.dateTimeText}>08:00</Text>
            <Text style={styles.dotSeparator}>•</Text>
            <CalendarIcon />
            <Text style={styles.dateTimeText}>12 thg 9, 2026</Text>
          </View>

          <View style={styles.divider} />

          {/* Driver & Passenger Info */}
          <View style={styles.infoRow}>
            <View style={styles.driverSection}>
              <View style={styles.avatar}>
                <Text style={styles.avatarText}>NA</Text>
              </View>
              <View>
                <Text style={styles.driverName}>Nguyễn Văn A</Text>
                <View style={styles.driverMetaRow}>
                  <StarIcon />
                  <Text style={styles.metaText}>4.9</Text>
                  <Text style={styles.dotSeparatorSmall}>•</Text>
                  <SmallCarIcon />
                  <Text style={styles.metaText}>Kia K3</Text>
                </View>
                <View style={styles.seatsPill}>
                  <PassengerIcon color="#16A34A" />
                  <Text style={styles.seatsText}>Còn 2 chỗ trống</Text>
                </View>
              </View>
            </View>
            
            <View style={styles.passengerSection}>
              <View style={styles.passengerCountRow}>
                <PassengerIcon />
                <Text style={styles.passengerCountText}>2 người</Text>
              </View>
              <Text style={styles.priceText}>300.000đ</Text>
              <Text style={styles.priceSubtext}>/ người</Text>
            </View>
          </View>

          <View style={styles.divider} />

          {/* Details Button */}
          <TouchableOpacity style={styles.detailsBtn}>
            <Text style={styles.detailsText}>Xem chi tiết</Text>
            <ChevronRightSmall />
          </TouchableOpacity>
        </View>

        {/* Trip Card 2 */}
        <View style={styles.card}>
          
          {/* Route & Status */}
          <View style={styles.cardHeader}>
            <View style={styles.routeContainer}>
              <View style={styles.blueDot} />
              <Text style={styles.routeText}>Hà Nội</Text>
              <View style={styles.arrowContainer}><ArrowRightIcon /></View>
              <View style={styles.greenSquare} />
              <Text style={styles.routeText}>Ninh Bình</Text>
            </View>
            <View style={styles.statusPillWarning}>
              <View style={styles.dotOrange} />
              <Text style={styles.statusTextWarning}>Chờ xác nhận</Text>
            </View>
          </View>

          {/* Date & Time */}
          <View style={styles.dateTimeRow}>
            <ClockIcon />
            <Text style={styles.dateTimeText}>14:30</Text>
            <Text style={styles.dotSeparator}>•</Text>
            <CalendarIcon />
            <Text style={styles.dateTimeText}>15 thg 9, 2026</Text>
          </View>

          <View style={styles.divider} />

          {/* Driver & Passenger Info */}
          <View style={styles.infoRow}>
            <View style={styles.driverSection}>
              <View style={[styles.avatar, { backgroundColor: '#7C3AED' }]}>
                <Text style={styles.avatarText}>TB</Text>
              </View>
              <View>
                <Text style={styles.driverName}>Trần Thị B</Text>
                <View style={styles.driverMetaRow}>
                  <StarIcon />
                  <Text style={styles.metaText}>4.7</Text>
                  <Text style={styles.dotSeparatorSmall}>•</Text>
                  <SmallCarIcon />
                  <Text style={styles.metaText}>Toyota Vios</Text>
                </View>
                <View style={styles.seatsPill}>
                  <PassengerIcon color="#16A34A" />
                  <Text style={styles.seatsText}>Còn 3 chỗ trống</Text>
                </View>
              </View>
            </View>
            
            <View style={styles.passengerSection}>
              <View style={styles.passengerCountRow}>
                <PassengerIcon />
                <Text style={styles.passengerCountText}>1 người</Text>
              </View>
              <Text style={styles.priceText}>180.000đ</Text>
              <Text style={styles.priceSubtext}>/ người</Text>
            </View>
          </View>

          <View style={styles.divider} />

          {/* Details Button */}
          <TouchableOpacity style={styles.detailsBtn}>
            <Text style={styles.detailsText}>Xem chi tiết</Text>
            <ChevronRightSmall />
          </TouchableOpacity>
        </View>

      </ScrollView>

      {/* Bottom Navigation */}
      <View style={styles.bottomNav}>
        <TouchableOpacity style={styles.navItem} onPress={() => navigation.navigate('PassengerHome')}>
          <HomeIcon />
          <Text style={styles.navText}>Trang chủ</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.navItemActive}>
          <DocumentIconActive />
          <Text style={styles.navTextActive}>Chuyến đi</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.navItem} onPress={() => navigation.navigate('CustomerAccount')}>
          <UserIcon />
          <Text style={styles.navText}>Tài khoản</Text>
        </TouchableOpacity>
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
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingTop: 16,
    paddingBottom: 16,
  },
  headerTitle: {
    fontFamily: theme.typography.fontFamily,
    fontSize: 20,
    fontWeight: '700',
    color: '#0F172A',
  },
  headerBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#2563EB',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
    height: 24,
  },
  dotWhite: {
    width: 4,
    height: 4,
    borderRadius: 2,
    backgroundColor: '#FFFFFF',
    marginRight: 6,
  },
  headerBadgeText: {
    fontFamily: theme.typography.fontFamily,
    fontSize: 11,
    fontWeight: '600',
    color: '#FFFFFF',
  },
  tabContainer: {
    flexDirection: 'row',
    paddingHorizontal: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#E2E8F0',
  },
  tabButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    marginRight: 24,
    borderBottomWidth: 2,
    borderBottomColor: 'transparent',
  },
  tabButtonActive: {
    borderBottomColor: '#2563EB',
  },
  tabText: {
    fontFamily: theme.typography.fontFamily,
    fontSize: 14,
    fontWeight: '500',
    color: '#64748B',
    marginRight: 6,
  },
  tabTextActive: {
    fontWeight: '600',
    color: '#2563EB',
  },
  countBadge: {
    backgroundColor: '#F1F5F9',
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 10,
  },
  countBadgeActive: {
    backgroundColor: '#2563EB',
  },
  countText: {
    fontFamily: theme.typography.fontFamily,
    fontSize: 10,
    fontWeight: '600',
    color: '#64748B',
  },
  countTextActive: {
    color: '#FFFFFF',
  },
  scrollContent: {
    paddingHorizontal: 16,
    paddingTop: 16,
    paddingBottom: 100, // Space for bottom nav
  },
  sectionTitle: {
    fontFamily: theme.typography.fontFamily,
    fontSize: 11,
    fontWeight: '600',
    color: '#64748B',
    textTransform: 'uppercase',
    letterSpacing: 0.5,
    marginBottom: 12,
    marginLeft: 4,
  },
  card: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    padding: 16,
    marginBottom: 16,
    shadowColor: '#0F172A',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.02,
    shadowRadius: 8,
    elevation: 1,
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  routeContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  blueDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#2563EB',
    marginRight: 8,
  },
  greenSquare: {
    width: 8,
    height: 8,
    borderRadius: 2,
    backgroundColor: '#16A34A',
    marginRight: 8,
  },
  routeText: {
    fontFamily: theme.typography.fontFamily,
    fontSize: 14,
    fontWeight: '600',
    color: '#0F172A',
  },
  arrowContainer: {
    marginHorizontal: 4,
  },
  statusPillSuccess: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#DCFCE7',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  statusTextSuccess: {
    fontFamily: theme.typography.fontFamily,
    fontSize: 10,
    fontWeight: '600',
    color: '#16A34A',
    marginLeft: 4,
  },
  statusPillWarning: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FEF3C7',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  dotOrange: {
    width: 4,
    height: 4,
    borderRadius: 2,
    backgroundColor: '#F59E0B',
  },
  statusTextWarning: {
    fontFamily: theme.typography.fontFamily,
    fontSize: 10,
    fontWeight: '600',
    color: '#F59E0B',
    marginLeft: 4,
  },
  dateTimeRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  dateTimeText: {
    fontFamily: theme.typography.fontFamily,
    fontSize: 12,
    color: '#64748B',
    marginLeft: 6,
  },
  dotSeparator: {
    color: '#94A3B8',
    marginHorizontal: 8,
    fontSize: 10,
  },
  divider: {
    height: 1,
    backgroundColor: '#F1F5F9',
    marginVertical: 12,
  },
  infoRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  driverSection: {
    flexDirection: 'row',
  },
  avatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#2563EB',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  avatarText: {
    fontFamily: theme.typography.fontFamily,
    fontSize: 14,
    fontWeight: '600',
    color: '#FFFFFF',
  },
  driverName: {
    fontFamily: theme.typography.fontFamily,
    fontSize: 14,
    fontWeight: '600',
    color: '#0F172A',
    marginBottom: 2,
  },
  driverMetaRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 6,
  },
  metaText: {
    fontFamily: theme.typography.fontFamily,
    fontSize: 11,
    color: '#64748B',
    marginLeft: 4,
  },
  dotSeparatorSmall: {
    color: '#E2E8F0',
    marginHorizontal: 6,
    fontSize: 10,
  },
  seatsPill: {
    flexDirection: 'row',
    alignItems: 'center',
    alignSelf: 'flex-start',
    backgroundColor: '#F0FDF4',
    borderWidth: 1,
    borderColor: '#DCFCE7',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 8,
  },
  seatsText: {
    fontFamily: theme.typography.fontFamily,
    fontSize: 10,
    fontWeight: '500',
    color: '#16A34A',
    marginLeft: 4,
  },
  passengerSection: {
    alignItems: 'flex-end',
  },
  passengerCountRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 4,
  },
  passengerCountText: {
    fontFamily: theme.typography.fontFamily,
    fontSize: 12,
    color: '#64748B',
    marginLeft: 4,
  },
  priceText: {
    fontFamily: theme.typography.fontFamily,
    fontSize: 15,
    fontWeight: '700',
    color: '#2563EB',
  },
  priceSubtext: {
    fontFamily: theme.typography.fontFamily,
    fontSize: 10,
    color: '#94A3B8',
    marginTop: 2,
  },
  detailsBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 4,
  },
  detailsText: {
    fontFamily: theme.typography.fontFamily,
    fontSize: 13,
    fontWeight: '600',
    color: '#2563EB',
    marginRight: 4,
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

export default MyTripsScreen;
