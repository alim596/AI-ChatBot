# Chat Application with AI-Powered Responses

This project is a React-based chat application that integrates with OpenAI's API to provide intelligent responses. The app features a user-friendly interface with a "typing" animation, a thought graph for chain-of-thought explanations, and a resizable layout.

---

## Features

- **Real-time chat** with AI-generated responses.
- **Interactive "thought graph"** to visualize the reasoning behind AI responses.
- **Typing animation** to indicate when the AI is generating a response.
- **Resizable interface** for chat and graph panels.

---

## Installation and Setup

Follow these steps to set up and run the project locally.

### Prerequisites

Make sure you have the following installed:
- **Node.js** (v16 or higher recommended)
- **npm** or **yarn**
- **Python** (v3.8 or higher, for the backend)
- **pip** (Python package manager)
- An **OpenAI API key** (get one from [OpenAI](https://platform.openai.com/signup/))

---

### Steps to Run Locally

1. **Clone the repository**:
   ```bash
   git clone https://github.com/your-repo/chat-app.git
   cd chat-app
   ```

2. **Install dependencies**:
   ```bash
   npm install
   ```

3. **Set up your API key**:
   - Create a `.env` file in the root directory of the project.
   - Add the following line to the `.env` file, replacing `your-api-key-here` with your actual OpenAI API key:
     ```plaintext
     OPENAI_API_KEY=your-api-key-here
     ```

4. **Run the development server**:
   ```bash
   npm start
   ```

5. **Access the application**:
   - Open your browser and go to:
     ```
     http://localhost:3000
     ```
---

#### **Backend Setup**

1. **Navigate to the backend directory**:  
   If your project includes a `backend/` directory, navigate to it:
   ```bash
   cd backend
   ```

2. **Create and activate a virtual environment**:  
   Set up a virtual environment for Python dependencies:
   ```bash
   python -m venv env
   source env/bin/activate    # On macOS/Linux
   env\Scripts\activate       # On Windows
   ```

3. **Install Python dependencies**:  
   Install the required Python packages for FastAPI:
   ```bash
   pip install fastapi uvicorn python-dotenv
   ```

4. **Start the backend server**:  
   Run the FastAPI server:
   ```bash
   uvicorn main:app --reload
   ```
   The backend will be running at:
   ```
   http://127.0.0.1:8000
   ```

5. **Test the backend**:  
   Access the API documentation in your browser at:
   ```
   http://127.0.0.1:8000/docs
   ```

---

## API Key Information

This project uses the OpenAI API for generating AI responses. To protect the API key:
- The key is securely loaded using environment variables via a `.env` file.
- The `.env` file is excluded from version control using `.gitignore`.

---

## Project Structure

```
src/
├── components/
│   ├── ChatBox.jsx         # Chat interface
│   ├── ThoughtGraph.jsx    # Visualization of AI reasoning
├── App.jsx                 # Main application logic
├── index.js                # Entry point
backend/
├── main.py                 # FastAPI backend logic
├──.env                     # Example environment file
```

---

## Notes for Reviewers
- **API Key**: The OpenAI API key is not included in the repository. Please follow the setup instructions to add your own key.

