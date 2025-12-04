import React, { useEffect, useState } from 'react';
import { View, StyleSheet, ScrollView, RefreshControl } from 'react-native';
import { Card, Text, Button, FAB, ActivityIndicator } from 'react-native-paper';
import api from '../services/api';
import BorrowModal from '../components/BorrowModal';

interface BorrowedBook {
  id: string;
  bookId: string;
  userId: string;
  borrowedAt: string;
  returnedAt?: string;
  book: {
    id: string;
    title: string;
    author: {
      name: string;
    };
  };
  user: {
    id: string;
    name: string;
    email: string;
  };
}

export default function BorrowedBooksScreen() {
  const [borrowedBooks, setBorrowedBooks] = useState<BorrowedBook[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const fetchBorrowedBooks = async () => {
    try {
      setLoading(true);
      const response = await api.get('/borrowed-books/active');
      setBorrowedBooks(response.data);
    } catch (error) {
      console.error('Failed to fetch borrowed books:', error);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    fetchBorrowedBooks();
  }, []);

  const handleReturn = async (bookId: string, userId: string) => {
    try {
      await api.post(`/borrowed-books/return/${bookId}/${userId}`);
      fetchBorrowedBooks();
    } catch (error) {
      console.error('Failed to return book');
    }
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    fetchBorrowedBooks();
  };

  const activeBorrows = borrowedBooks.filter((b) => !b.returnedAt);

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
            fetchBorrowedBooks();
          }} />
        }
      >
        {activeBorrows.length === 0 ? (
          <View style={styles.empty}>
            <Text variant="bodyLarge">No borrowed books</Text>
          </View>
        ) : (
          <View style={styles.listMain}>
          {activeBorrows.map((borrowed) => (
            <Card key={borrowed.id} style={styles.card}>
              <Card.Content>
                <Text variant="titleLarge">{borrowed.book.title}</Text>
                <Text variant="bodyMedium" style={styles.author}>
                  Author: {borrowed.book.author.name}
                </Text>
                <Text variant="bodySmall" style={styles.user}>
                  Borrowed by: {borrowed.user.name} ({borrowed.user.email})
                </Text>
                <Text variant="bodySmall" style={styles.date}>
                  Borrowed on: {new Date(borrowed.borrowedAt).toLocaleDateString()}
                </Text>
                <Button
                  mode="contained"
                  onPress={() => handleReturn(borrowed.bookId, borrowed.userId)}
                  style={styles.returnButton}
                >
                  Return Book
                </Button>
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
        <BorrowModal
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
  empty: {
    padding: 32,
    alignItems: 'center',
  },
  listMain: {
    marginBottom: 25,
  },
  card: {
    marginBottom: 16,
    elevation: 2,
  },
  author: {
    marginTop: 8,
    color: '#64748b',
  },
  user: {
    marginTop: 4,
    color: '#94a3b8',
  },
  date: {
    marginTop: 4,
    color: '#94a3b8',
  },
  returnButton: {
    marginTop: 12,
  },
  fab: {
    position: 'absolute',
    margin: 16,
    right: 0,
    bottom: 0,
    backgroundColor: '#0ea5e9',
  },
});


