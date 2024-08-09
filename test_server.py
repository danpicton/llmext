from flask import Flask, request, jsonify
from flask_cors import CORS

app = Flask(__name__)
# Enable CORS for all routes
CORS(app)

@app.route('/text', methods=['POST'])
def handle_text_request():
    data = request.json
    print(f"Received POST request on /text endpoint. Data: {data}")
    
    # Dummy response for text
    response = {
        'text': (f'• Dummy summary of "{data.get("question", "")}"\n\t• Detail 1\n\t• Detail 2')
    }
    return jsonify(response)

@app.route('/image', methods=['POST'])
def handle_image_request():
    data = request.json
    print(f"Received POST request on /image endpoint. Data: {data}")

    # Dummy response for image
    response = {
        'text': (f'• Dummy summary of image URL "{data.get("imageUrl", "")}"\n\t• Interpretation 1\n\t• Interpretation 2')
    }
    return jsonify(response)

if __name__ == '__main__':
    app.run(port=8080)
