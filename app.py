from distutils.log import debug
import numpy as np
import pandas as pd
from flask import Flask, request, jsonify, render_template
import pickle, os
from gensim.parsing.preprocessing import remove_stopwords
from nltk.stem import PorterStemmer  

app = Flask(__name__)
conditions = pickle.load(open('conditions.pkl', 'rb'))
allergies = pickle.load(open('allergies.pkl', 'rb'))

@app.route('/')
def home():
    return render_template('index.html')

@app.route('/predict_conditions',methods=['POST'])
def predict_conditions():
    result = request.form.to_dict(flat=False)
    print(result)
    int_features = []
    for i in result:
        if i != 'conditions':
            int_features.append(int(result[i][0]))
    print(int_features)
    conditions_description = result['conditions'][0]
    print(conditions_description)
    
    patient_features = ['BIRTHDATE', 'GENDER', 'ZIP', 'HEALTHCARE_EXPENSES', 
                        'INCOME', 'nonhispanic', 'hispanic']
    
    conditions_description_split = remove_stopwords(conditions_description)
    stemmed = ""
    ps = PorterStemmer()
    for s in conditions_description_split.split():
        stemmed += ps.stem(s)
        stemmed += " "
    conditions_description = stemmed
    print(conditions_description)
    conditions_description_split = conditions_description.split()
    print(conditions_description_split)
    
    descriptions_columns = ['19', '30', '40', 'abus', 'access', 'acquir', 'activ', 'acut', 'aeruginosa', 
                            'alcohol', 'allerg', 'allergi', 'alzheimer', 'amput', 'anemia', 'ankl', 'antepartum', 
                            'anterior', 'antibodi', 'anu', 'anxieti', 'apnea', 'append', 'appendectomi', 'appendix', 
                            'arm', 'arrest', 'arthriti', 'associ', 'asthma', 'atop', 'atrial', 'atroph', 'attent', 'aura', 
                            'bacteremia', 'bacteri', 'behavior', 'bifida', 'bleed', 'blight', 'bodi', 'brain', 'breast', 'bronchiti', 
                            'bullet', 'burn', 'cancer', 'carcinoma', 'cardiac', 'caus', 'cell', 'cerebr', 'certif', 'chiari', 'child', 
                            'childhood', 'chill', 'cholecyst', 'cholelithiasi', 'chronic', 'clavicl', 'close', 'coagul', 'coli', 'collater', 
                            'colon', 'column', 'complic', 'concuss', 'congenit', 'congest', 'conjunctiv', 'conscious', 'constip', 'contact', 
                            'cord', 'coronari', 'cough', 'covid', 'crimin', 'cruciat', 'cuff', 'cystic', 'cystiti', 'daili', 'damag', 'deep', 
                            'defici', 'deficit', 'deform', 'degre', 'depress', 'dermat', 'diabet', 'diarrhea', 'die', 'disabl', 'diseas', 'disloc', 
                            'disord', 'disorder', 'distress', 'dribbl', 'drink', 'drug', 'dyspnea', 'dystonia', 'earli', 'eclampsia', 'edema', 'educ', 
                            'embol', 'emphysema', 'employ', 'environ', 'epilepsi', 'episod', 'equival', 'escherichia', 'excess', 'facial', 'failur', 
                            'famili', 'fatigu', 'febril', 'femal', 'fetu', 'fever', 'fibril', 'fibromyalgia', 'fibrosi', 'find', 'finding', 'first', 
                            'foot', 'forc', 'forearm', 'fractur', 'full', 'gastroesophag', 'gondii', 'gout', 'ha', 'hand', 'headach', 'heart', 'high', 
                            'higher', 'hip', 'histori', 'homeless', 'hospic', 'hous', 'human', 'hydrocephalu', 'hyperglycemia', 'hyperlipidemia', 'hypertens', 
                            'hypertriglyceridemia', 'hypothyroid', 'hypoxemia', 'idiopath', 'ii', 'immun', 'immunodefici', 'impact', 'index', 'infarct', 'infect', 
                            'infecti', 'infertil', 'injuri', 'intellectu', 'intim', 'intract', 'involv', 'isol', 'joint', 'kidney', 'knee', 'labor', 'lacer', 
                            'lack', 'latex', 'lesion', 'leukemia', 'ligament', 'limb', 'limit', 'local', 'loss', 'low', 'lower', 'lung', 'macular', 
                            'major', 'male', 'malform', 'malign', 'mass', 'media', 'medial', 'mellitu', 'meningomyelocel', 'meniscu', 'metabol', 'metastasi', 
                            'microalbuminuria', 'migrain', 'migrant', 'miscarriag', 'misus', 'molar', 'mouth', 'muscl', 'myeloid', 'myocardi', 'nasal', 'nausea', 
                            'neck', 'neoplasm', 'neuropathi', 'neutropenia', 'non', 'nonprolif', 'normal', 'not', 'obes', 'obstruct', 'occulta', 'onli', 'onset', 
                            'opioid', 'osteoarthr', 'osteoporosi', 'otiti', 'overdos', 'overlap', 'ovum', 'pain', 'palsi', 'panic', 'paralysi', 'part', 'partner', 
                            'passiv', 'patellar', 'patholog', 'perenni', 'person', 'pharyng', 'pneumonia', 'polyp', 'poor', 'posit', 'prediabet', 'preeclampsia', 
                            'pregnanc', 'pressur', 'primari', 'problem', 'prolif', 'prostat', 'proteinuria', 'protract', 'pseudomona', 'pulmonari', 'pyelonephr', 
                            'reaction', 'receiv', 'record', 'rectal', 'recurr', 'reflux', 'refuge', 'renal', 'report', 'respiratori', 'retinopathi', 'rheumatoid', 
                            'rhiniti', 'rib', 'risk', 'rotat', 'ruptur', 'saliv', 'saliva', 'school', 'season', 'second', 'secondari', 'seizur', 'sepsi', 'septic',
                            'serv', 'sever', 'shock', 'shoulder', 'singl', 'sinus', 'situ', 'situation', 'sleep', 'smal', 'small', 'smoke', 'social', 'sore', 'spastic', 
                            'spina', 'spinal', 'sprain', 'sputum', 'stage', 'streptococc', 'stress', 'stroke', 'sublux', 'suspect', 'swallow', 'symptom', 'syndrom', 
                            'tast', 'tear', 'tendon', 'thigh', 'third', 'throat', 'thrombosi', 'tim', 'tnm', 'tobacco', 'tone', 'toxoplasma', 'tract', 'transform', 
                            'transport', 'traumat', 'trimest', 'tubal', 'tumor', 'type', 'ulcer', 'unabl', 'unemploy', 'unhealthi', 'unknown', 'unsatisfactori', 'urinari', 
                            'variat', 'venou', 'vertebr', 'victim', 'violenc', 'viral', 'viru', 'vomit', 'wheez', 'whiplash', 'wound', 'wrist']
    
    
    for i in descriptions_columns:
        int_features.append(conditions_description_split.count(i))
    
    print("int_features size" + len(int_features))
    
    tot_features = patient_features + descriptions_columns
    print("tot_feat")
    print(tot_features)
    final_features = [np.array(int_features)]
    df_features = pd.DataFrame(final_features, columns = tot_features)
    
    prediction = conditions.predict(df_features)
    print(prediction)
    output = prediction[0]

    return render_template('index.html', prediction_text='ENCOUNTER CLASS IS {}'.format(output))

@app.route('/predict_allergies',methods=['POST'])
def predict_allergies():
    result = request.form.to_dict(flat=False)
    print(result)
    hispanic = int(result['hispanic'][0])
    int_features = []
    for i in result:
        if i != 'allergies' and i != 'hispanic' and i != 'nonhispanic':
            int_features.append(int(result[i][0]))
    print(int_features)
    allergies_description = result['allergies'][0]
    print(allergies_description)
    
    patient_features = ['BIRTHDATE', 'GENDER', 'HEALTHCARE_EXPENSES', 
                        'INCOME', 'ZIP']
    
    allergies_description_split = remove_stopwords(allergies_description)
    stemmed = ""
    ps = PorterStemmer()
    for s in allergies_description_split.split():
        stemmed += ps.stem(s)
        stemmed += " "
    allergies_description = stemmed
    print(allergies_description)
    allergies_description_split = allergies_description.split()
    print(allergies_description_split)
    
    descriptions_columns = ['abdominal', 'allergic', 'anaphylaxis', 'angioedema', 'anim', 'aspirin', 
                            'bean', 'bee', 'cefdinir', 'cough', 'cow', 'dander', 'diarrhea', 'disorder', 
                            'dust', 'dyspnea', 'edible', 'egg', 'eruption', 'finding', 'fish', 'flushes', 
                            'goes', 'grass', 'hispanic', 'hous', 'ibuprofen', 'itching', 'latex', 'lisinopril', 
                            'milk', 'mite', 'mold', 'nausea', 'nonhispanic', 'nose', 'nut', 'of', 
                            'organism', 'pain', 'peanut', 'penicillin', 'pollen', 'rash', 'red', 
                            'rhinoconjunctivitis', 'running', 'shellfish', 'skin', 'sneezing', 
                            'soya', 'substance', 'sulfamethoxazol', 'tree', 'trimethoprim', 'venom', 
                            'vomiting', 'wheal', 'wheat', 'wheezing']
    
    
    for i in descriptions_columns:
        if i == 'hispanic':
            int_features.append(hispanic)
        elif i == 'nonhispanic':
            int_features.append(1 - hispanic)
        else:
            int_features.append(allergies_description_split.count(i))
    
    print(len(int_features))
    
    tot_features = patient_features + descriptions_columns
    print(len(tot_features))
    final_features = [np.array(int_features)]
    print(tot_features)
    df_features = pd.DataFrame(final_features, columns = tot_features)
    
    prediction = allergies.predict(df_features)
    output = prediction[0]

    return render_template('index.html', prediction_text='ENCOUNTER CLASS IS {}'.format(output))


if __name__ == "__main__":
    app.run(debug=True, port=int(os.environ.get('PORT', 33507)), host='0.0.0.0')
