from fastapi import FastAPI, Query
from fastapi.middleware.cors import CORSMiddleware
from app.agents.clinical_agent import handle_clinical_query
from app.agents.food_agent import handle_food_query
from app.agents.web_agent import handle_web_query  # keep this one now

app = FastAPI(title="Multi-Agent Copilot")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.get("/")
def root():
    return {"message": "Welcome to the Web UI Copilot API!"}


@app.get("/ask")
def ask_agent(query: str = Query(...)):
    lowered = query.lower()

    if any(word in lowered for word in ["trial", "clinical", "patient", "hospital", "study", "cardio", "ctg"]):
        return handle_clinical_query(query)
    
    elif any(word in lowered for word in ["food", "nutrition", "hunger", "undernourished", "malnutrition", "sofi", "fao"]):
        return handle_food_query(query)
    
    else:
        # If it's not clinical or food — treat it as a general GPT query
        return handle_web_query(query)
