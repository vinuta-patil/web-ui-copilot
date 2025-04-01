import os
from app.utils.rag_utils import create_vectorstore_from_pdf, get_clinical_qa_chain

PDF_PATH = "data/ctg-studies.pdf"

# Build the vector DB only once
if not os.path.exists("clinical_db"):
    create_vectorstore_from_pdf(PDF_PATH)

qa_chain = get_clinical_qa_chain()

def handle_clinical_query(query: str):
    result = qa_chain.run(query)
    return {
        "agent": "clinical",
        "query": query,
        "response": result
    }
