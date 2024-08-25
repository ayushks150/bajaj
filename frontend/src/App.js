import React, { useState } from 'react';

const App = () => {
  const [jsonInput, setJsonInput] = useState('');
  const [response, setResponse] = useState(null);
  const [error, setError] = useState('');

  const handleChange = (e) => {
    setJsonInput(e.target.value);
    setError('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    try {
      // Trim any extra whitespace characters
      const trimmedInput = jsonInput.trim();
      const parsedInput = JSON.parse(trimmedInput);

      // Check if JSON contains a "data" array
      if (!parsedInput.data || !Array.isArray(parsedInput.data)) {
        setError('Invalid JSON format. Ensure the JSON contains a "data" array.');
        return;
      }

      // Make a POST request to the server
      const res = await fetch('http://localhost:3000/bfhl', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(parsedInput),
      });

      if (!res.ok) {
        throw new Error('Failed to fetch from the API');
      }

      const result = await res.json();
      setResponse(result);
    } catch (err) {
      setError(`Invalid JSON input: ${err.message}`);
    }
  };

  return (
    <div>
      <form onSubmit={handleSubmit}>
        <textarea
          rows="4"
          value={jsonInput}
          onChange={handleChange}
          placeholder='Enter JSON here (e.g., {"data":["1","a","33"]})'
        />
        <button type="submit">Submit</button>
      </form>

      {error && <div style={{ color: 'red' }}>{error}</div>}
      {response && <div style={{ color: 'green' }}>{JSON.stringify(response)}</div>}
    </div>
  );
};

export default App;
