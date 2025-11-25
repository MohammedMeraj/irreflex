'use client';

import React, { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';

export const dynamic = 'force-dynamic';

interface TestRecord {
  id: number;
  firstname: string;
  middlename: string;
  lastname: string;
  age: number;
  created_at?: string;
}

const Supabase = () => {
  const [records, setRecords] = useState<TestRecord[]>([]);
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    firstname: '',
    middlename: '',
    lastname: '',
    age: ''
  });

  // Fetch all records
  const fetchRecords = async () => {
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from('test')
        .select('*')
        .order('id', { ascending: false });

      if (error) throw error;
      setRecords(data || []);
    } catch (error: any) {
      console.error('Error fetching records:', error.message);
      alert('Error fetching records: ' + error.message);
    } finally {
      setLoading(false);
    }
  };

  // Add a new record
  const addRecord = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const { data, error } = await supabase
        .from('test')
        .insert([
          {
            firstname: formData.firstname,
            middlename: formData.middlename,
            lastname: formData.lastname,
            age: parseInt(formData.age)
          }
        ])
        .select();

      if (error) throw error;

      alert('Record added successfully!');
      setFormData({ firstname: '', middlename: '', lastname: '', age: '' });
      fetchRecords();
    } catch (error: any) {
      console.error('Error adding record:', error.message);
      alert('Error adding record: ' + error.message);
    } finally {
      setLoading(false);
    }
  };

  // Delete a record
  const deleteRecord = async (id: number) => {
    if (!confirm('Are you sure you want to delete this record?')) return;

    setLoading(true);
    try {
      const { error } = await supabase
        .from('test')
        .delete()
        .eq('id', id);

      if (error) throw error;

      alert('Record deleted successfully!');
      fetchRecords();
    } catch (error: any) {
      console.error('Error deleting record:', error.message);
      alert('Error deleting record: ' + error.message);
    } finally {
      setLoading(false);
    }
  };

  // Add sample records
  const addSampleRecords = async () => {
    setLoading(true);
    try {
      const sampleData = [
        { firstname: 'John', middlename: 'Michael', lastname: 'Doe', age: 25 },
        { firstname: 'Jane', middlename: 'Elizabeth', lastname: 'Smith', age: 30 },
        { firstname: 'Bob', middlename: 'James', lastname: 'Johnson', age: 35 },
      ];

      const { error } = await supabase
        .from('test')
        .insert(sampleData);

      if (error) throw error;

      alert('Sample records added successfully!');
      fetchRecords();
    } catch (error: any) {
      console.error('Error adding sample records:', error.message);
      alert('Error adding sample records: ' + error.message);
    } finally {
      setLoading(false);
    }
  };

  // Delete all records
  const deleteAllRecords = async () => {
    if (!confirm('Are you sure you want to delete ALL records? This cannot be undone!')) return;

    setLoading(true);
    try {
      const { error } = await supabase
        .from('test')
        .delete()
        .neq('id', 0); // Delete all records

      if (error) throw error;

      alert('All records deleted successfully!');
      fetchRecords();
    } catch (error: any) {
      console.error('Error deleting all records:', error.message);
      alert('Error deleting all records: ' + error.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRecords();
  }, []);

  return (
    <div className="container mx-auto p-8 max-w-6xl">
      <h1 className="text-3xl font-bold mb-8">Supabase Test Page</h1>

      {/* Add Record Form */}
      <div className="bg-white shadow-md rounded-lg p-6 mb-8">
        <h2 className="text-xl font-semibold mb-4">Add New Record</h2>
        <form onSubmit={addRecord} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium mb-1">First Name *</label>
              <input
                type="text"
                required
                value={formData.firstname}
                onChange={(e) => setFormData({ ...formData, firstname: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Enter first name"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Middle Name</label>
              <input
                type="text"
                value={formData.middlename}
                onChange={(e) => setFormData({ ...formData, middlename: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Enter middle name"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Last Name *</label>
              <input
                type="text"
                required
                value={formData.lastname}
                onChange={(e) => setFormData({ ...formData, lastname: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Enter last name"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Age *</label>
              <input
                type="number"
                required
                min="1"
                max="150"
                value={formData.age}
                onChange={(e) => setFormData({ ...formData, age: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Enter age"
              />
            </div>
          </div>
          <button
            type="submit"
            disabled={loading}
            className="w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition"
          >
            {loading ? 'Adding...' : 'Add Record'}
          </button>
        </form>
      </div>

      {/* Action Buttons */}
      <div className="flex gap-4 mb-8">
        <button
          onClick={addSampleRecords}
          disabled={loading}
          className="bg-green-600 text-white py-2 px-6 rounded-md hover:bg-green-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition"
        >
          Add Sample Records
        </button>
        <button
          onClick={fetchRecords}
          disabled={loading}
          className="bg-blue-600 text-white py-2 px-6 rounded-md hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition"
        >
          Refresh
        </button>
        <button
          onClick={deleteAllRecords}
          disabled={loading}
          className="bg-red-600 text-white py-2 px-6 rounded-md hover:bg-red-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition"
        >
          Delete All Records
        </button>
      </div>

      {/* Records Table */}
      <div className="bg-white shadow-md rounded-lg p-6">
        <h2 className="text-xl font-semibold mb-4">
          Records ({records.length})
        </h2>
        {loading && <p className="text-gray-500">Loading...</p>}
        {!loading && records.length === 0 && (
          <p className="text-gray-500">No records found. Add some records to get started!</p>
        )}
        {!loading && records.length > 0 && (
          <div className="overflow-x-auto">
            <table className="w-full table-auto">
              <thead className="bg-gray-100">
                <tr>
                  <th className="px-4 py-2 text-left">ID</th>
                  <th className="px-4 py-2 text-left">First Name</th>
                  <th className="px-4 py-2 text-left">Middle Name</th>
                  <th className="px-4 py-2 text-left">Last Name</th>
                  <th className="px-4 py-2 text-left">Age</th>
                  <th className="px-4 py-2 text-center">Actions</th>
                </tr>
              </thead>
              <tbody>
                {records.map((record) => (
                  <tr key={record.id} className="border-t hover:bg-gray-50">
                    <td className="px-4 py-2">{record.id}</td>
                    <td className="px-4 py-2">{record.firstname}</td>
                    <td className="px-4 py-2">{record.middlename || '-'}</td>
                    <td className="px-4 py-2">{record.lastname}</td>
                    <td className="px-4 py-2">{record.age}</td>
                    <td className="px-4 py-2 text-center">
                      <button
                        onClick={() => deleteRecord(record.id)}
                        disabled={loading}
                        className="bg-red-500 text-white py-1 px-3 rounded hover:bg-red-600 disabled:bg-gray-400 disabled:cursor-not-allowed transition"
                      >
                        Delete
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Database Setup Instructions */}
      <div className="mt-8 bg-yellow-50 border border-yellow-200 rounded-lg p-6">
        <h3 className="text-lg font-semibold mb-2">📝 Database Setup Required</h3>
        <p className="mb-2">Run this SQL in your Supabase SQL Editor to create the table:</p>
        <pre className="bg-gray-900 text-green-400 p-4 rounded-md overflow-x-auto text-sm">
{`CREATE TABLE test (
  id BIGSERIAL PRIMARY KEY,
  firstname TEXT NOT NULL,
  middlename TEXT,
  lastname TEXT NOT NULL,
  age INTEGER NOT NULL CHECK (age > 0 AND age < 150),
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Enable Row Level Security
ALTER TABLE test ENABLE ROW LEVEL SECURITY;

-- Create policy to allow all operations (for testing only)
CREATE POLICY "Allow all operations" ON test
  FOR ALL
  USING (true)
  WITH CHECK (true);`}
        </pre>
      </div>
    </div>
  );
};

export default Supabase;