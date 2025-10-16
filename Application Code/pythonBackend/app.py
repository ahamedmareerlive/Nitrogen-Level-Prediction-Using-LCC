import numpy as np
import tensorflow as tf
from tensorflow.keras.models import model_from_json
from tensorflow.keras.preprocessing.image import load_img, img_to_array
from flask import Flask, request, jsonify
import io

# Initialize Flask app
app = Flask(__name__)

# Define a mapping between model output indices and LCC levels
LCC_LEVELS = {0: "Level 2", 1: "Level 3", 2: "Level 4", 3: "Level 5"}

# Load model configuration and weights
with open('config.json', 'r') as f:
    model_config = f.read()

model = model_from_json(model_config)
model.load_weights('model.weights.h5')

@app.route('/', methods=['GET'])
def home():
    return '''
    <!DOCTYPE html>
    <html lang="en">
    <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Nitrogen Level Predictor</title>
    </head>
    <body>
        <h1>Upload an Image to Predict Nitrogen Level</h1>
        <form action="/predict" method="POST" enctype="multipart/form-data">
            <input type="file" name="file" accept="image/*" required>
            <button type="submit">Predict</button>
        </form>
    </body>
    </html>
    '''

@app.route('/predict', methods=['POST'])
def predict():
    try:
        # Ensure a file is uploaded
        if 'file' not in request.files:
            return jsonify({"error": "No file uploaded"}), 400

        file = request.files['file']

        # Load and preprocess the image
        img = load_img(io.BytesIO(file.read()), target_size=(224, 224))
        img_array = img_to_array(img)
        img_array = np.expand_dims(img_array, axis=0)  # Expand dims to match model input
        img_array /= 255.0  # Normalize the image

        # Perform prediction
        prediction = model.predict(img_array)
        predicted_class_index = np.argmax(prediction).item()  # Convert to native Python int

        # Map to nitrogen level
        predicted_nitrogen_level = LCC_LEVELS.get(predicted_class_index, "Unknown Level")

        # Return result as JSON
        return jsonify({
            "predicted_nitrogen_level": predicted_nitrogen_level
        })

    except Exception as e:
        return jsonify({"error": str(e)}), 500

# Run the Flask app
if __name__ == '__main__':
    app.run(host='0.0.0.0', port=5005, debug=True)
