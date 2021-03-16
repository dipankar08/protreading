import json
from typing import Dict
symbols: Dict = {}
with open('src/config/sync.json') as json_file:
    data = json.load(json_file)

    for p in data['SUPPORTED_SYMBOL']:
        symbols[p['key']] = p['text']

# print(symbols)
