import { useEffect, useState } from 'react';
import api from '../services/api';
import { Plus, Search, Edit, Trash2, BookOpen } from 'lucide-react';
import BookModal from '../components/BookModal';
import AuthorSelect from '../components/AuthorSelect';

interface Book {
  id: string;
  title: string;
  isbn?: string;
  publishedAt?: string;
  author: {
    id: string;
    name: string;
  };
  borrowedBooks: Array<{ id: string; returnedAt?: string | null }>;
}

export default function Books() {
  const [books, setBooks] = useState<Book[]>([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingBook, setEditingBook] = useState<Book | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [authorFilter, setAuthorFilter] = useState('');
  const [borrowedFilter, setBorrowedFilter] = useState('');

  const fetchBooks = async () => {
    try {
      setLoading(true);
      const params: any = {};
      if (searchTerm) params.search = searchTerm;
      if (authorFilter) params.authorId = authorFilter;
      if (borrowedFilter) params.borrowed = borrowedFilter;

      const response = await api.get('/books', { params });
      setBooks(response.data.data || response.data);
    } catch (error) {
      console.error('Failed to fetch books:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBooks();
  }, [searchTerm, authorFilter, borrowedFilter]);

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this book?')) return;

    try {
      await api.delete(`/books/${id}`);
      fetchBooks();
    } catch (error) {
      alert('Failed to delete book');
    }
  };

  const handleEdit = (book: Book) => {
    setEditingBook(book);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setEditingBook(null);
    fetchBooks();
  };

  const isBorrowed = (book: Book) => {
    return book.borrowedBooks?.some((b) => !b.returnedAt) || false;
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold text-gray-900">Books</h1>
        <button
          onClick={() => setIsModalOpen(true)}
          className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
        >
          <Plus className="mr-2 h-5 w-5" />
          Add Book
        </button>
      </div>

      <div className="bg-white shadow rounded-lg p-6 mb-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Search
            </label>
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
              <input
                type="text"
                placeholder="Search books..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 block w-full border-gray-300 rounded-md shadow-sm focus:ring-primary-500 focus:border-primary-500 sm:text-sm"
              />
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Author
            </label>
            <AuthorSelect
              value={authorFilter}
              onChange={setAuthorFilter}
              includeAll
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Borrowed Status
            </label>
            <select
              value={borrowedFilter}
              onChange={(e) => setBorrowedFilter(e.target.value)}
              className="block w-full border-gray-300 rounded-md shadow-sm focus:ring-primary-500 focus:border-primary-500 sm:text-sm"
            >
              <option value="">All</option>
              <option value="true">Borrowed</option>
              <option value="false">Available</option>
            </select>
          </div>
        </div>
      </div>

      {loading ? (
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
        </div>
      ) : books.length === 0 ? (
        <div className="text-center py-12">
          <BookOpen className="mx-auto h-12 w-12 text-gray-400" />
          <h3 className="mt-2 text-sm font-medium text-gray-900">No books</h3>
          <p className="mt-1 text-sm text-gray-500">Get started by creating a new book.</p>
        </div>
      ) : (
        <div className="bg-white shadow overflow-hidden sm:rounded-md">
          <ul className="divide-y divide-gray-200">
            {books.map((book) => (
              <li key={book.id}>
                <div className="px-4 py-4 sm:px-6 hover:bg-gray-50">
                  <div className="flex items-center justify-between">
                    <div className="flex-1">
                      <div className="flex items-center">
                        <p className="text-lg font-medium text-gray-900">
                          {book.title}
                        </p>
                        {isBorrowed(book) && (
                          <span className="ml-2 inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800">
                            Borrowed
                          </span>
                        )}
                      </div>
                      <div className="mt-2 sm:flex sm:justify-between">
                        <div className="sm:flex">
                          <p className="flex items-center text-sm text-gray-500">
                            Author: {book.author.name}
                          </p>
                          {book.isbn && (
                            <p className="mt-2 flex items-center text-sm text-gray-500 sm:mt-0 sm:ml-6">
                              ISBN: {book.isbn}
                            </p>
                          )}
                          {book.publishedAt && (
                            <p className="mt-2 flex items-center text-sm text-gray-500 sm:mt-0 sm:ml-6">
                              Published: {new Date(book.publishedAt).getFullYear()}
                            </p>
                          )}
                        </div>
                      </div>
                    </div>
                    <div className="ml-4 flex-shrink-0 flex space-x-2">
                      <button
                        onClick={() => handleEdit(book)}
                        className="text-primary-600 hover:text-primary-900"
                      >
                        <Edit className="h-5 w-5" />
                      </button>
                      <button
                        onClick={() => handleDelete(book.id)}
                        className="text-red-600 hover:text-red-900"
                      >
                        <Trash2 className="h-5 w-5" />
                      </button>
                    </div>
                  </div>
                </div>
              </li>
            ))}
          </ul>
        </div>
      )}

      {isModalOpen && (
        <BookModal
          book={editingBook}
          onClose={handleCloseModal}
        />
      )}
    </div>
  );
}

