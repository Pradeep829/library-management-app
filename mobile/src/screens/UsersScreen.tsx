import React, { useEffect, useState } from 'react';
import { View, StyleSheet, ScrollView, RefreshControl } from 'react-native';
import { Card, Text, FAB, ActivityIndicator } from 'react-native-paper';
import api from '../services/api';
import UserModal from '../components/UserModal';

interface User {
  id: string;
  name: string;
  email: string;
  createdAt: string;
}

export default function UsersScreen() {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const fetchUsers = async () => {
    try {
      setLoading(true);
      const response = await api.get('/users');
      setUsers(response.data);
    } catch (error) {
      console.error('Failed to fetch users:', error);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const handleCloseModal = () => {
    setIsModalOpen(false);
    fetchUsers();
  };

  if (loading && !refreshing) {
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <ScrollView
        style={styles.list}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={() => {
            setRefreshing(true);
            fetchUsers();
          }} />
        }
      >
        {users.length === 0 ? (
          <View style={styles.empty}>
            <Text variant="bodyLarge">No users found</Text>
          </View>
        ) : (
          <View style={styles.listMain}>
          {users.map((user) => (
            <Card key={user.id} style={styles.card}>
              <Card.Content>
                <Text variant="titleLarge">{user.name}</Text>
                <Text variant="bodyMedium" style={styles.email}>
                  {user.email}
                </Text>
                <Text variant="bodySmall" style={styles.date}>
                  Joined: {new Date(user.createdAt).toLocaleDateString()}
                </Text>
              </Card.Content>
            </Card>
          ))}
          </View>
        )}
      </ScrollView>

      <FAB
        icon="plus"
        style={styles.fab}
        onPress={() => setIsModalOpen(true)}
      />

      {isModalOpen && (
        <UserModal
          onClose={handleCloseModal}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8fafc',
  },
  center: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  list: {
    flex: 1,
    padding: 16,
  },
  listMain: {
    marginBottom: 25,
  },
  empty: {
    padding: 32,
    alignItems: 'center',
  },
  card: {
    marginBottom: 16,
    elevation: 2,
  },
  email: {
    marginTop: 4,
    color: '#64748b',
  },
  date: {
    marginTop: 4,
    color: '#94a3b8',
  },
  fab: {
    position: 'absolute',
    margin: 16,
    right: 0,
    bottom: 0,
    backgroundColor: '#0ea5e9',
  },
});


