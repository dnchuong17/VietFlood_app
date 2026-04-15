import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  SafeAreaView,
  TouchableOpacity,
  FlatList,
  Linking,
} from 'react-native';
import { colors, spacing } from '../../lib/styling';
import { Card, Button, ConfirmDialog } from '../../components';

interface EmergencyContact {
  id: string;
  name: string;
  type: 'police' | 'ambulance' | 'fire' | 'relief_center' | 'volunteer';
  phone: string;
  address?: string;
  hours?: string;
  distance?: string;
}

export function EmergencyContactsScreen({ navigation }: any) {
  const [showEmergencyAlert, setShowEmergencyAlert] = useState(false);
  const [selectedContact, setSelectedContact] = useState<EmergencyContact | null>(null);

  const emergencyContacts: EmergencyContact[] = [
    {
      id: '1',
      name: 'Cảnh sát Hà Nội',
      type: 'police',
      phone: '113',
      hours: '24/7',
    },
    {
      id: '2',
      name: 'Cấp cứu Y tế',
      type: 'ambulance',
      phone: '115',
      hours: '24/7',
    },
    {
      id: '3',
      name: 'Cảnh sát Phòng cháy',
      type: 'fire',
      phone: '114',
      hours: '24/7',
    },
    {
      id: '4',
      name: 'Trung tâm phòng chống lũ Hà Nội',
      type: 'relief_center',
      phone: '(024) 3942-1234',
      address: '123 Đường Hùng Vương, Ba Đình, Hà Nội',
      distance: '0.8 km từ bạn',
    },
    {
      id: '5',
      name: 'Tổ chức Lê Hồng Phong',
      type: 'relief_center',
      phone: '(024) 3968-5678',
      address: '456 Đường Tây Sơn, Đống Đa, Hà Nội',
      distance: '1.2 km từ bạn',
    },
    {
      id: '6',
      name: 'Đội cứu trợ Phường Đội Cấn',
      type: 'volunteer',
      phone: '(024) 3771-9876',
      address: 'Phường Đội Cấn, Ba Đình, Hà Nội',
      distance: '0.5 km từ bạn',
    },
  ];

  const handleCall = (phone: string) => {
    Linking.openURL(`tel:${phone}`).catch(() => {
      alert('Không thể gọi số này');
    });
  };

  const handleSendSOS = () => {
    setShowEmergencyAlert(false);
    alert('Tín hiệu SOS đã được gửi tới trung tâm cứu trợ gần nhất');
  };

  const getContactTypeIcon = (type: EmergencyContact['type']) => {
    switch (type) {
      case 'police':
        return '🚔';
      case 'ambulance':
        return '🚑';
      case 'fire':
        return '🚒';
      case 'relief_center':
        return '🏥';
      case 'volunteer':
        return '👥';
    }
  };

  const getContactTypeLabel = (type: EmergencyContact['type']) => {
    switch (type) {
      case 'police':
        return 'Cảnh sát';
      case 'ambulance':
        return 'Cấp cứu';
      case 'fire':
        return 'Phòng chữa cháy';
      case 'relief_center':
        return 'Trung tâm cứu trợ';
      case 'volunteer':
        return 'Đội tình nguyện viên';
    }
  };

  const renderContact = ({ item }: { item: EmergencyContact }) => (
    <TouchableOpacity activeOpacity={0.7} onPress={() => setSelectedContact(item)}>
      <Card style={styles.contactCard}>
        <View style={styles.contactHeader}>
          <View style={styles.iconContainer}>
            <Text style={styles.typeIcon}>{getContactTypeIcon(item.type)}</Text>
          </View>
          <View style={styles.contactInfo}>
            <Text style={styles.contactName}>{item.name}</Text>
            <Text style={styles.contactType}>{getContactTypeLabel(item.type)}</Text>
          </View>
        </View>

        {item.address && (
          <View style={styles.contactDetails}>
            <Text style={styles.detailLabel}>📍 {item.address}</Text>
            {item.distance && <Text style={styles.distanceLabel}>{item.distance}</Text>}
          </View>
        )}

        <View style={styles.contactFooter}>
          <TouchableOpacity
            style={styles.callButton}
            onPress={() => handleCall(item.phone)}
          >
            <Text style={styles.callIcon}>☎️</Text>
            <Text style={styles.callText}>{item.phone}</Text>
          </TouchableOpacity>
          {item.hours && (
            <View style={styles.hoursLabel}>
              <Text style={styles.hoursText}>{item.hours}</Text>
            </View>
          )}
        </View>
      </Card>
    </TouchableOpacity>
  );

  const emergencyOnly = emergencyContacts.filter((c) =>
    ['police', 'ambulance', 'fire'].includes(c.type)
  );
  const reliefContacts = emergencyContacts.filter(
    (c) => c.type === 'relief_center' || c.type === 'volunteer'
  );

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation?.goBack()}>
          <Text style={styles.backButton}>← Quay lại</Text>
        </TouchableOpacity>
        <Text style={styles.title}>Liên Hệ Khẩn Cấp</Text>
      </View>

      <ScrollView showsVerticalScrollIndicator={false} style={styles.content}>
        {/* SOS Button */}
        <TouchableOpacity
          style={styles.sosButton}
          onPress={() => setShowEmergencyAlert(true)}
        >
          <Text style={styles.sosIcon}>🆘</Text>
          <View style={styles.sosContent}>
            <Text style={styles.sosLabel}>GỌI CẤP CỨU</Text>
            <Text style={styles.sosDescription}>Gửi tín hiệu khẩn cấp</Text>
          </View>
          <Text style={styles.sosArrow}>›</Text>
        </TouchableOpacity>

        {/* Emergency Numbers */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>🆘 Số Liên Hệ Khẩn Cấp</Text>
          <FlatList
            data={emergencyOnly}
            renderItem={renderContact}
            keyExtractor={(item) => item.id}
            scrollEnabled={false}
          />
        </View>

        {/* Relief Centers & Volunteers */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>🏥 Trung Tâm & Đội Cứu Trợ</Text>
          <FlatList
            data={reliefContacts}
            renderItem={renderContact}
            keyExtractor={(item) => item.id}
            scrollEnabled={false}
          />
        </View>

        {/* Quick Tips */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>💡 Mẹo An Toàn</Text>
          <Card>
            <View style={styles.tipItem}>
              <Text style={styles.tipNumber}>1</Text>
              <View style={styles.tipContent}>
                <Text style={styles.tipTitle}>Luôn giữ điện thoại sạc</Text>
                <Text style={styles.tipDescription}>
                  Điều này rất quan trọng trong trường hợp khẩn cấp
                </Text>
              </View>
            </View>

            <View style={styles.divider} />

            <View style={styles.tipItem}>
              <Text style={styles.tipNumber}>2</Text>
              <View style={styles.tipContent}>
                <Text style={styles.tipTitle}>Lưu địa chỉ nhà bạn</Text>
                <Text style={styles.tipDescription}>
                  Giúp nhân viên cứu hộ tìm được bạn nhanh chóng
                </Text>
              </View>
            </View>

            <View style={styles.divider} />

            <View style={styles.tipItem}>
              <Text style={styles.tipNumber}>3</Text>
              <View style={styles.tipContent}>
                <Text style={styles.tipTitle}>Cập nhật vị trí thường xuyên</Text>
                <Text style={styles.tipDescription}>
                  Cho phép ứng dụng truy cập vị trí của bạn
                </Text>
              </View>
            </View>

            <View style={styles.divider} />

            <View style={styles.tipItem}>
              <Text style={styles.tipNumber}>4</Text>
              <View style={styles.tipContent}>
                <Text style={styles.tipTitle}>Tuân theo hướng dẫn nhân viên</Text>
                <Text style={styles.tipDescription}>
                  Lắng nghe và thực hiện theo chỉ dẫn của người hướng dẫn
                </Text>
              </View>
            </View>
          </Card>
        </View>

        {/* Emergency Kit Checklist */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>🎒 Bộ Sơ Cứu Khẩn Cấp</Text>
          <Card>
            {[
              'Nước uống sạch (ít nhất 2 lít)',
              'Thực phẩm không dễ hư (bánh mì, đồ hộp)',
              'Thuốc và vật tư y tế cần thiết',
              'Quần áo khô và ấm',
              'Đèn pin và pin dự phòng',
              'Giấy tờ tùy thân',
              'Tiền mặt',
              'Danh bạ liên hệ khẩn cấp',
            ].map((item, index) => (
              <View key={index}>
                <View style={styles.checklistItem}>
                  <Text style={styles.checkbox}>☐</Text>
                  <Text style={styles.checklistText}>{item}</Text>
                </View>
                {index < 7 && <View style={styles.divider} />}
              </View>
            ))}
          </Card>
        </View>
      </ScrollView>

      {/* Emergency Alert Dialog */}
      {showEmergencyAlert && (
        <ConfirmDialog
          visible={showEmergencyAlert}
          title="Xác Nhận Gửi Tín Hiệu SOS"
          message="Bạn có chắc chắn muốn gửi tín hiệu SOS? Trung tâm cứu trợ gần nhất sẽ được thông báo về vị trí và tình trạng của bạn."
          onConfirm={handleSendSOS}
          onCancel={() => setShowEmergencyAlert(false)}
          confirmText="Gửi SOS"
          cancelText="Hủy"
          isDestructive
        />
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.white,
  },
  header: {
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.md,
    borderBottomWidth: 1,
    borderBottomColor: colors.gray200,
  },
  backButton: {
    color: colors.primary,
    fontSize: 14,
    fontWeight: '600',
    marginBottom: spacing.sm,
  },
  title: {
    fontSize: 24,
    fontWeight: '700',
    color: colors.gray900,
  },
  content: {
    padding: spacing.md,
  },
  sosButton: {
    backgroundColor: colors.danger,
    borderRadius: 12,
    padding: spacing.lg,
    marginBottom: spacing.lg,
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.md,
  },
  sosIcon: {
    fontSize: 32,
  },
  sosContent: {
    flex: 1,
  },
  sosLabel: {
    color: colors.white,
    fontSize: 16,
    fontWeight: '700',
    marginBottom: spacing.xs,
  },
  sosDescription: {
    color: colors.white,
    fontSize: 12,
    opacity: 0.9,
  },
  sosArrow: {
    color: colors.white,
    fontSize: 20,
  },
  section: {
    marginBottom: spacing.lg,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.gray900,
    marginBottom: spacing.md,
  },
  contactCard: {
    marginBottom: spacing.md,
    padding: spacing.md,
  },
  contactHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.md,
    marginBottom: spacing.md,
  },
  iconContainer: {
    width: 48,
    height: 48,
    borderRadius: 12,
    backgroundColor: colors.primaryLight,
    justifyContent: 'center',
    alignItems: 'center',
  },
  typeIcon: {
    fontSize: 24,
  },
  contactInfo: {
    flex: 1,
  },
  contactName: {
    fontSize: 14,
    fontWeight: '600',
    color: colors.gray900,
    marginBottom: spacing.xs,
  },
  contactType: {
    fontSize: 12,
    color: colors.gray600,
  },
  contactDetails: {
    marginBottom: spacing.md,
    paddingBottom: spacing.md,
    borderBottomWidth: 1,
    borderBottomColor: colors.gray200,
  },
  detailLabel: {
    fontSize: 12,
    color: colors.gray700,
    marginBottom: spacing.xs,
    lineHeight: 16,
  },
  distanceLabel: {
    fontSize: 11,
    color: colors.primary,
    fontWeight: '500',
    marginTop: spacing.xs,
  },
  contactFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  callButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
    paddingVertical: spacing.sm,
  },
  callIcon: {
    fontSize: 16,
  },
  callText: {
    fontSize: 13,
    fontWeight: '600',
    color: colors.primary,
  },
  hoursLabel: {
    paddingHorizontal: spacing.sm,
    paddingVertical: spacing.xs,
    backgroundColor: colors.successLight,
    borderRadius: 6,
  },
  hoursText: {
    fontSize: 11,
    color: colors.success,
    fontWeight: '500',
  },
  tipItem: {
    flexDirection: 'row',
    gap: spacing.md,
    paddingVertical: spacing.md,
    alignItems: 'flex-start',
  },
  tipNumber: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: colors.primaryLight,
    color: colors.primary,
    fontSize: 14,
    fontWeight: '700',
    textAlign: 'center',
    lineHeight: 32,
  },
  tipContent: {
    flex: 1,
  },
  tipTitle: {
    fontSize: 13,
    fontWeight: '600',
    color: colors.gray900,
    marginBottom: spacing.xs,
  },
  tipDescription: {
    fontSize: 12,
    color: colors.gray600,
    lineHeight: 16,
  },
  divider: {
    height: 1,
    backgroundColor: colors.gray200,
  },
  checklistItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.md,
    paddingVertical: spacing.md,
  },
  checkbox: {
    fontSize: 16,
    color: colors.gray400,
  },
  checklistText: {
    fontSize: 13,
    color: colors.gray700,
    flex: 1,
  },
});
