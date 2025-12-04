import { useState, useEffect } from 'react';
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

  return (
    <select
      value={value}
      onChange={(e) => onChange(e.target.value)}
      required={required}
      className="block w-full border-gray-300 rounded-md shadow-sm focus:ring-primary-500 focus:border-primary-500 sm:text-sm"
    >
      <option value="">Select a book</option>
      {loading ? (
        <option>Loading...</option>
      ) : (
        books
          .filter((book) => !onlyAvailable || isAvailable(book))
          .map((book) => (
            <option key={book.id} value={book.id}>
              {book.title} - {book.author.name}
            </option>
          ))
      )}
    </select>
  );
}


