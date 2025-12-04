import React, { useState, useEffect } from 'react';
import { View, StyleSheet, Modal, ScrollView } from 'react-native';
import { TextInput, Button, Text, Card } from 'react-native-paper';
import api from '../services/api';

interface Author {
  id: string;
  name: string;
  bio?: string;
}

interface AuthorModalProps {
  author?: Author | null;
  onClose: () => void;
}

export default function AuthorModal({ author, onClose }: AuthorModalProps) {
  const [name, setName] = useState('');
  const [bio, setBio] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    if (author) {
      setName(author.name);
      setBio(author.bio || '');
    }
  }, [author]);

  const handleSubmit = async () => {
    if (!name) {
      setError('Please fill in all required fields');
      return;
    }

    setError('');
    setLoading(true);

    try {
      const data: any = { name };
      if (bio) data.bio = bio;

      if (author) {
        await api.patch(`/authors/${author.id}`, data);
      } else {
        await api.post('/authors', data);
      }
      onClose();
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to save author');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal visible={true} animationType="slide" transparent>
      <View style={styles.overlay}>
        <Card style={styles.card}>
          <Card.Content>
            <Text variant="headlineSmall" style={styles.title}>
              {author ? 'Edit Author' : 'Add Author'}
            </Text>

            {error ? (
              <Text style={styles.error}>{error}</Text>
            ) : null}

            <ScrollView>
              <TextInput
                label="Name *"
                value={name}
                onChangeText={setName}
                mode="outlined"
                style={styles.input}
              />

              <TextInput
                label="Bio"
                value={bio}
                onChangeText={setBio}
                mode="outlined"
                multiline
                numberOfLines={4}
                style={styles.input}
              />

              <View style={styles.actions}>
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
                  {author ? 'Update' : 'Create'}
                </Button>
              </View>
            </ScrollView>
          </Card.Content>
        </Card>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    padding: 20,
  },
  card: {
    maxHeight: '80%',
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


