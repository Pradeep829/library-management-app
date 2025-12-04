import { useEffect, useState } from 'react';
import api from '../services/api';
import { Library, ArrowLeft } from 'lucide-react';
import BorrowModal from '../components/BorrowModal';
import UserSelect from '../components/UserSelect';

interface BorrowedBook {
  id: string;
  bookId: string;
  userId: string;
  borrowedAt: string;
  returnedAt?: string;
  book: {
    id: string;
    title: string;
    author: {
      name: string;
    };
  };
  user: {
    id: string;
    name: string;
    email: string;
  };
}

export default function BorrowedBooks() {
  const [borrowedBooks, setBorrowedBooks] = useState<BorrowedBook[]>([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedUserId, setSelectedUserId] = useState('');

  const fetchBorrowedBooks = async () => {
    try {
      setLoading(true);
      let response;
      if (selectedUserId) {
        response = await api.get(`/borrowed-books/user/${selectedUserId}`);
      } else {
        response = await api.get('/borrowed-books/active');
      }
      setBorrowedBooks(response.data);
    } catch (error) {
      console.error('Failed to fetch borrowed books:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBorrowedBooks();
  }, [selectedUserId]);

  const handleReturn = async (bookId: string, userId: string) => {
    if (!confirm('Are you sure you want to return this book?')) return;

    try {
      await api.post(`/borrowed-books/return/${bookId}/${userId}`);
      fetchBorrowedBooks();
    } catch (error) {
      alert('Failed to return book');
    }
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    fetchBorrowedBooks();
  };

  const activeBorrows = borrowedBooks.filter((b) => !b.returnedAt);
  const returnedBorrows = borrowedBooks.filter((b) => b.returnedAt);

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold text-gray-900">Borrowed Books</h1>
        <button
          onClick={() => setIsModalOpen(true)}
          className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
        >
          <Library className="mr-2 h-5 w-5" />
          Borrow Book
        </button>
      </div>

      <div className="bg-white shadow rounded-lg p-6 mb-6">
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Filter by User
        </label>
        <UserSelect
          value={selectedUserId}
          onChange={setSelectedUserId}
          includeAll
        />
      </div>

      {loading ? (
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
        </div>
      ) : (
        <div className="space-y-6">
          {activeBorrows.length > 0 && (
            <div>
              <h2 className="text-xl font-semibold text-gray-900 mb-4">Active Borrows</h2>
              <div className="bg-white shadow overflow-hidden sm:rounded-md">
                <ul className="divide-y divide-gray-200">
                  {activeBorrows.map((borrowed) => (
                    <li key={borrowed.id}>
                      <div className="px-4 py-4 sm:px-6 hover:bg-gray-50">
                        <div className="flex items-center justify-between">
                          <div className="flex-1">
                            <p className="text-lg font-medium text-gray-900">
                              {borrowed.book?.title ?? 'Unknown book'}
                            </p>
                            <p className="text-sm text-gray-500">
                              Author: {borrowed.book?.author?.name ?? 'Unknown author'}
                            </p>
                            <p className="text-sm text-gray-500">
                              Borrowed by:{' '}
                              {borrowed.user?.name ?? 'Unknown user'} (
                              {borrowed.user?.email ?? 'no-email@example.com'})
                            </p>
                            <p className="text-xs text-gray-400 mt-1">
                              Borrowed on:{' '}
                              {borrowed.borrowedAt
                                ? new Date(borrowed.borrowedAt).toLocaleDateString()
                                : 'Unknown date'}
                            </p>
                          </div>
                          <button
                            onClick={() => handleReturn(borrowed.bookId, borrowed.userId)}
                            className="ml-4 inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-green-600 hover:bg-green-700"
                          >
                            <ArrowLeft className="mr-2 h-4 w-4" />
                            Return
                          </button>
                        </div>
                      </div>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          )}

          {returnedBorrows.length > 0 && (
            <div>
              <h2 className="text-xl font-semibold text-gray-900 mb-4">Returned Books</h2>
              <div className="bg-white shadow overflow-hidden sm:rounded-md">
                <ul className="divide-y divide-gray-200">
                  {returnedBorrows.map((borrowed) => (
                    <li key={borrowed.id}>
                      <div className="px-4 py-4 sm:px-6 hover:bg-gray-50">
                        <div className="flex items-center justify-between">
                          <div className="flex-1">
                            <p className="text-lg font-medium text-gray-900">
                              {borrowed.book?.title ?? 'Unknown book'}
                            </p>
                            <p className="text-sm text-gray-500">
                              Author: {borrowed.book?.author?.name ?? 'Unknown author'}
                            </p>
                            <p className="text-sm text-gray-500">
                              Borrowed by:{' '}
                              {borrowed.user?.name ?? 'Unknown user'} (
                              {borrowed.user?.email ?? 'no-email@example.com'})
                            </p>
                            <p className="text-xs text-gray-400 mt-1">
                              Returned on:{' '}
                              {borrowed.returnedAt
                                ? new Date(borrowed.returnedAt).toLocaleDateString()
                                : 'Unknown date'}
                            </p>
                          </div>
                        </div>
                      </div>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          )}

          {activeBorrows.length === 0 && returnedBorrows.length === 0 && (
            <div className="text-center py-12">
              <Library className="mx-auto h-12 w-12 text-gray-400" />
              <h3 className="mt-2 text-sm font-medium text-gray-900">No borrowed books</h3>
              <p className="mt-1 text-sm text-gray-500">No books have been borrowed yet.</p>
            </div>
          )}
        </div>
      )}

      {isModalOpen && (
        <BorrowModal
          onClose={handleCloseModal}
        />
      )}
    </div>
  );
}


