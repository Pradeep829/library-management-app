import React, { useEffect, useState } from 'react';
import { View, StyleSheet, ScrollView, RefreshControl } from 'react-native';
import { Card, Text, Button, FAB, ActivityIndicator } from 'react-native-paper';
import api from '../services/api';
import AuthorModal from '../components/AuthorModal';

interface Author {
  id: string;
  name: string;
  bio?: string;
  _count?: {
    books: number;
  };
}

export default function AuthorsScreen() {
  const [authors, setAuthors] = useState<Author[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingAuthor, setEditingAuthor] = useState<Author | null>(null);

  const fetchAuthors = async () => {
    try {
      setLoading(true);
      const response = await api.get('/authors');
      setAuthors(response.data);
    } catch (error) {
      console.error('Failed to fetch authors:', error);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    fetchAuthors();
  }, []);

  const handleDelete = async (id: string) => {
    try {
      await api.delete(`/authors/${id}`);
      fetchAuthors();
    } catch (error) {
      console.error('Failed to delete author');
    }
  };

  const handleEdit = (author: Author) => {
    setEditingAuthor(author);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setEditingAuthor(null);
    fetchAuthors();
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
            fetchAuthors();
          }} />
        }
      >
        {authors.length === 0 ? (
          <View style={styles.empty}>
            <Text variant="bodyLarge">No authors found</Text>
          </View>
        ) : (
          <View style={styles.listMain}>

{authors.map((author) => (
            <Card key={author.id} style={styles.card}>
              <Card.Content>
                <Text variant="titleLarge">{author.name}</Text>
                {author.bio && (
                  <Text variant="bodyMedium" style={styles.bio}>
                    {author.bio}
                  </Text>
                )}
                {author._count && (
                  <Text variant="bodySmall" style={styles.count}>
                    {author._count.books} book{author._count.books !== 1 ? 's' : ''}
                  </Text>
                )}
                <View style={styles.actions}>
                  <Button mode="outlined" onPress={() => handleEdit(author)}>
                    Edit
                  </Button>
                  <Button mode="outlined" onPress={() => handleDelete(author.id)} textColor="red">
                    Delete
                  </Button>
                </View>
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
        <AuthorModal
          author={editingAuthor}
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
  listMain:{
marginBottom:25,
  },
  empty: {
    padding: 32,
    alignItems: 'center',
  },
  card: {
    marginBottom: 16,
    elevation: 2,
  },
  bio: {
    marginTop: 8,
    color: '#64748b',
  },
  count: {
    marginTop: 4,
    color: '#94a3b8',
  },
  actions: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    marginTop: 12,
    gap: 8,
  },
  fab: {
    position: 'absolute',
    margin: 16,
    right: 0,
    bottom: 80, 
    backgroundColor: '#0ea5e9',
  },
});


