# 🧠 Web UI Copilot

**Web UI Copilot** is an AI-powered, multi-agent assistant interface that allows users to ask complex queries and receive structured JSON responses from context-aware agents. These responses are instantly transformed into interactive visual charts.

This project serves as a **front-end Copilot** that:
- Interacts with multiple domain-specific agents
- Parses structured responses
- Dynamically renders data as visual charts
- Allows users to save and manage chart widgets in a dashboard-style interface

## Core Highlight: Agent-Aware Query Handling

The core innovation of this application lies in its **intelligent agent delegation system**.

###  Intelligent Agent Delegation

When a user types a query:
1. The query is sent to the backend endpoint:  
http://localhost:8000/ask?query=your+question

2. The backend intelligently routes the query to the correct agent based on keyword context (e.g., `general`, `clinical`, `food`).
3. Each agent returns a **structured JSON response**.
4. The frontend automatically:
- Parses this JSON
- Detects label/value pairs
- Selects the appropriate chart type
- Renders the data visually

>  **Main contribution**: Implementing seamless integration between:
> User query ➝ Agent selection ➝ JSON response ➝ Chart generation ➝ Widget saving

##  Features

### 🧠 Multi-Agent Query System
- Supports multiple specialized agents (general, clinical, food).
- Context-aware routing of queries.
- Domain-specific responses in JSON.

### Dynamic Chart Generation
- Detects numeric patterns in JSON.
- Automatically renders:
-  Bar charts
- Pie charts
-  Line charts
- Uses [Recharts](https://recharts.org/) for modern, responsive visualizations.
- Handles:
- Flat key-value JSON
- Array of objects
- Nested structures

### 💾 Save as Widget
- Name and tag your chart with an emoji.
- Save it to a persistent left-hand sidebar.
- Ideal for creating your own analytical dashboard.

### 🧭 Widget Sidebar
- View saved widgets instantly.
- Click to reopen a chart in a centered popup.
- 🗑️ Delete icon allows removal of saved charts.

### 🪟 Popup Chart Viewer
- Clean modal layout.
- Charts retain original type and interactivity.
- Easily dismiss popup to return to the chat.

## 🛠 Tech Stack

| Layer      | Technology       | Purpose                          |
|------------|------------------|----------------------------------|
| Frontend   | React.js         | UI, components, state management |
| Charts     | Recharts         | Interactive data visualizations  |
| Styling    | Custom CSS       | Layout and responsiveness        |
| Backend    | Flask (Python)   | Routes queries to AI agents      |
| Hosting    | Vercel/Netlify   | Optional for frontend deployment |


## Sample Queries

Try asking:
- `Show global undernourishment rates by region as JSON`
- `Return GDP of top 5 countries in JSON format`
- `List COVID-19 death rates by country in JSON`
- `Show participants in heart attack study by hospital`
- `Return number of clinical trials by continent in JSON`

Copilot will:
- Match the agent,
- Parse the response,
- Visualize the chart based on structure.


## 👩‍💻 Author

**Vinuta Patil**  
✨ Built with ❤️ for real-time data exploration and AI-powered chart interactions  
🔗 [GitHub Profile](https://github.com/vinuta-patil)


## 📜 License

This project is licensed under the **MIT License**.


