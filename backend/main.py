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

    # System prompt with explicit and clear instructions
    system_prompt = {
        "role": "system",
        "content": (
            "You are a helpful AI assistant. Always follow these rules:\n"
            "1. Respond clearly and concisely to the user's query.\n"
            "2. After the response, provide a Chain-of-Thought (COT) reasoning in JSON format.\n"
            "3. The JSON array must start with '```json' and end with '```'.\n"
            "4. Each reasoning step must include a 'title' and 'details' field.\n\n"
            "Example COT format:\n"
            "```json\n"
            "[\n"
            "  {\"title\": \"Reasoning\", \"details\": \"Reasoning details for step 1\"},\n"
            "  {\"title\": \"Analyzing2\", \"details\": \"Reasoning details for step 2\"}\n"
            "]\n"
            "```\n"
            "Always ensure the response fully satisfies the user's query and includes the COT."
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
            temperature=0.5,
        )

        # Extract AI response text
        ai_text = response.choices[0].message.content.strip()

        # Add the assistant's response to the conversation context
        conversation_context.append({"role": "assistant", "content": ai_text})

        # Parse the reasoning (COT) from the response
        json_start = ai_text.find("```json")
        json_end = ai_text.find("```", json_start + len("```json"))
        if json_start != -1 and json_end != -1:
            # Separate the main response (cleaned_text) from the JSON reasoning block
            cleaned_text = ai_text[:json_start].strip()
            raw_reasoning = ai_text[json_start + len("```json"):json_end].strip()
            try:
                reasoning = json.loads(raw_reasoning)
                reasoning = [
                    {"id": idx + 1, "title": item.get("title", ""), "details": item.get("details", "")}
                    for idx, item in enumerate(reasoning)
                ]
            except json.JSONDecodeError:
                reasoning = [{"id": 1, "title": "Error", "details": "Invalid JSON format in AI response."}]
        else:
            # If no JSON reasoning block is found, treat the entire response as the main content
            cleaned_text = ai_text
            reasoning = [{"id": 1, "title": "Error", "details": "No reasoning JSON found in AI response."}]

        # Return the AI response and reasoning
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