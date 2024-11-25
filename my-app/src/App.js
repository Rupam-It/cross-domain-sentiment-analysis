import React, { useState } from 'react';
import './App.css';

function App() {
  const [inputText, setInputText] = useState('');
  const [result, setResult] = useState(null);
  const [history, setHistory] = useState({});
  const [error, setError] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  // Handle Sentiment Analysis Submission
  const handleSubmit = async () => {
    // Check if input text is empty
    if (!inputText.trim()) {
      setError('Please enter some text to analyze.');
      return; // Stop execution if input is empty
    }

    setIsLoading(true);
    setError(null); // Reset error if the user entered text
    try {
      const response = await fetch('http://localhost:5000/api/sentiment', { // Replace with your backend URL
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ text: inputText }),
      });

      if (!response.ok) {
        throw new Error('Failed to fetch results from the backend');
      }

      const data = await response.json();
      setResult(data);

      // Add to history
      const timestamp = new Date().toLocaleString();
      setHistory((prevHistory) => ({
        ...prevHistory,
        [timestamp]: { input: inputText, output: data },
      }));

      setInputText(''); // Clear input after analysis
    } catch (err) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  // Clear History
  const clearHistory = () => {
    setHistory({});
  };

  // Toggle Sidebar
  const openSidebar = () => {
    setIsSidebarOpen(true);
  };

  const closeSidebar = () => {
    setIsSidebarOpen(false);
  };

  return (
    <div className="App">
      <nav className="NavBar">
        <h1>Sentiment <span>Analysis</span></h1>
      </nav>
      <div className="MainContainer">
        {isSidebarOpen && (
          <aside className={`Sidebar ${isSidebarOpen ? 'sidebar-visible' : ''}`}>
            <button onClick={closeSidebar} className="Sidebar-toggle">
              ❌
            </button>
            <h2>History</h2>
            {Object.keys(history).length > 0 ? (
              <>
                <button onClick={clearHistory}>Clear History</button>
                <ul>
                  {Object.entries(history).map(([time, entry]) => (
                    <li key={time}>
                      <strong>{time}</strong>: {entry.input} → {JSON.stringify(entry.output)}
                    </li>
                  ))}
                </ul>
              </>
            ) : (
              <p>No history available.</p>
            )}
          </aside>
        )}
        {!isSidebarOpen && (
          <button onClick={openSidebar} className="Sidebar-open">
            📂
          </button>
        )}
        <main className="Content">
          <header className="App-header">
            <div className="Input-section">
              <textarea
                placeholder="Enter text here..."
                value={inputText}
                onChange={(e) => setInputText(e.target.value)}
                rows="4"
                cols="50"
              />
              <button onClick={handleSubmit}>Analyze Sentiment</button>
            </div >
            {isLoading && <p className="result">Please wait...</p>}
            {error && (
              <div className="result" style={{ color: 'red' }}>
                <p>{error}</p>
              </div>
            )}
            {result && (
              <div>
                <h2>Latest Result:</h2>
                <p>{JSON.stringify(result)}</p>
              </div>
            )}
          </header>
        </main>
      </div>
      <footer className="Footer">
        © 2024 RCCIIT. All Rights Reserved.
      </footer>
    </div>
  );
}

export default App;
