import React, { useState } from 'react';
import CopilotResponse from './components/CopilotResponse';
import {
  PieChart, Pie, Cell,
  BarChart, Bar,
  LineChart, Line,
  XAxis, YAxis, CartesianGrid, Tooltip, Legend
} from 'recharts';
import './App.css';

const COLORS = ['#8884d8', '#82ca9d', '#ffc658', '#ff7f50', '#a29bfe'];

function App() {
  const [query, setQuery] = useState('');
  const [history, setHistory] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [widgets, setWidgets] = useState([]);
  const [activeWidget, setActiveWidget] = useState(null);

  const handleAsk = async () => {
    if (!query.trim()) return;
    setIsLoading(true);

    try {
      const response = await fetch(`http://localhost:8000/ask?query=${encodeURIComponent(query)}`);
      const data = await response.json();

      const newEntry = {
        agent: data.agent,
        query,
        response: data.response,
      };

      setHistory((prev) => [...prev, newEntry]);
      setQuery('');
    } catch (error) {
      alert('Error getting response from API');
    } finally {
      setIsLoading(false);
    }
  };

  const handleSaveWidget = (widget) => {
    setWidgets((prev) => [...prev, widget]);
  };

  const handleDeleteWidget = (indexToDelete) => {
    setWidgets((prev) => prev.filter((_, idx) => idx !== indexToDelete));
  };

  return (
    <div className="main-layout">
      {/* Sidebar */}
      <div className="sidebar">
        <h3>Saved Widgets</h3>
        {widgets.map((widget, index) => (
          <div key={index} style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <button
              className="widget-button"
              onClick={() => setActiveWidget(widget)}
              style={{ flexGrow: 1 }}
            >
              {widget.icon} {widget.name}
            </button>
            <button onClick={() => handleDeleteWidget(index)} style={{ border: 'none', background: 'none', cursor: 'pointer' }}>
              🗑️
            </button>
          </div>
        ))}
      </div>

      {/* Main App */}
      <div className="app-container">
        <h1 className="title">Web UI Copilot</h1>

        <div className="query-box">
          <input
            type="text"
            placeholder="Ask me anything..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleAsk()}
          />
          <button onClick={handleAsk} disabled={isLoading}>
            {isLoading ? 'Thinking...' : 'Ask'}
          </button>
        </div>

        <div className="history">
          {[...history].reverse().map((entry, index) => (
            <CopilotResponse
              key={index}
              response={entry}
              onSaveWidget={handleSaveWidget}
            />
          ))}
        </div>
      </div>

      {/* Widget Chart Popup */}
      {activeWidget && (
        <div className="popup-overlay">
          <div className="popup-content centered-popup">
            <button className="popup-close" onClick={() => setActiveWidget(null)}>&times;</button>
            <h3>{activeWidget.icon} {activeWidget.name}</h3>

            {activeWidget.chartType === 'bar' && (
              <BarChart width={500} height={300} data={activeWidget.chartData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Bar dataKey="value" fill="#8884d8" />
              </BarChart>
            )}

            {activeWidget.chartType === 'pie' && (
              <PieChart width={400} height={300}>
                <Pie
                  data={activeWidget.chartData}
                  dataKey="value"
                  nameKey="name"
                  outerRadius={100}
                  label
                >
                  {activeWidget.chartData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            )}

            {activeWidget.chartType === 'line' && (
              <LineChart width={500} height={300} data={activeWidget.chartData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Line type="monotone" dataKey="value" stroke="#8884d8" />
              </LineChart>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

export default App;
