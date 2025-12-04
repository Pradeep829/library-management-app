import React, { useEffect, useState } from 'react';
import { View, StyleSheet, ScrollView, RefreshControl } from 'react-native';
import { Card, Text, Button, FAB, TextInput, ActivityIndicator, Chip } from 'react-native-paper';
import api from '../services/api';
import BookModal from '../components/BookModal';

interface Book {
  id: string;
  title: string;
  isbn?: string;
  publishedAt?: string;
  author: {
    id: string;
    name: string;
  };
  borrowedBooks: Array<{ returnedAt?: string | null }>;
}

export default function BooksScreen() {
  const [books, setBooks] = useState<Book[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingBook, setEditingBook] = useState<Book | null>(null);
  const [searchTerm, setSearchTerm] = useState('');

  const fetchBooks = async () => {
    try {
      setLoading(true);
      const params: any = {};
      if (searchTerm) params.search = searchTerm;

      const response = await api.get('/books', { params });
      setBooks(response.data.data || response.data);
    } catch (error) {
      console.error('Failed to fetch books:', error);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    fetchBooks();
  }, [searchTerm]);

  const handleDelete = async (id: string) => {
    try {
      await api.delete(`/books/${id}`);
      fetchBooks();
    } catch (error) {
      console.error('Failed to delete book');
    }
  };

  const handleEdit = (book: Book) => {
    setEditingBook(book);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setEditingBook(null);
    fetchBooks();
  };

  const isBorrowed = (book: Book) => {
    return book.borrowedBooks?.some((b) => !b.returnedAt) || false;
  };



  return (
    <View style={styles.container}>
      <View style={styles.searchContainer}>
        <TextInput
          label="Search books..."
          value={searchTerm}
          onChangeText={setSearchTerm}
          mode="outlined"
          style={styles.searchInput}
        />
      </View>

      {loading && !refreshing ? (      <View style={styles.center}>
        <ActivityIndicator size="large" />
      </View>):(  <ScrollView
        style={styles.list}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={() => {
            setRefreshing(true);
            fetchBooks();
          }} />
        }
      >
        {books.length === 0 ? (
          <View style={styles.empty}>
            <Text variant="bodyLarge">No books found</Text>
          </View>
        ) : (
          <View style={styles.listMain}>
          {books.map((book) => (
            <Card key={book.id} style={styles.card}>
              <Card.Content>
                <View style={styles.cardHeader}>
                  <Text variant="titleLarge">{book.title}</Text>
                  {isBorrowed(book) && (
                    <Chip icon="book" style={styles.borrowedChip}>Borrowed</Chip>
                  )}
                </View>
                <Text variant="bodyMedium" style={styles.author}>
                  Author: {book.author.name}
                </Text>
                {book.isbn && (
                  <Text variant="bodySmall" style={styles.meta}>
                    ISBN: {book.isbn}
                  </Text>
                )}
                {book.publishedAt && (
                  <Text variant="bodySmall" style={styles.meta}>
                    Published: {new Date(book.publishedAt).getFullYear()}
                  </Text>
                )}
                <View style={styles.actions}>
                  <Button mode="outlined" onPress={() => handleEdit(book)}>
                    Edit
                  </Button>
                  <Button mode="outlined" onPress={() => handleDelete(book.id)} textColor="red">
                    Delete
                  </Button>
                </View>
              </Card.Content>
            </Card>
          ))}
          </View>
        )}
      </ScrollView>)}

    

      <FAB
        icon="plus"
        style={styles.fab}
        onPress={() => setIsModalOpen(true)}
      />

      {isModalOpen && (
        <BookModal
          book={editingBook}
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
  searchContainer: {
    padding: 16,
    backgroundColor: '#fff',
  },
  searchInput: {
    backgroundColor: '#fff',
  },
  list: {
    flex: 1,
    padding: 16,
  },
  listMain:{
marginBottom:25,

  },
  empty: {
    padding: 32,
    alignItems: 'center',
    flex: 1,
    
  },
  card: {
    marginBottom: 16,
    elevation: 2,
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  author: {
    marginTop: 4,
    color: '#64748b',
  },
  meta: {
    marginTop: 4,
    color: '#94a3b8',
  },
  actions: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    marginTop: 12,
    gap: 8,
  },
  borrowedChip: {
    backgroundColor: '#fef3c7',
  },
  fab: {
    position: 'absolute',
    margin: 16,
    right: 0,
    bottom: 0,
    backgroundColor: '#0ea5e9',
  },
});


