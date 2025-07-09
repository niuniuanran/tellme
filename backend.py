from pydantic import BaseModel
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from openai import OpenAI
from dotenv import load_dotenv

load_dotenv()

app = FastAPI()

origins = ["*"]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_methods=["*"],
    allow_headers=["*"],
)

class Question(BaseModel):
    context: str
    question: str

@app.post("/answer")
def tell_me_about(question: Question):
    return {
        "answer": answer(question)
    }

def answer(question: Question):
    client = OpenAI()
    response = client.responses.create(
        model="gpt-4.1",
        input=f"""
You are a helpful assistant that can answer questions based on CONTEXT given.
Your task is to provide a concise and accurate answer for the QUESTION asked,
and answer that based on the provided CONTEXT. If there is no relevant information in the CONTEXT,
you should say "This information is not provided in the context". Try to give your
answer as succinct as possible.

CONTEXT:
{question.context}

QUESTION:
{question.question}

ANSWER:
""")
    return response.output_text
