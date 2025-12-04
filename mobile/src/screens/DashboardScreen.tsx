import React, { useEffect, useState } from 'react';
import { View, StyleSheet, ScrollView } from 'react-native';
import { Card, Text, ActivityIndicator, Button } from 'react-native-paper';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import api from '../services/api';
import { useAuthStore } from '../store/authStore';

interface Stats {
  totalBooks: number;
  totalAuthors: number;
  totalUsers: number;
  activeBorrows: number;
}

export default function DashboardScreen() {
  const [stats, setStats] = useState<Stats>({
    totalBooks: 0,
    totalAuthors: 0,
    totalUsers: 0,
    activeBorrows: 0,
  });
  const [loading, setLoading] = useState(true);
  const { logout, user } = useAuthStore();

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const [booksRes, authorsRes, usersRes, borrowsRes] = await Promise.all([
          api.get('/books'),
          api.get('/authors'),
          api.get('/users'),
          api.get('/borrowed-books/active'),
        ]);

        setStats({
          totalBooks: booksRes.data.total || booksRes.data.data?.length || 0,
          totalAuthors: authorsRes.data.length || 0,
          totalUsers: usersRes.data.length || 0,
          activeBorrows: borrowsRes.data.length || 0,
        });
      } catch (error) {
        console.error('Failed to fetch stats:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchStats();
  }, []);

  if (loading) {
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" />
      </View>
    );
  }

  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <Text variant="headlineMedium">Dashboard</Text>
        <Text variant="bodyMedium" style={styles.userText}>
          Welcome, {user?.name}
        </Text>
        <Button mode="outlined" onPress={logout} style={styles.logoutButton}>
          Logout
        </Button>
      </View>

      <View style={styles.statsContainer}>
        <Card style={styles.statCard}>
          <Card.Content>
            <MaterialCommunityIcons name="book-open" size={32} color="#3b82f6" />
            <Text variant="headlineSmall" style={styles.statValue}>
              {stats.totalBooks}
            </Text>
            <Text variant="bodyMedium">Total Books</Text>
          </Card.Content>
        </Card>

        <Card style={styles.statCard}>
          <Card.Content>
            <MaterialCommunityIcons name="account-group" size={32} color="#10b981" />
            <Text variant="headlineSmall" style={styles.statValue}>
              {stats.totalAuthors}
            </Text>
            <Text variant="bodyMedium">Total Authors</Text>
          </Card.Content>
        </Card>

        <Card style={styles.statCard}>
          <Card.Content>
            <MaterialCommunityIcons name="account-plus" size={32} color="#8b5cf6" />
            <Text variant="headlineSmall" style={styles.statValue}>
              {stats.totalUsers}
            </Text>
            <Text variant="bodyMedium">Total Users</Text>
          </Card.Content>
        </Card>

        <Card style={styles.statCard}>
          <Card.Content>
            <MaterialCommunityIcons name="library" size={32} color="#f59e0b" />
            <Text variant="headlineSmall" style={styles.statValue}>
              {stats.activeBorrows}
            </Text>
            <Text variant="bodyMedium">Active Borrows</Text>
          </Card.Content>
        </Card>
      </View>
    </ScrollView>
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
  header: {
    padding: 20,
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderBottomColor: '#e2e8f0',
  },
  userText: {
    color: '#64748b',
    marginTop: 4,
  },
  logoutButton: {
    marginTop: 12,
  },
  statsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    padding: 16,
    justifyContent: 'space-between',
  },
  statCard: {
    width: '48%',
    marginBottom: 16,
    elevation: 2,
  },
  statValue: {
    marginTop: 8,
    marginBottom: 4,
    fontWeight: 'bold',
  },
});


