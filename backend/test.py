import pandas as pd

arrays = [[3, 6, 6, 12], ['potato', 'tomato', 'spinach', 'pumpkin']]

md = pd.MultiIndex.from_arrays(arrays, names=('number', 'vegetables'))
print(md)
