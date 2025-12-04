import React, { useState, useEffect } from 'react';
import { StyleSheet, ScrollView, Pressable } from 'react-native';
import {
  TextInput,
  Portal,
  Modal,
  Card,
  List,
  ActivityIndicator,
} from 'react-native-paper';
import api from '../services/api';

interface User {
  id: string;
  name: string;
  email: string;
}

interface UserSelectProps {
  value: string;
  onChange: (value: string) => void;
  required?: boolean;
}

export default function UserSelect({ value, onChange, required }: UserSelectProps) {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [pickerVisible, setPickerVisible] = useState(false);

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const response = await api.get('/users');
        setUsers(response.data);
      } catch (error) {
        console.error('Failed to fetch users:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchUsers();
  }, []);

  const selectedUser = users.find((u) => u.id === value);

  return (
    <>
      <Pressable onPress={() => setPickerVisible(true)}>
        <TextInput
          label={required ? 'User *' : 'User'}
          value={selectedUser ? `${selectedUser.name} (${selectedUser.email})` : ''}
          mode="outlined"
          editable={false}
          right={<TextInput.Icon icon="menu-down" onPress={() => setPickerVisible(true)} />}
          style={styles.input}
          pointerEvents="none"
        />
      </Pressable>

      <Portal>
        <Modal
          visible={pickerVisible}
          onDismiss={() => setPickerVisible(false)}
          contentContainerStyle={styles.modalContainer}
        >
          <Card>
            <Card.Title title="Select User" />
            <Card.Content>
              {loading ? (
                <ActivityIndicator />
              ) : (
                <ScrollView>
                  {users.map((user) => (
                    <List.Item
                      key={user.id}
                      title={`${user.name} (${user.email})`}
                      onPress={() => {
                        onChange(user.id);
                        setPickerVisible(false);
                      }}
                    />
                  ))}
                </ScrollView>
              )}
            </Card.Content>
          </Card>
        </Modal>
      </Portal>
    </>
  );
}

const styles = StyleSheet.create({
  input: {
    marginBottom: 16,
    backgroundColor: '#fff',
  },
  modalContainer: {
    margin: 20,
  },
});


