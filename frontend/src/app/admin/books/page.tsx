"use client";

import { useState, useEffect } from "react";
import { Plus, Edit2, Trash2, X } from "lucide-react";

export default function AdminBooks() {
  const [books, setBooks] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [formData, setFormData] = useState({ title: "", author: "", price: "", stock: "", category: "" });

  const fetchBooks = () => {
    setLoading(true);
    fetch("http://localhost:3002/api/books/")
      .then(res => res.json())
      .then(data => {
        setBooks(data.books || []);
        setLoading(false);
      });
  };

  useEffect(() => {
    fetchBooks();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const payload = {
      ...formData,
      price: parseFloat(formData.price),
      stock: parseInt(formData.stock, 10)
    };

    await fetch("http://localhost:3002/api/books/", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload)
    });
    
    setIsModalOpen(false);
    setFormData({ title: "", author: "", price: "", stock: "", category: "" });
    fetchBooks();
  };

  const handleDelete = async (id: string) => {
    if(confirm("Are you sure?")) {
      await fetch(`http://localhost:3002/api/books/${id}`, { method: "DELETE" });
      fetchBooks();
    }
  };

  return (
    <div className="animate-fade-in-up">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-semibold">Manage Inventory</h1>
        <button 
          onClick={() => setIsModalOpen(true)}
          className="bg-black text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-gray-800 transition-colors flex items-center gap-2"
        >
          <Plus className="w-4 h-4" /> Add Book
        </button>
      </div>

      <div className="bg-white border border-gray-200 rounded-2xl overflow-hidden shadow-sm">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-gray-50 border-b border-gray-200">
              <th className="px-6 py-4 text-sm font-semibold text-gray-600">Title</th>
              <th className="px-6 py-4 text-sm font-semibold text-gray-600">Author</th>
              <th className="px-6 py-4 text-sm font-semibold text-gray-600">Price</th>
              <th className="px-6 py-4 text-sm font-semibold text-gray-600">Stock</th>
              <th className="px-6 py-4 text-sm font-semibold text-gray-600 text-right">Actions</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr><td colSpan={5} className="px-6 py-8 text-center text-gray-500">Loading...</td></tr>
            ) : books.length === 0 ? (
              <tr><td colSpan={5} className="px-6 py-8 text-center text-gray-500">No books found.</td></tr>
            ) : (
              books.map(book => (
                <tr key={book._id} className="border-b border-gray-100 hover:bg-gray-50 transition-colors">
                  <td className="px-6 py-4 font-medium">{book.title}</td>
                  <td className="px-6 py-4 text-gray-600">{book.author}</td>
                  <td className="px-6 py-4">${book.price.toFixed(2)}</td>
                  <td className="px-6 py-4">
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${book.stock > 0 ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
                      {book.stock} in stock
                    </span>
                  </td>
                  <td className="px-6 py-4 flex items-center justify-end gap-3">
                    <button className="text-gray-400 hover:text-black transition-colors"><Edit2 className="w-4 h-4" /></button>
                    <button onClick={() => handleDelete(book._id)} className="text-gray-400 hover:text-red-500 transition-colors"><Trash2 className="w-4 h-4" /></button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {isModalOpen && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 animate-fade-in-overlay">
          <div className="bg-white rounded-2xl p-6 w-full max-w-md animate-slide-up-overlay">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-xl font-semibold">Add New Book</h2>
              <button onClick={() => setIsModalOpen(false)} className="text-gray-400 hover:text-black"><X className="w-5 h-5" /></button>
            </div>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-1">Title</label>
                <input required type="text" className="w-full border border-gray-300 rounded-lg px-3 py-2" value={formData.title} onChange={e => setFormData({...formData, title: e.target.value})} />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Author</label>
                <input required type="text" className="w-full border border-gray-300 rounded-lg px-3 py-2" value={formData.author} onChange={e => setFormData({...formData, author: e.target.value})} />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-1">Price ($)</label>
                  <input required type="number" step="0.01" className="w-full border border-gray-300 rounded-lg px-3 py-2" value={formData.price} onChange={e => setFormData({...formData, price: e.target.value})} />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">Stock</label>
                  <input required type="number" className="w-full border border-gray-300 rounded-lg px-3 py-2" value={formData.stock} onChange={e => setFormData({...formData, stock: e.target.value})} />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Category</label>
                <input required type="text" className="w-full border border-gray-300 rounded-lg px-3 py-2" value={formData.category} onChange={e => setFormData({...formData, category: e.target.value})} />
              </div>
              <button type="submit" className="w-full bg-black text-white py-2.5 rounded-lg font-medium mt-6">Save Book</button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
