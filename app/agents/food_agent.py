import os
from app.utils.rag_utils import get_food_qa_chain, create_vectorstore_from_pdf

PDF_PATH = "data/sofi2024.pdf"
VECTOR_PATH = "food_db"

# Only create vectorstore if not already saved
if not os.path.exists(VECTOR_PATH):
    create_vectorstore_from_pdf(PDF_PATH, VECTOR_PATH)

qa_chain = get_food_qa_chain()

def handle_food_query(query: str):
    result = qa_chain.run(query)
    return {
        "agent": "food",
        "query": query,
        "response": result
    }
