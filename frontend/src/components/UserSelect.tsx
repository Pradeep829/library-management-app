import { useState, useEffect } from 'react';
import api from '../services/api';

interface User {
  id: string;
  name: string;
  email: string;
}

interface UserSelectProps {
  value: string;
  onChange: (value: string) => void;
  includeAll?: boolean;
  required?: boolean;
}

export default function UserSelect({ value, onChange, includeAll, required }: UserSelectProps) {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);

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

  return (
    <select
      value={value}
      onChange={(e) => onChange(e.target.value)}
      required={required}
      className="block w-full border-gray-300 rounded-md shadow-sm focus:ring-primary-500 focus:border-primary-500 sm:text-sm"
    >
      {includeAll && <option value="">All Users</option>}
      {!includeAll && <option value="">Select a user</option>}
      {loading ? (
        <option>Loading...</option>
      ) : (
        users.map((user) => (
          <option key={user.id} value={user.id}>
            {user.name} ({user.email})
          </option>
        ))
      )}
    </select>
  );
}


