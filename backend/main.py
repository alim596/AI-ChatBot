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

conversation_context = []

@app.post("/chat", response_model=ChatResponse)
async def chat_endpoint(req: ChatRequest):
    """
    Handles user messages, sends them to OpenAI, and returns the response and reasoning.
    """
    global conversation_context

    # User input
    user_input = req.message.strip()

    # System prompt (static and NOT stored in the context)
    system_prompt = {
        "role": "system",
        "content": (
            "You are a helpful AI assistant. Follow these rules in full detail:\n"
            "1. Avoid including any extra labels, section headers, or separators in your response.\n"
            "2. Revise and understand the user's request fully.\n"
            "3. Provide a response that fully satisfies the user's query.\n"
            "4. Ensure the response is concise, elaborative, and does not omit any necessary details.\n\n"
            "Additionally, generate a chain-of-thought as an array of JSON objects with:\n"
            "1. A valid JSON format (starting with '```json' and ending with '```').\n"
            "2. Logical steps described, including 'title' and 'details' fields for each step."
        ),
    }

    # Add the user's message to the conversation context
    conversation_context.append({"role": "user", "content": user_input})

    # Combine system prompt and conversation context for the OpenAI API call
    messages = [system_prompt] + conversation_context

    try:
        # Call the OpenAI API
        response = client.chat.completions.create(
            model="gpt-4",
            messages=messages,
            temperature=0.7,
        )

        ai_text = response.choices[0].message.content.strip()

        # Add the assistant's response to the conversation context
        conversation_context.append({"role": "assistant", "content": ai_text})

        # Extract reasoning (chain-of-thought) from the response
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
                cleaned_text = ai_text
                reasoning = [{"id": 1, "title": "Error", "details": "No reasoning JSON found in AI response."}]
        except Exception as e:
            cleaned_text = ai_text
            reasoning = [{"id": 1, "title": "Error", "details": f"Failed to parse reasoning JSON: {str(e)}"}]

        # Return the response and reasoning
        return ChatResponse(text=cleaned_text, reasoning=reasoning)

    except Exception as e:
        # Handle errors gracefully
        return ChatResponse(
            text=f"An error occurred: {str(e)}",
            reasoning=[]
        )

@app.post("/reset")
async def reset_context():
    """Endpoint to reset the conversation context."""
    global conversation_context
    conversation_context = []
    return {"message": "Context reset successfully"}