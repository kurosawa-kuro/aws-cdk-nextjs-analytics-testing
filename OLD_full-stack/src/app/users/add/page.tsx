'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';

export default function AddUserPage() {
  const router = useRouter();
  const [formData, setFormData] = useState({
    email: '',
    name: ''
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      const response = await fetch('/api/users', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });
      if (response.ok) {
        router.push('/');
      }
    } catch (error) {
      console.error('Error creating user:', error);
    }
  };

  return (
    <div className="grid grid-rows-[20px_1fr_20px] items-center justify-items-center min-h-screen p-8 pb-20 gap-16 sm:p-20 bg-white dark:bg-black text-gray-900 dark:text-gray-100">
      <main className="flex flex-col gap-8 row-start-2 items-center sm:items-start">
        <div className="w-full max-w-2xl">
          <div className="flex justify-between items-center mb-4">
            <h1 className="text-xl font-bold text-black dark:text-white">Add New User</h1>
          </div>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-1 text-gray-900 dark:text-gray-100">Email</label>
              <input
                type="email"
                required
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                className="w-full p-2 border border-gray-200 dark:border-gray-700 rounded-lg 
                          transition-colors bg-white dark:bg-gray-800 
                          text-gray-900 dark:text-gray-100
                          hover:border-transparent hover:bg-gray-100 dark:hover:bg-gray-700"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1 text-gray-900 dark:text-gray-100">Name</label>
              <input
                type="text"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                className="w-full p-2 border border-gray-200 dark:border-gray-700 rounded-lg 
                          transition-colors bg-white dark:bg-gray-800 
                          text-gray-900 dark:text-gray-100
                          hover:border-transparent hover:bg-gray-100 dark:hover:bg-gray-700"
              />
            </div>
            <button
              type="submit"
              className="rounded-full border border-solid border-transparent 
                       transition-colors flex items-center justify-center 
                       bg-gray-900 dark:bg-gray-100 
                       text-white dark:text-gray-900 
                       gap-2 hover:bg-gray-700 dark:hover:bg-gray-300 
                       text-sm sm:text-base h-10 sm:h-12 px-4 sm:px-5"
            >
              Add User
            </button>
          </form>
        </div>
      </main>
    </div>
  );
}