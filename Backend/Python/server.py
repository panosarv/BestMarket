from flask import Flask, jsonify, request

from joblib import load
import pandas as pd

app = Flask(__name__)

# Load the model
model = load('model.pkl')

@app.route('/predict', methods=['POST'])
def predict():
    # Get the data from the POST request
    print('request-->',request.data)
    data = request.get_json(force=True)
    print('data-->',data)

    # Get the supermarkets, weather, and transport from the data
    

    # Generate all possible pairs of supermarkets

    # Create a DataFrame with the cost and distance values for each pair, along with the weather and transport
    df = pd.DataFrame(data)
    df.rename(columns={'name': 'supermarketId', 'distance': 'Distance', 'weatherCondition': 'WeatherCondition', 'meansOfTransport': 'MeansOfTransport', 'cost': 'Cost','timeOfDay':'TimeOfDay'}, inplace=True)
    print('df-->',df)
    X = df[[ 'Distance', 'Cost', 'MeansOfTransport','WeatherCondition','TimeOfDay']].astype('float32')
    print('X-->',X)
    y_pred = model.predict(X)
    print('y_pred-->',y_pred)
    print('xXXXX->',df['supermarketId'].tolist())
    # Make a prediction for each pair and calculate the selection scores
    # Calculate selection scores
    supermarketIdList=df['supermarketId'].tolist()
    scoresList=y_pred.tolist()
    responseData=[]
    for i in range(len(scoresList)):
        responseData.append({'supermarketId': supermarketIdList[i], 'score': scoresList[i]})
    
    return jsonify(responseData)
    

    # Return the supermarkets and their scores

if __name__ == "__main__":
    app.run()
