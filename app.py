import openai
from flask import Flask, jsonify, request
from flask_cors import CORS
from config import OPENAI_API_KEY

# Initialize Flask app
app = Flask(__name__)
CORS(app)

# Set your OpenAI API key
openai.api_key = OPENAI_API_KEY


@app.route("/text", methods=["POST"])
def handle_text_request():
    data = request.json
    question = data.get("question", "")

    print(f"Received POST request on /text endpoint. Question: {question}")

    # Process the text with OpenAI's GPT-4o-mini model
    try:
        response = openai.chat.completions.create(
            model="gpt-4o-mini",  # Specify the model
            messages=[{"role": "user", "content": question.strip()}],
            max_tokens=16_384,  # Adjust as needed
        )

        # Extract relevant data from the response
        answer = response.choices[0].message.content

        # Return the response data
        return jsonify({"text": answer})

    except Exception as e:
        print(f"Error processing text with OpenAI: {e}")
        return jsonify({"error": "Failed to process text with OpenAI."}), 500


if __name__ == "__main__":
    app.run(port=8080)
