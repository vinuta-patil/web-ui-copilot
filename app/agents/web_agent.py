from langchain.chat_models import ChatOpenAI

llm = ChatOpenAI(model_name="gpt-3.5-turbo")

def handle_web_query(query: str):
    response = llm.invoke(query)
    return {
        "agent": "general",
        "query": query,
        "response": response.content
    }
