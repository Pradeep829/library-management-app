import { useState, useEffect } from 'react';
import api from '../services/api';

interface Author {
  id: string;
  name: string;
}

interface AuthorSelectProps {
  value: string;
  onChange: (value: string) => void;
  includeAll?: boolean;
  required?: boolean;
}

export default function AuthorSelect({ value, onChange, includeAll, required }: AuthorSelectProps) {
  const [authors, setAuthors] = useState<Author[]>([]);
  const [loading, setLoading] = useState(true);

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

  return (
    <select
      value={value}
      onChange={(e) => onChange(e.target.value)}
      required={required}
      className="block w-full border-gray-300 rounded-md shadow-sm focus:ring-primary-500 focus:border-primary-500 sm:text-sm"
    >
      {includeAll && <option value="">All Authors</option>}
      {!includeAll && <option value="">Select an author</option>}
      {loading ? (
        <option>Loading...</option>
      ) : (
        authors.map((author) => (
          <option key={author.id} value={author.id}>
            {author.name}
          </option>
        ))
      )}
    </select>
  );
}


