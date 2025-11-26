'use client';

import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase';

export default function TestDepartments() {
  const [data, setData] = useState<any>(null);
  const [error, setError] = useState<any>(null);

  useEffect(() => {
    testConnection();
  }, []);

  const testConnection = async () => {
    console.log('Testing Supabase connection...');
    
    // Test 1: Check if table exists
    const { data: testData, error: testError } = await supabase
      .from('department')
      .select('*')
      .limit(5);

    console.log('Test Result:', { testData, testError });
    
    if (testError) {
      setError(testError);
      console.error('Error:', testError);
    } else {
      setData(testData);
      console.log('Success! Data:', testData);
    }
  };

  const testInsert = async () => {
    console.log('Testing insert...');
    const { data: insertData, error: insertError } = await supabase
      .from('department')
      .insert([
        {
          department_name: 'Test Department',
          establish_year: 2025,
          department_hod_id: null,
          admin_email: 'mdmomin7517@gmail.com',
          is_department_active: true
        }
      ])
      .select();

    console.log('Insert Result:', { insertData, insertError });
    
    if (!insertError) {
      testConnection();
    }
  };

  return (
    <div className="p-8">
      <h1 className="text-2xl font-bold mb-4">Department Test Page</h1>
      
      <div className="space-y-4">
        <button
          onClick={testConnection}
          className="px-4 py-2 bg-blue-500 text-white rounded"
        >
          Test Fetch
        </button>
        
        <button
          onClick={testInsert}
          className="px-4 py-2 bg-green-500 text-white rounded ml-2"
        >
          Test Insert
        </button>

        {error && (
          <div className="p-4 bg-red-100 border border-red-400 rounded">
            <h2 className="font-bold text-red-800">Error:</h2>
            <pre className="text-sm">{JSON.stringify(error, null, 2)}</pre>
          </div>
        )}

        {data && (
          <div className="p-4 bg-green-100 border border-green-400 rounded">
            <h2 className="font-bold text-green-800">Success! Found {data.length} departments:</h2>
            <pre className="text-sm">{JSON.stringify(data, null, 2)}</pre>
          </div>
        )}
      </div>
    </div>
  );
}
