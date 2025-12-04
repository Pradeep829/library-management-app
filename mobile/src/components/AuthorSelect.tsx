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

interface Author {
  id: string;
  name: string;
}

interface AuthorSelectProps {
  value: string;
  onChange: (value: string) => void;
  required?: boolean;
}

export default function AuthorSelect({ value, onChange, required }: AuthorSelectProps) {
  const [authors, setAuthors] = useState<Author[]>([]);
  const [loading, setLoading] = useState(true);
  const [pickerVisible, setPickerVisible] = useState(false);

  useEffect(() => {
    const fetchAuthors = async () => {
      try {
        const response = await api.get('/authors');
        setAuthors(response.data);
      } catch (error) {
        console.error('Failed to fetch authors:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchAuthors();
  }, []);

  const selectedAuthor = authors.find((a) => a.id === value);

  return (
    <>
      <Pressable onPress={() => setPickerVisible(true)}>
        <TextInput
          label={required ? 'Author *' : 'Author'}
          value={selectedAuthor?.name || ''}
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
            <Card.Title title="Select Author" />
            <Card.Content>
              {loading ? (
                <ActivityIndicator />
              ) : (
                <ScrollView>
                  {authors.map((author) => (
                    <List.Item
                      key={author.id}
                      title={author.name}
                      onPress={() => {
                        onChange(author.id);
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


