import os
from flask import Flask, jsonify, request
from dotenv import load_dotenv
import google.generativeai as genai

load_dotenv()

app = Flask(__name__)

api_key = os.environ.get("GOOGLE_API_KEY")
client = None
model_name = "gemini-1.5-flash"

if api_key:
    try:
        genai.configure(api_key=api_key)
        client = genai.GenerativeModel(model_name)
    except Exception as e:
        print(f"Failed to initialize Google Generative AI Client: {e}")
else:
    print("GOOGLE_API_KEY not found. RAG service QA endpoint will be disabled.")

documents = []
data_path = os.environ.get("RAG_DATA_PATH", "./data")
if os.path.exists(data_path):
    for filename in os.listdir(data_path):
        with open(os.path.join(data_path, filename), "r", encoding="utf-8") as f:
            documents.append({"id": filename, "text": f.read()})

@app.route("/health")
def health():
    return jsonify({"ok": True, "service": "rag"})

@app.route("/retrieve", methods=["POST"])
def retrieve():
    data = request.get_json()
    query = data.get("query")
    k = data.get("k", 3)

    if not query:
        return jsonify({"error": "query is required"}), 400

    terms = query.lower().split()
    scored = []
    for doc in documents:
        score = sum(1 for term in terms if term in doc["text"].lower())
        if score > 0:
            scored.append({**doc, "score": score})

    scored.sort(key=lambda x: x["score"], reverse=True)
    return jsonify({"results": scored[:k]})

@app.route("/company-qa", methods=["POST"])
@app.route("/qa", methods=["POST"])
def qa():
    if not client:
        return jsonify({"error": "RAG service is not configured with a GOOGLE_API_KEY."}), 500

    data = request.get_json()
    question = data.get("question")

    if not question:
        return jsonify({"error": "question is required"}), 400

    terms = question.lower().split()
    matched_docs = [doc for doc in documents if any(term in doc["text"].lower() for term in terms)][:3]

    if not matched_docs:
        return jsonify({"answer": "I couldn't find any relevant documents to answer that question.", "sources": []})

    context = "\n\n".join([f"Source ({doc['id']}):\n{doc['text']}" for doc in matched_docs])
    
    system_prompt = "You are a helpful assistant for a job portal. Your goal is to answer questions based on the provided context about job descriptions and related topics."
    prompt = f"""
    {system_prompt}

    Based on the following context, please answer the user's question.
    If the context does not contain the answer, say that you don't know.

    Context:
    ---
    {context}
    ---
    Question: {question}
    """

    try:
        generation_config = genai.types.GenerationConfig(
            temperature=0.7,
            top_p=1.0
        )
        response = client.generate_content(
            prompt,
            generation_config=generation_config
        )
        answer = response.text

        sources = [doc["id"] for doc in matched_docs]
        return jsonify({"answer": answer, "sources": sources})
    except Exception as e:
        print(f"Error calling the model: {e}")
        return jsonify({"error": "Failed to get a response from the AI model."}), 500


if __name__ == "__main__":
    port = int(os.environ.get("PORT", 4004))
    app.run(host="0.0.0.0", port=port)