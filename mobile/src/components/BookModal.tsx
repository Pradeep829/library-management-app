import React, { useState, useEffect } from 'react';
import { StyleSheet, ScrollView } from 'react-native';
import { TextInput, Button, Text, Card, Modal, Portal } from 'react-native-paper';
import api from '../services/api';
import AuthorSelect from './AuthorSelect';

interface Book {
  id: string;
  title: string;
  isbn?: string;
  publishedAt?: string;
  authorId: string;
}

interface BookModalProps {
  book?: Book | null;
  onClose: () => void;
}

export default function BookModal({ book, onClose }: BookModalProps) {
  const [title, setTitle] = useState('');
  const [isbn, setIsbn] = useState('');
  const [publishedAt, setPublishedAt] = useState('');
  const [authorId, setAuthorId] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    if (book) {
      setTitle(book.title);
      setIsbn(book.isbn || '');
      setPublishedAt(book.publishedAt ? book.publishedAt.split('T')[0] : '');
      setAuthorId(book.authorId);
    }
  }, [book]);

  const handleSubmit = async () => {
    if (!title || !authorId) {
      setError('Please fill in all required fields');
      return;
    }

    setError('');
    setLoading(true);

    try {
      const data: any = { title, authorId };
      if (isbn) data.isbn = isbn;
      if (publishedAt) data.publishedAt = publishedAt;

      if (book) {
        await api.patch(`/books/${book.id}`, data);
      } else {
        await api.post('/books', data);
      }
      onClose();
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to save book');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Portal>
      <Modal visible onDismiss={onClose} contentContainerStyle={styles.modalContainer}>
        <Card>
          <Card.Content>
            <Text variant="headlineSmall" style={styles.title}>
              {book ? 'Edit Book' : 'Add Book'}
            </Text>

            {error ? <Text style={styles.error}>{error}</Text> : null}

            <ScrollView>
              <TextInput
                label="Title *"
                value={title}
                onChangeText={setTitle}
                mode="outlined"
                style={styles.input}
              />

              <AuthorSelect value={authorId} onChange={setAuthorId} required />

              <TextInput
                label="ISBN"
                value={isbn}
                onChangeText={setIsbn}
                mode="outlined"
                style={styles.input}
              />

              <TextInput
                label="Published Date (YYYY-MM-DD)"
                value={publishedAt}
                onChangeText={setPublishedAt}
                mode="outlined"
                style={styles.input}
              />

              <Button mode="outlined" onPress={onClose} style={styles.button}>
                Cancel
              </Button>
              <Button
                mode="contained"
                onPress={handleSubmit}
                loading={loading}
                disabled={loading}
                style={styles.button}
              >
                {book ? 'Update' : 'Create'}
              </Button>
            </ScrollView>
          </Card.Content>
        </Card>
      </Modal>
    </Portal>
  );
}

const styles = StyleSheet.create({
  modalContainer: {
    margin: 20,
  },
  title: {
    marginBottom: 16,
  },
  error: {
    color: 'red',
    marginBottom: 16,
  },
  input: {
    marginBottom: 16,
    backgroundColor: '#fff',
  },
  button: {
    marginTop: 16,
  },
});


