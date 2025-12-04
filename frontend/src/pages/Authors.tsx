import { useEffect, useState } from 'react';
import api from '../services/api';
import { Plus, Edit, Trash2, Users } from 'lucide-react';
import AuthorModal from '../components/AuthorModal';

interface Author {
  id: string;
  name: string;
  bio?: string;
  _count?: {
    books: number;
  };
}

export default function Authors() {
  const [authors, setAuthors] = useState<Author[]>([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingAuthor, setEditingAuthor] = useState<Author | null>(null);

  const fetchAuthors = async () => {
    try {
      setLoading(true);
      const response = await api.get('/authors');
      setAuthors(response.data);
    } catch (error) {
      console.error('Failed to fetch authors:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAuthors();
  }, []);

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this author?')) return;

    try {
      await api.delete(`/authors/${id}`);
      fetchAuthors();
    } catch (error) {
      alert('Failed to delete author');
    }
  };

  const handleEdit = (author: Author) => {
    setEditingAuthor(author);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setEditingAuthor(null);
    fetchAuthors();
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold text-gray-900">Authors</h1>
        <button
          onClick={() => setIsModalOpen(true)}
          className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
        >
          <Plus className="mr-2 h-5 w-5" />
          Add Author
        </button>
      </div>

      {loading ? (
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
        </div>
      ) : authors.length === 0 ? (
        <div className="text-center py-12">
          <Users className="mx-auto h-12 w-12 text-gray-400" />
          <h3 className="mt-2 text-sm font-medium text-gray-900">No authors</h3>
          <p className="mt-1 text-sm text-gray-500">Get started by creating a new author.</p>
        </div>
      ) : (
        <div className="bg-white shadow overflow-hidden sm:rounded-md">
          <ul className="divide-y divide-gray-200">
            {authors.map((author) => (
              <li key={author.id}>
                <div className="px-4 py-4 sm:px-6 hover:bg-gray-50">
                  <div className="flex items-center justify-between">
                    <div className="flex-1">
                      <p className="text-lg font-medium text-gray-900">
                        {author.name}
                      </p>
                      {author.bio && (
                        <p className="mt-1 text-sm text-gray-500">{author.bio}</p>
                      )}
                      {author._count && (
                        <p className="mt-1 text-sm text-gray-500">
                          {author._count.books} book{author._count.books !== 1 ? 's' : ''}
                        </p>
                      )}
                    </div>
                    <div className="ml-4 flex-shrink-0 flex space-x-2">
                      <button
                        onClick={() => handleEdit(author)}
                        className="text-primary-600 hover:text-primary-900"
                      >
                        <Edit className="h-5 w-5" />
                      </button>
                      <button
                        onClick={() => handleDelete(author.id)}
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
        <AuthorModal
          author={editingAuthor}
          onClose={handleCloseModal}
        />
      )}
    </div>
  );
}


