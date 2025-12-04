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

interface Book {
  id: string;
  title: string;
  author: {
    name: string;
  };
  borrowedBooks: Array<{ returnedAt: string | null }>;
}

interface BookSelectProps {
  value: string;
  onChange: (value: string) => void;
  required?: boolean;
  onlyAvailable?: boolean;
}

export default function BookSelect({ value, onChange, required, onlyAvailable = true }: BookSelectProps) {
  const [books, setBooks] = useState<Book[]>([]);
  const [loading, setLoading] = useState(true);
  const [pickerVisible, setPickerVisible] = useState(false);

  useEffect(() => {
    const fetchBooks = async () => {
      try {
        const params: any = {};
        if (onlyAvailable) {
          params.borrowed = 'false';
        }
        const response = await api.get('/books', { params });
        setBooks(response.data.data || response.data);
      } catch (error) {
        console.error('Failed to fetch books:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchBooks();
  }, [onlyAvailable]);

  const isAvailable = (book: Book) => {
    return !book.borrowedBooks?.some((b) => !b.returnedAt);
  };

  const selectedBook = books.find((b) => b.id === value);

  const visibleBooks = books.filter((book) => !onlyAvailable || isAvailable(book));

  return (
    <>
      <Pressable onPress={() => setPickerVisible(true)}>
        <TextInput
          label={required ? 'Book *' : 'Book'}
          value={selectedBook ? `${selectedBook.title} - ${selectedBook.author.name}` : ''}
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
            <Card.Title title="Select Book" />
            <Card.Content>
              {loading ? (
                <ActivityIndicator />
              ) : (
                <ScrollView>
                  {visibleBooks.map((book) => (
                    <List.Item
                      key={book.id}
                      title={`${book.title} - ${book.author.name}`}
                      onPress={() => {
                        onChange(book.id);
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


