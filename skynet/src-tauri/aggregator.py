import sys
import json

arg = sys.argv[1]

json_file_path = "weight1.json"

# Read JSON data from the file
with open(json_file_path, 'r') as file:
    json_data = file.read()

for i in range(1, int(arg) + 1):
    file = "weights" + str(i) + ".json"
    with open(file, 'r') as f:
        j = f.read()
        for key, val in j.items():
            json_data[key] += val

for key, val in json_data.items():
    json_data[key] = val / 10

json_data = json.dumps(json_data)

with open("weights_final.json", 'w') as file:
    file.write(json_data)
