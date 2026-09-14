import React from 'react';
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

const SunIcon = () => (
  <Svg width="18" height="18" viewBox="0 0 24 24" fill="none">
    <Circle cx="12" cy="12" r="4" stroke="#64748B" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
    <Path d="M12 2V4M12 20V22M4.93 4.93L6.34 6.34M17.66 17.66L19.07 19.07M2 12H4M20 12H22M4.93 19.07L6.34 17.66M17.66 6.34L19.07 4.93" stroke="#64748B" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
  </Svg>
);

const PencilIcon = () => (
  <Svg width="12" height="12" viewBox="0 0 24 24" fill="none">
    <Path d="M17 3C17.2626 2.73735 17.5744 2.52901 17.9176 2.38687C18.2608 2.24473 18.6286 2.17157 19 2.17157C19.3714 2.17157 19.7392 2.24473 20.0824 2.38687C20.4256 2.52901 20.7374 2.73735 21 3C21.2626 3.26264 21.471 3.57444 21.6131 3.9176C21.7553 4.26077 21.8284 4.62856 21.8284 5C21.8284 5.37143 21.7553 5.73923 21.6131 6.08239C21.471 6.42555 21.2626 6.73735 21 7L7.5 20.5L2 22L3.5 16.5L17 3Z" stroke="#2563EB" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
  </Svg>
);

const UserOutlineIcon = () => (
  <Svg width="20" height="20" viewBox="0 0 24 24" fill="none">
    <Path d="M20 21V19C20 17.9391 19.5786 16.9217 18.8284 16.1716C18.0783 15.4214 17.0609 15 16 15H8C6.93913 15 5.92172 15.4214 5.17157 16.1716C4.42143 16.9217 4 17.9391 4 19V21" stroke="#64748B" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
    <Circle cx="12" cy="7" r="4" stroke="#64748B" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
  </Svg>
);

const CreditCardIcon = () => (
  <Svg width="20" height="20" viewBox="0 0 24 24" fill="none">
    <Rect x="2" y="5" width="20" height="14" rx="2" ry="2" stroke="#64748B" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
    <Path d="M2 10H22" stroke="#64748B" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
  </Svg>
);

const LocationOutlineIcon = () => (
  <Svg width="20" height="20" viewBox="0 0 24 24" fill="none">
    <Path d="M21 10C21 17 12 23 12 23C12 23 3 17 3 10C3 7.61305 3.94821 5.32387 5.63604 3.63604C7.32387 1.94821 9.61305 1 12 1C14.3869 1 16.6761 1.94821 18.364 3.63604C20.0518 5.32387 21 7.61305 21 10Z" stroke="#64748B" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
    <Circle cx="12" cy="10" r="3" stroke="#64748B" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
  </Svg>
);

const BellOutlineIcon = () => (
  <Svg width="20" height="20" viewBox="0 0 24 24" fill="none">
    <Path d="M18 8A6 6 0 0 0 6 8C6 15 3 17 3 17H21C21 17 18 15 18 8Z" stroke="#64748B" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
    <Path d="M13.73 21A2 2 0 0 1 10.27 21" stroke="#64748B" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
  </Svg>
);

const LockOutlineIcon = () => (
  <Svg width="20" height="20" viewBox="0 0 24 24" fill="none">
    <Rect x="3" y="11" width="18" height="11" rx="2" ry="2" stroke="#64748B" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
    <Path d="M7 11V7C7 5.67392 7.52678 4.40215 8.46447 3.46447C9.40215 2.52678 10.6739 2 12 2C13.3261 2 14.5979 2.52678 15.5355 3.46447C16.4732 4.40215 17 5.67392 17 7V11" stroke="#64748B" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
  </Svg>
);

const ChatOutlineIcon = () => (
  <Svg width="20" height="20" viewBox="0 0 24 24" fill="none">
    <Path d="M21 11.5A8.38 8.38 0 0 1 20.9 14C20.6543 15.1953 20.0827 16.2917 19.2559 17.1584C18.429 18.0251 17.3828 18.6236 16.24 18.87C15 19.14 13.5 19.25 12 19.25C10.5 19.25 9 19.14 7.76 18.87C6.61719 18.6236 5.57099 18.0251 4.74413 17.1584C3.91728 16.2917 3.34568 15.1953 3.1 14C2.86 12.76 2.75 11.26 2.75 9.75C2.75 8.24 2.86 6.74 3.1 5.5C3.34568 4.30472 3.91728 3.20828 4.74413 2.34162C5.57099 1.47495 6.61719 0.876352 7.76 0.629999C9 0.359999 10.5 0.25 12 0.25C13.5 0.25 15 0.359999 16.24 0.629999C17.3828 0.876352 18.429 1.47495 19.2559 2.34162C20.0827 3.20828 20.6543 4.30472 20.9 5.5C21.14 6.74 21.25 8.24 21.25 9.75V11.5Z" stroke="#64748B" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
    <Path d="M8 9H16M8 13H12" stroke="#64748B" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
  </Svg>
);

const InfoOutlineIcon = () => (
  <Svg width="20" height="20" viewBox="0 0 24 24" fill="none">
    <Circle cx="12" cy="12" r="10" stroke="#64748B" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
    <Path d="M12 16V12M12 8H12.01" stroke="#64748B" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
  </Svg>
);

const PeopleOutlineIcon = () => (
  <Svg width="24" height="24" viewBox="0 0 24 24" fill="none">
    <Path d="M17 21V19C17 17.9391 16.5786 16.9217 15.8284 16.1716C15.0783 15.4214 14.0609 15 13 15H5C3.93913 15 2.92172 15.4214 2.17157 16.1716C1.42143 16.9217 1 17.9391 1 19V21" stroke="#2563EB" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
    <Circle cx="9" cy="7" r="4" stroke="#2563EB" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
    <Path d="M23 21V19C22.9993 18.1137 22.7044 17.2528 22.1614 16.5523C21.6184 15.8519 20.8581 15.3516 20 15.13" stroke="#2563EB" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
    <Path d="M16 3.13C16.8604 3.35031 17.623 3.85071 18.1676 4.55232C18.7122 5.25392 19.0078 6.11683 19.0078 7.005C19.0078 7.89318 18.7122 8.75608 18.1676 9.45768C17.623 10.1593 16.8604 10.6597 16 10.88" stroke="#2563EB" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
  </Svg>
);

const LogoutIcon = () => (
  <Svg width="18" height="18" viewBox="0 0 24 24" fill="none">
    <Path d="M9 21H5C4.46957 21 3.96086 20.7893 3.58579 20.4142C3.21071 20.0391 3 19.5304 3 19V5C3 4.46957 3.21071 3.96086 3.58579 3.58579C3.96086 3.21071 4.46957 3 5 3H9" stroke="#DC2626" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
    <Path d="M16 17L21 12L16 7" stroke="#DC2626" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
    <Path d="M21 12H9" stroke="#DC2626" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
  </Svg>
);

const ChevronRightIcon = () => (
  <Svg width="14" height="14" viewBox="0 0 24 24" fill="none">
    <Path d="M9 18L15 12L9 6" stroke="#E2E8F0" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
  </Svg>
);

const CheckCircleSolid = () => (
  <Svg width="14" height="14" viewBox="0 0 24 24" fill="none">
    <Circle cx="12" cy="12" r="10" fill="#16A34A" stroke="#FFFFFF" strokeWidth="2" />
    <Path d="M8 12.5L10.5 15L16 9" stroke="#FFFFFF" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
  </Svg>
);

// Bottom Nav Icons
const HomeIcon = () => (
  <Svg width="24" height="24" viewBox="0 0 24 24" fill="none">
    <Path d="M3 9L12 2L21 9V20C21 20.5304 20.7893 21.0391 20.4142 21.4142C20.0391 21.7893 19.5304 22 19 22H5C4.46957 22 3.96086 21.7893 3.58579 21.4142C3.21071 21.0391 3 20.5304 3 20V9Z" stroke="#94A3B8" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
    <Path d="M9 22V12H15V22" stroke="#94A3B8" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
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

const UserIconActive = () => (
  <Svg width="24" height="24" viewBox="0 0 24 24" fill="none">
    <Path d="M20 21V19C20 17.9391 19.5786 16.9217 18.8284 16.1716C18.0783 15.4214 17.0609 15 16 15H8C6.93913 15 5.92172 15.4214 5.17157 16.1716C4.42143 16.9217 4 17.9391 4 19V21" stroke="#2563EB" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
    <Circle cx="12" cy="7" r="4" stroke="#2563EB" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
  </Svg>
);

// --- ListItem Component ---
const ListItem = ({ 
  icon, 
  title, 
  subtitle, 
  showDivider = true, 
  badge = null 
}: any) => (
  <>
    <TouchableOpacity style={styles.listItem} activeOpacity={0.7}>
      <View style={styles.listIconContainer}>
        {icon}
      </View>
      <View style={styles.listTextContainer}>
        <Text style={styles.listTitle}>{title}</Text>
        <Text style={styles.listSubtitle}>{subtitle}</Text>
      </View>
      {badge && (
        <View style={styles.badgeRed}>
          <Text style={styles.badgeRedText}>{badge}</Text>
        </View>
      )}
      <ChevronRightIcon />
    </TouchableOpacity>
    {showDivider && <View style={styles.divider} />}
  </>
);

// --- Main Component ---

const CustomerAccountScreen = ({ navigation }: any) => {
  const insets = useSafeAreaInsets();

  return (
    <View style={[styles.container, { paddingTop: insets.top, paddingBottom: insets.bottom }]}>
      
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Tài khoản</Text>
        <TouchableOpacity style={styles.settingsBtn}>
          <SunIcon />
        </TouchableOpacity>
      </View>
      <View style={styles.headerDivider} />

      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        
        {/* Profile Card */}
        <View style={styles.profileCard}>
          
          <View style={styles.profileLeft}>
            <View style={styles.avatarContainer}>
              <Svg width="32" height="32" viewBox="0 0 24 24" fill="none">
                <Path d="M20 21V19C20 17.9391 19.5786 16.9217 18.8284 16.1716C18.0783 15.4214 17.0609 15 16 15H8C6.93913 15 5.92172 15.4214 5.17157 16.1716C4.42143 16.9217 4 17.9391 4 19V21" fill="#FFFFFF"/>
                <Circle cx="12" cy="7" r="4" fill="#FFFFFF"/>
              </Svg>
              <View style={styles.verifiedBadgeIcon}>
                <CheckCircleSolid />
              </View>
            </View>
          </View>

          <View style={styles.profileCenter}>
            <Text style={styles.profileName}>Nguyễn Văn A</Text>
            <View style={styles.badgesRow}>
              <View style={styles.verifiedBadge}>
                <Text style={styles.verifiedText}>Đã xác thực</Text>
              </View>
              <View style={styles.memberBadge}>
                <Text style={styles.memberText}>Thành viên 8 tháng</Text>
              </View>
            </View>
          </View>

          <View style={styles.profileRight}>
            <TouchableOpacity style={styles.editBtn}>
              <PencilIcon />
              <Text style={styles.editBtnText}>Chỉnh sửa</Text>
            </TouchableOpacity>
          </View>

        </View>

        {/* Section: Tài khoản của tôi */}
        <Text style={styles.sectionTitle}>TÀI KHOẢN CỦA TÔI</Text>
        <View style={styles.listCard}>
          <ListItem 
            icon={<UserOutlineIcon />} 
            title="Thông tin cá nhân" 
            subtitle="Tên, email, số điện thoại" 
          />
          <ListItem 
            icon={<CreditCardIcon />} 
            title="Phương thức thanh toán" 
            subtitle="Thẻ, ví điện tử" 
            badge="1"
          />
          <ListItem 
            icon={<LocationOutlineIcon />} 
            title="Địa chỉ đã lưu" 
            subtitle="Nhà, cơ quan, địa điểm khác" 
            showDivider={false}
          />
        </View>

        {/* Section: Cài đặt */}
        <Text style={styles.sectionTitle}>CÀI ĐẶT</Text>
        <View style={styles.listCard}>
          <ListItem 
            icon={<BellOutlineIcon />} 
            title="Thông báo" 
            subtitle="Đặt xe, khuyến mãi, cập nhật" 
            badge="3"
          />
          <ListItem 
            icon={<LockOutlineIcon />} 
            title="Tài khoản & Bảo mật" 
            subtitle="Mật khẩu, xác thực 2 lớp" 
          />
          <ListItem 
            icon={<SunIcon />} 
            title="Cài đặt ứng dụng" 
            subtitle="Ngôn ngữ, chủ đề, thông báo" 
            showDivider={false}
          />
        </View>

        {/* Section: Hỗ trợ */}
        <Text style={styles.sectionTitle}>HỖ TRỢ</Text>
        <View style={styles.listCard}>
          <ListItem 
            icon={<ChatOutlineIcon />} 
            title="Trung tâm hỗ trợ" 
            subtitle="Câu hỏi thường gặp, liên hệ" 
          />
          <ListItem 
            icon={<InfoOutlineIcon />} 
            title="Về Vicar" 
            subtitle="Phiên bản 2.4.1 · Điều khoản & Chính sách" 
            showDivider={false}
          />
        </View>

        {/* Referral Card */}
        <View style={styles.referralCard}>
          <View style={styles.referralIconBox}>
            <PeopleOutlineIcon />
          </View>
          <View style={styles.referralTextGroup}>
            <Text style={styles.referralTitle}>Mời bạn bè, nhận ưu đãi</Text>
            <Text style={styles.referralSubtitle}>Mời người bạn giới thiệu,{"\n"}nhận 50.000đ vào tài khoản.</Text>
          </View>
          <TouchableOpacity style={styles.referralBtn}>
            <Text style={styles.referralBtnText}>Mời ngay</Text>
          </TouchableOpacity>
        </View>

        {/* Logout */}
        <TouchableOpacity 
          style={styles.logoutBtn} 
          onPress={async () => {
            try {
              const auth = require('@react-native-firebase/auth').default;
              await auth().signOut();
            } catch (e) {
              console.error(e);
            }
          }}
        >
          <LogoutIcon />
          <Text style={styles.logoutText}>Đăng xuất</Text>
        </TouchableOpacity>

        {/* Version */}
        <Text style={styles.versionText}>Vicar · Phiên bản 2.4.1</Text>

      </ScrollView>

      {/* Bottom Navigation */}
      <View style={styles.bottomNav}>
        <TouchableOpacity style={styles.navItem} onPress={() => navigation.navigate('PassengerHome')}>
          <HomeIcon />
          <Text style={styles.navText}>Trang chủ</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.navItem} onPress={() => navigation.navigate('MyTrips')}>
          <DocumentIcon />
          <Text style={styles.navText}>Chuyến đi</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.navItemActive}>
          <UserIconActive />
          <Text style={styles.navTextActive}>Tài khoản</Text>
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
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
    position: 'relative',
  },
  headerTitle: {
    fontFamily: theme.typography.fontFamily,
    fontSize: 20,
    fontWeight: '700',
    color: '#0F172A',
  },
  settingsBtn: {
    position: 'absolute',
    right: 16,
    width: 36,
    height: 36,
    borderRadius: 12,
    backgroundColor: '#F1F5F9',
    alignItems: 'center',
    justifyContent: 'center',
  },
  headerDivider: {
    height: 1,
    backgroundColor: '#E2E8F0',
  },
  scrollContent: {
    paddingHorizontal: 16,
    paddingTop: 16,
    paddingBottom: 120, // Space for bottom nav
  },
  profileCard: {
    flexDirection: 'row',
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    padding: 16,
    alignItems: 'center',
    marginBottom: 24,
    shadowColor: '#0F172A',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.03,
    shadowRadius: 12,
    elevation: 2,
  },
  profileLeft: {
    marginRight: 12,
  },
  avatarContainer: {
    width: 58,
    height: 58,
    borderRadius: 29,
    backgroundColor: '#2563EB',
    alignItems: 'center',
    justifyContent: 'center',
    position: 'relative',
  },
  verifiedBadgeIcon: {
    position: 'absolute',
    bottom: -2,
    right: -2,
  },
  profileCenter: {
    flex: 1,
  },
  profileName: {
    fontFamily: theme.typography.fontFamily,
    fontSize: 17,
    fontWeight: '700',
    color: '#0F172A',
    marginBottom: 6,
  },
  badgesRow: {
    flexDirection: 'row',
    alignItems: 'center',
    flexWrap: 'wrap',
  },
  verifiedBadge: {
    backgroundColor: '#ECFDF5',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 8,
    marginRight: 6,
    marginBottom: 4,
  },
  verifiedText: {
    fontFamily: theme.typography.fontFamily,
    fontSize: 10,
    fontWeight: '600',
    color: '#16A34A',
  },
  memberBadge: {
    backgroundColor: '#F1F5F9',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 8,
    marginBottom: 4,
  },
  memberText: {
    fontFamily: theme.typography.fontFamily,
    fontSize: 10,
    fontWeight: '500',
    color: '#64748B',
  },
  profileRight: {
    marginLeft: 8,
  },
  editBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: '#BFDBFE',
    backgroundColor: '#EFF6FF',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 12,
  },
  editBtnText: {
    fontFamily: theme.typography.fontFamily,
    fontSize: 12,
    fontWeight: '600',
    color: '#2563EB',
    marginLeft: 6,
  },
  sectionTitle: {
    fontFamily: theme.typography.fontFamily,
    fontSize: 11,
    fontWeight: '600',
    color: '#64748B',
    textTransform: 'uppercase',
    letterSpacing: 0.5,
    marginBottom: 8,
    marginLeft: 4,
  },
  listCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    marginBottom: 24,
    shadowColor: '#0F172A',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.02,
    shadowRadius: 8,
    elevation: 1,
  },
  listItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
  },
  listIconContainer: {
    width: 40,
    height: 40,
    borderRadius: 12,
    backgroundColor: '#F8FAFC',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 16,
  },
  listTextContainer: {
    flex: 1,
  },
  listTitle: {
    fontFamily: theme.typography.fontFamily,
    fontSize: 14,
    fontWeight: '600',
    color: '#0F172A',
    marginBottom: 2,
  },
  listSubtitle: {
    fontFamily: theme.typography.fontFamily,
    fontSize: 11,
    color: '#64748B',
  },
  badgeRed: {
    backgroundColor: '#DC2626',
    width: 18,
    height: 18,
    borderRadius: 9,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  badgeRedText: {
    fontFamily: theme.typography.fontFamily,
    fontSize: 10,
    fontWeight: '700',
    color: '#FFFFFF',
  },
  divider: {
    height: 1,
    backgroundColor: '#F1F5F9',
    marginLeft: 72, // Align with text
  },
  referralCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F0FDF4', // Very light green tint
    borderWidth: 1,
    borderColor: '#DCFCE7',
    borderRadius: 14,
    padding: 12,
    marginBottom: 32,
  },
  referralIconBox: {
    width: 44,
    height: 44,
    borderRadius: 12,
    backgroundColor: '#FFFFFF',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  referralTextGroup: {
    flex: 1,
  },
  referralTitle: {
    fontFamily: theme.typography.fontFamily,
    fontSize: 13,
    fontWeight: '600',
    color: '#0F172A',
    marginBottom: 2,
  },
  referralSubtitle: {
    fontFamily: theme.typography.fontFamily,
    fontSize: 11,
    color: '#64748B',
    lineHeight: 16,
  },
  referralBtn: {
    backgroundColor: '#2563EB',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 10,
  },
  referralBtnText: {
    fontFamily: theme.typography.fontFamily,
    fontSize: 12,
    fontWeight: '600',
    color: '#FFFFFF',
  },
  logoutBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 12,
    marginBottom: 16,
  },
  logoutText: {
    fontFamily: theme.typography.fontFamily,
    fontSize: 14,
    fontWeight: '600',
    color: '#DC2626',
    marginLeft: 8,
  },
  versionText: {
    fontFamily: theme.typography.fontFamily,
    fontSize: 11,
    color: '#94A3B8',
    textAlign: 'center',
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

export default CustomerAccountScreen;
