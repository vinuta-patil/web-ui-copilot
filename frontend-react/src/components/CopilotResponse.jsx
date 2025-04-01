import React, { useState } from 'react';
import {
  PieChart, Pie, Cell,
  BarChart, Bar,
  LineChart, Line,
  XAxis, YAxis, CartesianGrid, Tooltip, Legend
} from 'recharts';

const COLORS = ['#8884d8', '#82ca9d', '#ffc658', '#ff7f50', '#a29bfe'];
const ICONS = ['🌍', '📊', '🍎', '🏥', '🧠', '🥗', '🛰️', '🔥', '🌋'];

function CopilotResponse({ response, onSaveWidget }) {
  const [showChart, setShowChart] = useState(false);
  const [chartData, setChartData] = useState([]);
  const [chartType, setChartType] = useState('bar');
  const [showSavePopup, setShowSavePopup] = useState(false);
  const [widgetName, setWidgetName] = useState('');
  const [selectedIcon, setSelectedIcon] = useState(ICONS[0]);

  if (!response) return null;
  if (response.error) return <div className="response-box error">⚠️ {response.error}</div>;

  const { agent, query, response: text } = response;

  const tryRenderChart = () => {
    try {
      const parsed = JSON.parse(text);
      let dataArray = [];

      if (!Array.isArray(parsed)) {
        const keys = Object.keys(parsed);
        if (typeof parsed[keys[0]] === 'number' || typeof parsed[keys[0]] === 'string') {
          dataArray = keys.map(key => ({
            name: key,
            value: typeof parsed[key] === 'string' ? parseFloat(parsed[key].replace(/[^\d.-]/g, '')) : parsed[key]
          }));
        } else {
          const firstKey = keys[0];
          if (Array.isArray(parsed[firstKey])) {
            dataArray = parsed[firstKey];
          } else {
            throw new Error("Unsupported object format");
          }
        }
      } else {
        dataArray = parsed;
      }

      const sample = dataArray[0];
      const labelKey = Object.keys(sample).find(k =>
        ["continent", "country", "region", "name"].includes(k.toLowerCase())
      );
      const valueKey = Object.keys(sample).find(k =>
        ["percentage", "rate", "value", "count", "death_rate", "undernourished_percentage"].includes(k.toLowerCase())
      );

      if (!labelKey || !valueKey) throw new Error("No valid keys found");

      const parsedData = dataArray.map(item => ({
        name: item[labelKey],
        value: typeof item[valueKey] === 'string'
          ? parseFloat(item[valueKey].replace(/[^\d.-]/g, ''))
          : item[valueKey]
      }));

      setChartData(parsedData);
      setChartType(['bar', 'pie', 'line'][Math.floor(Math.random() * 3)]);
      setShowChart(true);
    } catch (e) {
      alert("❌ Could not parse chart. Ask for numeric JSON.");
    }
  };

  const handleSave = () => {
    if (!widgetName.trim()) return alert("Please enter a widget name.");
    onSaveWidget({
      name: widgetName,
      icon: selectedIcon,
      chartData,
      chartType
    });
    setShowSavePopup(false);
    setWidgetName('');
  };

  return (
    <div className="response-box">
      <p><strong>Agent:</strong> {agent}</p>
      <p><strong>Query:</strong> {query}</p>
      <p><strong>Response:</strong></p>
      <pre>{text}</pre>

      <button onClick={tryRenderChart}>📊 Generate Chart</button>

      {showChart && chartData.length > 0 && (
        <div style={{ position: 'relative' }}>
          <button
            style={{
              position: 'absolute',
              right: 10,
              top: -10,
              fontSize: '1.2rem',
              cursor: 'pointer',
              border: 'none',
              background: 'none'
            }}
            onClick={() => setShowSavePopup(true)}
            title="Save as Widget"
          >➕</button>

          {chartType === 'bar' && (
            <BarChart width={500} height={300} data={chartData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Bar dataKey="value" fill="#8884d8" />
            </BarChart>
          )}

          {chartType === 'pie' && (
            <PieChart width={400} height={300}>
              <Pie
                data={chartData}
                dataKey="value"
                nameKey="name"
                outerRadius={100}
                label
              >
                {chartData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip />
            </PieChart>
          )}

          {chartType === 'line' && (
            <LineChart width={500} height={300} data={chartData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Line type="monotone" dataKey="value" stroke="#8884d8" />
            </LineChart>
          )}
        </div>
      )}

      {showSavePopup && (
        <div style={{
          background: '#fff',
          border: '1px solid #ccc',
          padding: '1rem',
          borderRadius: '8px',
          boxShadow: '0 2px 8px rgba(0,0,0,0.2)',
          marginTop: '1rem'
        }}>
          <h4>Save Widget</h4>
          <input
            type="text"
            placeholder="Widget name"
            value={widgetName}
            onChange={(e) => setWidgetName(e.target.value)}
          />
          <div style={{ marginTop: '0.5rem' }}>
            {ICONS.map((icon, idx) => (
              <button
                key={idx}
                onClick={() => setSelectedIcon(icon)}
                style={{
                  fontSize: '1.5rem',
                  margin: '0.2rem',
                  background: icon === selectedIcon ? '#dfe6e9' : 'transparent',
                  border: 'none',
                  cursor: 'pointer'
                }}
              >
                {icon}
              </button>
            ))}
          </div>
          <button onClick={handleSave} style={{ marginTop: '0.5rem' }}>
            Save
          </button>
        </div>
      )}
    </div>
  );
}

export default CopilotResponse;
