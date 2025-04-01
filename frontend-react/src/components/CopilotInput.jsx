import React from 'react';

function CopilotInput({ query, setQuery, handleAsk, loading }) {
  return (
    <div className="input-container">
      <input
        type="text"
        placeholder="Ask me anything..."
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        onKeyDown={(e) => e.key === 'Enter' && handleAsk()}
      />
      <button onClick={handleAsk} disabled={loading}>
        {loading ? 'Thinking...' : 'Ask'}
      </button>
    </div>
  );
}

export default CopilotInput;
