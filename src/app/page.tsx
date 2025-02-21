"use client";

import { useState } from 'react';

interface ApiResponse {
  is_success: boolean;
  user_id: string;
  email: string;
  roll_number: string;
  numbers: string[];
  alphabets: string[];
  highest_alphabet: string[];
}

export default function Home() {
  const [input, setInput] = useState<string>('');
  const [response, setResponse] = useState<ApiResponse | null>(null);
  const [error, setError] = useState<string>('');
  const [selectedFilters, setSelectedFilters] = useState<string[]>([]);

  const handleSubmit = async () => {
    try {
      const parsedInput = JSON.parse(input);
      if (!parsedInput || !Array.isArray(parsedInput.data)) {
        throw new Error('Invalid JSON format. Make sure it is in the format: {"data": ["A", "1", "B"]}.');
      }

      const res = await fetch('/api/bfhl', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(parsedInput),
      });

      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.error || `HTTP error! Status: ${res.status}`);
      }

      const data: ApiResponse = await res.json();
      setResponse(data);
      setError('');
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    } catch (err) {
      setError( 'An unexpected error occurred. Please check your input and try again.');
      setResponse(null);
    }
  };

  const handleFilterChange = (filter: string) => {
    setSelectedFilters(
      selectedFilters.includes(filter)
        ? selectedFilters.filter((f) => f !== filter)
        : [...selectedFilters, filter]
    );
  };

  const renderResponse = () => {
    if (!response) return null;

    const filteredResponse: Partial<ApiResponse> = {};
    if (selectedFilters.includes('numbers')) {
      filteredResponse.numbers = response.numbers;
    }
    if (selectedFilters.includes('alphabets')) {
      filteredResponse.alphabets = response.alphabets;
    }
    if (selectedFilters.includes('highest_alphabet')) {
      filteredResponse.highest_alphabet = response.highest_alphabet;
    }

    return (
      <div className="mt-6 p-6 bg-white rounded-lg shadow-md">
        <h2 className="text-2xl font-bold mb-4 text-black">Response:</h2>
        <pre className="bg-black text-white p-4 rounded-md">
          {JSON.stringify(filteredResponse, null, 2)}
        </pre>
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-white py-10 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-4xl font-bold text-center text-black mb-8">
          2236801
        </h1>

        <div className="bg-white p-6 rounded-lg shadow-md">
          <textarea
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder='Enter JSON input (e.g., { "data": ["A", "1", "334"] })'
            className="w-full p-3 border border-black rounded-md focus:outline-none focus:ring-2 focus:ring-black"
            rows={5}
            style={{ color: 'black' }}
          />
          <button
            onClick={handleSubmit}
            className="mt-4 w-full bg-black text-white py-2 px-4 rounded-md hover:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-black"
          >
            Submit
          </button>

          {error && (
            <p className="mt-4 text-red-600 text-sm text-center">{error}</p>
          )}
        </div>

        {response && (
          <div className="mt-8">
            <h3 className="text-xl font-semibold mb-4 text-black">Filters:</h3>
            <div className="flex space-x-4">
              <label className="flex items-center space-x-2 text-black">
                <input
                  type="checkbox"
                  checked={selectedFilters.includes('numbers')}
                  onChange={() => handleFilterChange('numbers')}
                  className="form-checkbox h-5 w-5 text-black"
                />
                <span>Numbers</span>
              </label>
              <label className="flex items-center space-x-2 text-black">
                <input
                  type="checkbox"
                  checked={selectedFilters.includes('alphabets')}
                  onChange={() => handleFilterChange('alphabets')}
                  className="form-checkbox h-5 w-5 text-black"
                />
                <span>Alphabets</span>
              </label>
              <label className="flex items-center space-x-2 text-black">
                <input
                  type="checkbox"
                  checked={selectedFilters.includes('highest_alphabet')}
                  onChange={() => handleFilterChange('highest_alphabet')}
                  className="form-checkbox h-5 w-5 text-black"
                />
                <span>Highest Alphabet</span>
              </label>
            </div>
            {renderResponse()}
          </div>
        )}
      </div>
    </div>
  );
}
