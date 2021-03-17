import json
from typing import Dict
symbols: Dict = {}
with open('myapp/core/sync.json') as json_file:
    data = json.load(json_file)

    for p in data['SUPPORTED_SYMBOL']:
        symbols[p['key']] = p['text']

# print(symbols)
