from flask import Flask, jsonify, request
from joblib import load
import pandas as pd
from itertools import combinations

app = Flask(__name__)

# Load the model
model = load('model.joblib')

@app.route('/predict', methods=['POST'])
def predict():
    # Get the data from the POST request
    data = request.get_json(force=True)

    # Get the supermarkets, weather, and transport from the data
    supermarkets = data['supermarkets']
    weather = data['weather']
    transport = data['transport']

    # Generate all possible pairs of supermarkets
    supermarket_pairs = list(combinations(supermarkets, 2))

    # Create a DataFrame with the cost and distance values for each pair, along with the weather and transport
    df = pd.DataFrame([
        {
            'Distance1': pair[0]['distance'],
            'Distance2': pair[1]['distance'],
            'Cost1': pair[0]['cost'],
            'Cost2': pair[1]['cost'],
            'Weather': weather,
            'Transport': transport,
            'Supermarket1': pair[0]['name'],
            'Supermarket2': pair[1]['name']
        }
        for pair in supermarket_pairs
    ])

    # Make a prediction for each pair and calculate the selection scores
    # Calculate selection scores
    scores = {}
    for idx, row in df.iterrows():
        pair = tuple(row[['Distance1', 'Distance2', 'Cost1', 'Cost2']])
        prediction = model.predict([pair])[0]
        confidence = model.predict_proba([pair])[0][prediction]
        selected_supermarket = row['Supermarket1'] if prediction == 0 else row['Supermarket2']
        not_selected_supermarket = row['Supermarket2'] if prediction == 0 else row['Supermarket1']

        if selected_supermarket not in scores:
            scores[selected_supermarket] = 0
        if not_selected_supermarket not in scores:
            scores[not_selected_supermarket] = 0

        scores[selected_supermarket] += confidence
        scores[not_selected_supermarket] += 1 - confidence


    # Sort the supermarkets by their scores
    top_supermarkets = sorted(scores.items(), key=lambda item: item[1], reverse=True)

    # Return the supermarkets and their scores
    return jsonify(top_supermarkets)

if __name__ == "__main__":
    app.run()
