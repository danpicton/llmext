from flask import Flask, request, jsonify
from flask_cors import CORS
import requests
from PIL import Image
import io
import openai

from config import OPENAI_API_KEY

# Initialize Flask app
app = Flask(__name__)
CORS(app)

# Set your OpenAI API key
openai.api_key = OPENAI_API_KEY

def fetch_image(url):
    """Fetch an image from a URL."""
    try:
        response = requests.get(url, allow_redirects=True)
        response.raise_for_status()  # Raise an error for bad responses (4xx or 5xx)
        return Image.open(io.BytesIO(response.content))
    except requests.RequestException as e:
        print(f"Error fetching image: {e}")
        return None

def process_image_with_openai(image, prompt):
    """Process an image with OpenAI"""
    # Convert the image to bytes for sending
    buffered = io.BytesIO()
    image.save(buffered, format="PNG")  # Save the image as PNG (you can choose other formats as needed)
    image_bytes = buffered.getvalue()

    # Call the OpenAI API
    response = openai.Image.create(
        file=image_bytes,
        prompt=prompt,
        n=1,
        size="1024x1024"  # Adjust the size as needed
    )

    return response

@app.route('/image', methods=['POST'])
def handle_image_request():
    data = request.json
    image_url = data.get("imageUrl")
    prompt = data.get("prompt", '')

    print(f"Received POST request on /image endpoint. Image URL: {image_url}, Prompt: {prompt}")

    # Fetch the image from the URL
    image = fetch_image(image_url)
    if image is None:
        return jsonify({"error": "Failed to fetch image."}), 400

    # Process the image with OpenAI
    try:
        result = process_image_with_openai(image, prompt)
        return jsonify(result)
    
    except Exception as e:
        print(f"Error processing image with OpenAI: {e}")
        return jsonify({"error": "Failed to process image with OpenAI."}), 500

if __name__ == '__main__':
    app.run(port=8080)
