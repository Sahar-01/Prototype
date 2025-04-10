import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  FlatList,
  StyleSheet,
  SafeAreaView,
  RefreshControl,
  TouchableOpacity,
  ActivityIndicator,
} from 'react-native';
import axios from 'axios';
import { Ionicons } from '@expo/vector-icons';

export default function NotificationsScreen({ route }) {
  const { username } = route.params;
  const [notifications, setNotifications] = useState([]);
  const [refreshing, setRefreshing] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchNotifications();
  }, []);

  const fetchNotifications = async () => {
    try {
      setLoading(true);
      const response = await axios.get(`http://192.168.32.30:3000/notifications/${username}`);
      setNotifications(response.data);
    } catch (error) {
      console.error('❌ Error fetching notifications:', error);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  const onRefresh = () => {
    setRefreshing(true);
    fetchNotifications();
  };

  const clearNotifications = () => {
    setNotifications([]);
  };

  const getStatusStyle = (message) => {
    if (message.includes('APPROVED')) return { color: '#2E7D32' };
    if (message.includes('REJECTED')) return { color: '#C62828' };
    if (message.includes('PENDING') || message.includes('NEEDS_INFO')) return { color: '#FB8C00' };
    return { color: '#1D2A32' };
  };

  const formatMessage = (text) => {
    return text.replace(/Your claim #(\d+)/gi, 'Claim ID $1');
  };

  const renderItem = ({ item }) => {
    const formattedMessage = formatMessage(item.message);
    const words = formattedMessage.split(' ');

    return (
      <View style={styles.item}>
        <View style={styles.iconContainer}>
          <Ionicons name="notifications-outline" size={24} color="#C6FF00" />
        </View>
        <View style={styles.textContainer}>
          <Text style={styles.message}>
            {words.map((word, index) => {
              const isStatusWord = ['APPROVED', 'REJECTED', 'PENDING', 'NEEDS_INFO'].includes(word.toUpperCase());
              return (
                <Text key={index} style={isStatusWord ? getStatusStyle(word) : undefined}>
                  {word + ' '}
                </Text>
              );
            })}
          </Text>
          <Text style={styles.timestamp}>{new Date(item.timestamp).toLocaleString()}</Text>
        </View>
      </View>
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.headerWrapper}>
        <View style={styles.headerSpacer} />
        <View style={styles.headerContainer}>
          {notifications.length > 0 && (
            <TouchableOpacity onPress={clearNotifications} style={styles.trashIcon}>
              <Ionicons name="trash-outline" size={22} color="#E53935" />
            </TouchableOpacity>
          )}
        </View>
      </View>
      {loading ? (
        <ActivityIndicator size="large" color="#4ECDC4" style={{ marginTop: 30 }} />
      ) : (
        <FlatList
          data={notifications}
          keyExtractor={item => item.id.toString()}
          renderItem={renderItem}
          contentContainerStyle={{ padding: 16 }}
          refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
          ListEmptyComponent={<Text style={styles.emptyText}>No notifications yet.</Text>}
        />
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F5F7FA' },
  headerWrapper: {
    paddingTop: 10,
    paddingHorizontal: 20,
  },
  headerSpacer: {
    height: 10,
  },
  headerContainer: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    alignItems: 'center',
  },
  trashIcon: {
    padding: 6,
    marginTop: 10,
  },
  item: {
    backgroundColor: '#FFFFFF',
    flexDirection: 'row',
    padding: 16,
    marginBottom: 12,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#DCE3E8',
    shadowColor: '#000',
    shadowOpacity: 0.04,
    shadowRadius: 3,
    shadowOffset: { width: 0, height: 2 },
    elevation: 1,
  },
  iconContainer: {
    marginRight: 12,
    justifyContent: 'center',
  },
  textContainer: { flex: 1 },
  message: {
    fontSize: 16,
    fontWeight: '500',
    color: '#1D2A32',
  },
  timestamp: {
    fontSize: 12,
    color: '#6B7280',
    marginTop: 4,
  },
  emptyText: {
    textAlign: 'center',
    marginTop: 40,
    fontSize: 16,
    color: '#94A3B8',
  },
});
