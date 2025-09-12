import os
from flask import Flask, jsonify, request
from dotenv import load_dotenv
from azure.ai.inference import ChatCompletionsClient
from azure.ai.inference.models import SystemMessage, UserMessage
from azure.core.credentials import AzureKeyCredential

load_dotenv()

app = Flask(__name__)

endpoint = "https://models.github.ai/inference"
model = "openai/gpt-4"
token = os.environ.get("GITHUB_TOKEN")

client = None
if token:
    try:
        client = ChatCompletionsClient(
            endpoint=endpoint,
            credential=AzureKeyCredential(token),
        )
    except Exception as e:
        print(f"Failed to initialize ChatCompletionsClient: {e}")

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

@app.route("/qa", methods=["POST"])
def qa():
    if not client:
        return jsonify({"error": "RAG service is not configured with an API token."}), 500

    data = request.get_json()
    question = data.get("question")

    if not question:
        return jsonify({"error": "question is required"}), 400

    terms = question.lower().split()
    matched_docs = [doc for doc in documents if any(term in doc["text"].lower() for term in terms)][:3]

    if not matched_docs:
        return jsonify({"answer": "I couldn't find any relevant documents to answer that question.", "sources": []})

    context = "\n\n".join([f"Source ({doc['id']}):\n{doc['text']}" for doc in matched_docs])
    prompt = f"""
    Based on the following context, please answer the user's question.
    If the context does not contain the answer, say that you don't know.

    Context:
    ---
    {context}
    ---
    Question: {question}
    """

    try:
        response = client.complete(
            messages=[
                SystemMessage("You are a helpful assistant for a job portal. Your goal is to answer questions based on the provided context about job descriptions and related topics."),
                UserMessage(prompt),
            ],
            model=model,
            temperature=0.7,
            top_p=1.0,
        )
        answer = response.choices[0].message.content
        sources = [doc["id"] for doc in matched_docs]
        return jsonify({"answer": answer, "sources": sources})
    except Exception as e:
        print(f"Error calling the model: {e}")
        return jsonify({"error": "Failed to get a response from the AI model."}), 500


if __name__ == "__main__":
    port = int(os.environ.get("PORT", 4004))
    app.run(host="0.0.0.0", port=port)