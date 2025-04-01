from langchain_community.document_loaders import PyPDFLoader
from langchain.text_splitter import RecursiveCharacterTextSplitter
from langchain.embeddings import OpenAIEmbeddings
from langchain.vectorstores import Chroma
from langchain.chains import RetrievalQA
from langchain.chat_models import ChatOpenAI

import os
from dotenv import load_dotenv

load_dotenv()

CLINICAL_PATH = "clinical_db"
FOOD_PATH = "food_db"


def create_vectorstore_from_pdf(pdf_path, persist_path):
    loader = PyPDFLoader(pdf_path)
    documents = loader.load()

    splitter = RecursiveCharacterTextSplitter(chunk_size=1000, chunk_overlap=200)
    texts = splitter.split_documents(documents)

    embeddings = OpenAIEmbeddings()
    db = Chroma.from_documents(texts, embedding=embeddings, persist_directory=persist_path)
    db.persist()
    return db


def get_clinical_qa_chain():
    embeddings = OpenAIEmbeddings()
    db = Chroma(persist_directory=CLINICAL_PATH, embedding_function=embeddings)
    retriever = db.as_retriever()

    qa_chain = RetrievalQA.from_chain_type(
        llm=ChatOpenAI(model_name="gpt-3.5-turbo"),
        retriever=retriever,
        return_source_documents=False
    )
    return qa_chain


def get_food_qa_chain():
    embeddings = OpenAIEmbeddings()
    db = Chroma(persist_directory=FOOD_PATH, embedding_function=embeddings)
    retriever = db.as_retriever()

    qa_chain = RetrievalQA.from_chain_type(
        llm=ChatOpenAI(model_name="gpt-3.5-turbo"),
        retriever=retriever,
        return_source_documents=False
    )
    return qa_chain
