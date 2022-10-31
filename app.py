from distutils.log import debug
import numpy as np
import pandas as pd
from flask import Flask, request, jsonify, render_template
import pickle, os
from gensim.parsing.preprocessing import remove_stopwords
from nltk.stem import PorterStemmer  

app = Flask(__name__)

conditions = pickle.load(open('pickled_files/conditions', 'rb'))
tf_idf_conditions = pickle.load(open('pickled_files/tf_idf_conditions', 'rb'))
final_ordered_features_conditions = pickle.load(open('pickled_files/final_ordered_features_conditions', 'rb'))

allergies = pickle.load(open('pickled_files/allergies', 'rb'))
tf_idf_allergies = pickle.load(open('pickled_files/tf_idf_allergies', 'rb'))
final_ordered_features_allergies = pickle.load(open('pickled_files/final_ordered_features_allergies', 'rb'))

def ngrams(word_list):
    all_grams = []
    for index in range(len(word_list)):
        all_grams.append(word_list[index])
        if index + 1 < len(word_list):
            all_grams.append(word_list[index] + " " + word_list[index + 1])
        if index + 2 < len(word_list):
            all_grams.append(word_list[index] + " " + word_list[index + 1] + " " + word_list[2])
    
    return all_grams
    
def text_cleaning(text):
    ps = PorterStemmer()
    text = remove_stopwords(text)
    stemmed = ""
    for word in text.split():
        stemmed += ps.stem(word)
        stemmed += " "
    return stemmed

@app.route('/')
def home():
    return render_template('index.html')

@app.route('/predict_conditions',methods=['POST'])
def predict_conditions():
    features_from_server = [0] * 15
    description = "fracture forearm"
    description = text_cleaning(description)
    
    transformed_features = tf_idf_conditions.transform([description]).toarray()[0]
    for tf_idf_value in transformed_features:
        features_from_server.append(tf_idf_value)
    
    df_input = pd.DataFrame([np.array(features_from_server)], columns = final_ordered_features_conditions)
    predicted_encounter_class = conditions.predict(df_input)[0]
    
    return render_template('index.html', prediction_text='Encountered class is {}'.format(predicted_encounter_class))

@app.route('/predict_allergies',methods=['POST'])
def predict_allergies():
    features_from_server = [0] * 15
    description = "fracture forearm"
    description = text_cleaning(description)
    
    transformed_features = tf_idf_allergies.transform([description]).toarray()[0]
    for tf_idf_value in transformed_features:
        features_from_server.append(tf_idf_value)
    
    df_input = pd.DataFrame([np.array(features_from_server)], columns = final_ordered_features_allergies)
    predicted_encounter_class = allergies.predict(df_input)[0]
    
    return render_template('index.html', prediction_text='Encountered class is {}'.format(predicted_encounter_class))

if __name__ == "__main__":
    app.run(port = int(os.getenv('PORT', 4444)), debug = True)