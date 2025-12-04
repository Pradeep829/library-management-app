import { useEffect, useState } from 'react';
import api from '../services/api';
import { BookOpen, Users, UserPlus, Library } from 'lucide-react';

interface Stats {
  totalBooks: number;
  totalAuthors: number;
  totalUsers: number;
  activeBorrows: number;
}

export default function Dashboard() {
  const [stats, setStats] = useState<Stats>({
    totalBooks: 0,
    totalAuthors: 0,
    totalUsers: 0,
    activeBorrows: 0,
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const [booksRes, authorsRes, usersRes, borrowsRes] = await Promise.all([
          api.get('/books'),
          api.get('/authors'),
          api.get('/users'),
          api.get('/borrowed-books/active'),
        ]);

        setStats({
          totalBooks: booksRes.data.total || booksRes.data.data?.length || 0,
          totalAuthors: authorsRes.data.length || 0,
          totalUsers: usersRes.data.length || 0,
          activeBorrows: borrowsRes.data.length || 0,
        });
      } catch (error) {
        console.error('Failed to fetch stats:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchStats();
  }, []);

  const statCards = [
    {
      name: 'Total Books',
      value: stats.totalBooks,
      icon: BookOpen,
      color: 'bg-blue-500',
    },
    {
      name: 'Total Authors',
      value: stats.totalAuthors,
      icon: Users,
      color: 'bg-green-500',
    },
    {
      name: 'Total Users',
      value: stats.totalUsers,
      icon: UserPlus,
      color: 'bg-purple-500',
    },
    {
      name: 'Active Borrows',
      value: stats.activeBorrows,
      icon: Library,
      color: 'bg-orange-500',
    },
  ];

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
      </div>
    );
  }

  return (
    <div>
      <h1 className="text-3xl font-bold text-gray-900 mb-8">Dashboard</h1>
      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
        {statCards.map((card) => {
          const Icon = card.icon;
          return (
            <div
              key={card.name}
              className="bg-white overflow-hidden shadow rounded-lg"
            >
              <div className="p-5">
                <div className="flex items-center">
                  <div className={`${card.color} p-3 rounded-md`}>
                    <Icon className="h-6 w-6 text-white" />
                  </div>
                  <div className="ml-5 w-0 flex-1">
                    <dl>
                      <dt className="text-sm font-medium text-gray-500 truncate">
                        {card.name}
                      </dt>
                      <dd className="text-lg font-medium text-gray-900">
                        {card.value}
                      </dd>
                    </dl>
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}


