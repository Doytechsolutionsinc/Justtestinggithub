from flask import Flask, request, jsonify
from flask_cors import CORS
import requests

app = Flask(__name__)
CORS(app)  # allow cross-origin requests from frontend

API_KEY = "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"

OFFLINE_RESPONSES = {
    "who is desmond": "Desmond Yeboah is the creator of MetroTex and founder of Doy Tech Solutions Inc.",
    "who created you": "I am an AI assistant model created by Desmond Yeboah of Doy Tech Solutions Inc.",
    "what's your name": "My name is MetroTex, your smart assistant.",
    "who made metrotex": "MetroTex was developed by Desmond Yeboah at Doy Tech Solutions Inc.",
}

@app.route('/chat', methods=['POST'])
def chat():
    data = request.json
    user_input = data.get("message", "").lower()

    for key in OFFLINE_RESPONSES:
        if key in user_input:
            return jsonify({"reply": OFFLINE_RESPONSES[key]})

    try:
        headers = {
            "Authorization": f"Bearer {API_KEY}",
            "Content-Type": "application/json"
        }
        payload = {
            "model": "openai/gpt-3.5-turbo",
            "messages": [{"role": "user", "content": user_input}]
        }
        response = requests.post("https://openrouter.ai/api/v1/chat/completions", headers=headers, json=payload)
        data = response.json()
        reply = data["choices"][0]["message"]["content"]
    except Exception as e:
        reply = "I couldn't reach the internet. Here's an offline answer: MetroTex is your assistant by Doy Tech Solutions Inc."
    return jsonify({"reply": reply})

if __name__ == '__main__':
    app.run(host='0.0.0.0', port=5000)