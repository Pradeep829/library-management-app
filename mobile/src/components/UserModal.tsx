import React, { useState } from 'react';
import { View, StyleSheet, Modal, ScrollView, KeyboardAvoidingView, Platform } from 'react-native';
import { TextInput, Button, Text, Card } from 'react-native-paper';
import api from '../services/api';

interface UserModalProps {
  onClose: () => void;
}

export default function UserModal({ onClose }: UserModalProps) {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async () => {
    if (!name || !email || !password) {
      setError('Please fill in all fields');
      return;
    }

    if (password.length < 6) {
      setError('Password must be at least 6 characters');
      return;
    }

    setError('');
    setLoading(true);

    try {
      await api.post('/users', { name, email, password });
      onClose();
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to create user');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal visible animationType="fade" transparent>
      <KeyboardAvoidingView
        style={styles.overlay}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      >
        <Card style={styles.card}>
          <Card.Content>
            <Text variant="headlineSmall" style={styles.title}>
              Add User
            </Text>

            {error ? <Text style={styles.error}>{error}</Text> : null}

            <ScrollView keyboardShouldPersistTaps="handled">
              <TextInput
                label="Name *"
                value={name}
                onChangeText={setName}
                mode="outlined"
                style={styles.input}
              />

              <TextInput
                label="Email *"
                value={email}
                onChangeText={setEmail}
                mode="outlined"
                keyboardType="email-address"
                autoCapitalize="none"
                style={styles.input}
              />

              <TextInput
                label="Password *"
                value={password}
                onChangeText={setPassword}
                mode="outlined"
                secureTextEntry
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
                  Create
                </Button>
              </View>
            </ScrollView>
          </Card.Content>
        </Card>
      </KeyboardAvoidingView>
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


