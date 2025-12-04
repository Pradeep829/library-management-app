import React, { useState } from 'react';
import { StyleSheet, ScrollView, View } from 'react-native';
import { Button, Text, Card, Modal, Portal } from 'react-native-paper';
import api from '../services/api';
import UserSelect from './UserSelect';
import BookSelect from './BookSelect';

interface BorrowModalProps {
  onClose: () => void;
}

export default function BorrowModal({ onClose }: BorrowModalProps) {
  const [userId, setUserId] = useState('');
  const [bookId, setBookId] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async () => {
    if (!userId || !bookId) {
      setError('Please select both user and book');
      return;
    }

    setError('');
    setLoading(true);

    try {
      await api.post('/borrowed-books/borrow', { userId, bookId });
      onClose();
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to borrow book');
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
              Borrow Book
            </Text>

            {error ? <Text style={styles.error}>{error}</Text> : null}

            <ScrollView>
              <UserSelect value={userId} onChange={setUserId} required />

              <View style={styles.spacer} />

              <BookSelect value={bookId} onChange={setBookId} required />

              <View style={styles.actions}>
                <Button mode="outlined" onPress={onClose} style={styles.button}>
                  Cancel
                </Button>
                <Button
                  mode="contained"
                  onPress={handleSubmit}
                  loading={loading}
                  disabled={loading || !userId || !bookId}
                  style={styles.button}
                >
                  Borrow
                </Button>
              </View>
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
  spacer: {
    height: 16,
  },
  actions: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    marginTop: 16,
    gap: 8,
  },
  button: {
    flex: 1,
  },
});


