# Nitrogen Level Prediction Using LCC

This project introduces a deep learning system designed to automate the assessment of nitrogen levels in rice crops. By leveraging a Convolutional Neural Network (CNN), this tool provides farmers with a fast, accurate, and low-cost method to optimize fertilizer use, supporting greater crop yields and sustainable farming practices.

Traditional nitrogen management relies on manually comparing a rice leaf's color to a Leaf Color Chart (LCC), a process that can be subjective and inefficient. This system replaces manual guesswork with data-driven analysis. Users can simply upload an RGB image of a rice leaf, and the model will predict its nitrogen level based on the LCC scale (Levels 2-5).

After benchmarking several deep learning architectures, the **VGGNet16 model** was selected for its superior performance, achieving an **accuracy of 86%** on the test dataset.

### Key Features
*   **Automated Nitrogen Prediction:** Instantly classify the nitrogen level of rice leaves from an image.
*   **High-Accuracy Deep Learning Model:** Built using a fine-tuned VGGNet16 architecture for reliable results.
*   **User-Friendly Web Interface:** A clean and simple interface for uploading images and viewing predictions.
*   **Supports Precision Agriculture:** Empowers farmers to make informed decisions, reducing fertilizer waste and environmental impact.

### Technology Stack

This project combines a powerful machine learning backend with a modern, responsive frontend.

*   **Backend:** **Python**, **Flask**
*   **Machine Learning:** **TensorFlow**, **Keras**
*   **Data Science Libraries:** **Scikit-learn**, **Pandas**, **NumPy**
*   **Frontend:** **React**, **JavaScript**
*   **Styling:** **Tailwind CSS**
*   **Development & Training Environment:** **Google Colab**, **Visual Studio Code**

![Nitrogen Predictor Demo](Demo/demo.gif)
