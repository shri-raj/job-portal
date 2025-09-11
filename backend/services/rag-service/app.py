import os
from flask import Flask, jsonify, request

app = Flask(__name__)

# Load small dataset into memory from the data directory
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
        return jsonify({"error": "query required"}), 400

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
    data = request.get_json()
    question = data.get("question")

    if not question:
        return jsonify({"error": "question required"}), 400

    terms = question.lower().split()
    matched = [doc for doc in documents if any(term in doc["text"].lower() for term in terms)][:3]

    if not matched:
        return jsonify({"answer": "No relevant documents found.", "sources": []})

    answer = "\n\n".join([f"From {m['id']}: {m['text'][:200]}" for m in matched])
    return jsonify({"answer": answer, "sources": [m["id"] for m in matched]})

if __name__ == "__main__":
    port = int(os.environ.get("PORT", 4004))
    app.run(host="0.0.0.0", port=port)