from fastapi import FastAPI
from pydantic import BaseModel
from openai import OpenAI
from fastapi.middleware.cors import CORSMiddleware
from dotenv import load_dotenv
import json
import os

load_dotenv()

app = FastAPI()

origins = [
    "http://localhost:3000",
    "http://localhost:3001",
    "http://localhost:8080",
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

client = OpenAI(
    api_key=os.getenv("OPENAI_API_KEY"),
)

class ChatRequest(BaseModel):
    message: str

class ChatResponse(BaseModel):
    text: str
    reasoning: list

@app.post("/chat", response_model=ChatResponse)
async def chat_endpoint(req: ChatRequest):
    """
    Receives a user's message, queries the OpenAI API ,
    and returns a response along with a chain-of-thought.
    """
    user_input = req.message.strip()

    # prompt
    prompt = f"""
    You are a helpful AI assistant. 
    Your task is to:
    1. Provide a response that fully satisfies the user's query.
    2. Ensure the response is concise, elaborative, and does not omit any necessary details.

    Additionally, generate a chain-of-thought as an array of JSON objects. The chain-of-thought must:
    1. Use valid JSON format (starting with "```json" and ending with "```") to allow parsing into other interfaces.
    2. Describe the logical steps you followed to arrive at the response.
    3. Include a "title" and "details" field in each step:
    - "title" should briefly summarize the step.
    - "details" should be sufficiently descriptive while remaining brief.

    **General Rules:**
    1. Avoid including any extra labels, section headers, or separators in your response.
    2. Ensure the response text and the chain-of-thought are presented sequentially and are easily distinguishable.

    **User Query:** {user_input}

    """

    try:
        response = client.chat.completions.create(
            model="gpt-4",
            messages=[
                {"role": "system", "content": "You are a helpful assistant."},
                {"role": "user", "content": prompt}
            ],
            temperature=0.7
        )

        ai_text = response.choices[0].message.content.strip()
        
        try:
            json_start = ai_text.find("```json")
            if json_start != -1:
                cleaned_text = ai_text[:json_start].strip()
                
                json_end = ai_text.find("```", json_start + len("```json"))
                raw_reasoning = json.loads(ai_text[json_start + len("```json"):json_end].strip())
                
                reasoning = [
                    {"id": idx + 1, "title": item.get("title", ""), "details": item.get("details", "")}
                    for idx, item in enumerate(raw_reasoning)
                ]
            else:
                cleaned_text = ai_text  # No JSON block found, keep the entire text
                reasoning = [{"id": 1, "title": "Error", "details": "No reasoning JSON found in AI response."}]
        except Exception as e:
            cleaned_text = ai_text  # Retain the full text if parsing fails
            reasoning = [{"id": 1, "title": "Error", "details": f"Failed to parse reasoning JSON: {str(e)}"}]

        # Return a valid ChatResponse object
        return ChatResponse(text=cleaned_text, reasoning=reasoning)

    except Exception as e:
        # In case of error
        return ChatResponse(
            text=f"An error occurred: {str(e)}",
            reasoning=[]
        )
