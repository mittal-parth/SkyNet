import pandas as pd
from sklearn.datasets import load_iris
from sklearn.model_selection import train_test_split
from sklearn.metrics import accuracy_score, precision_score, recall_score
import numpy as np
import torch
import torch.nn as nn
import torch.nn.functional as F
from torch.autograd import Variable
import tqdm
import os
import json
import ezkl

iris = load_iris()
dataset = pd.DataFrame(data=np.c_[iris['data'], iris['target']],
                       columns=iris['feature_names'] + ['target'])


class Model(nn.Module):
    # define nn
    def __init__(self):
        super(Model, self).__init__()
        self.fc1 = nn.Linear(4, 4)
        self.fc2 = nn.Linear(4, 3)
        self.fc3 = nn.Linear(3, 3)
        self.relu = nn.ReLU()

    def forward(self, x):
        x = self.fc1(x)
        x = self.relu(x)
        x = self.fc2(x)
        x = self.relu(x)
        x = self.fc3(x)
        x = self.relu(x)

        return x


# Initialize Model
model = Model()

train_X, test_X, train_y, test_y = train_test_split(
    dataset[dataset.columns[0:4]].values,  # use columns 0-4 as X
    dataset.target,  # use target as y
    test_size=0.2  # use 20% of data for testing
)

# Uncomment for sanity checks
# print("train_X: ", train_X)
# print("test_X: ", test_X)
print("train_y: ", train_y)
print("test_y: ", test_y)

# our loss function
loss_fn = nn.CrossEntropyLoss()

# our optimizer
optimizer = torch.optim.SGD(model.parameters(), lr=0.01)

# use 800 EPOCHS
EPOCHS = 2

# Convert training data to pytorch variables
train_X = Variable(torch.Tensor(train_X).float())
test_X = Variable(torch.Tensor(test_X).float())
train_y = Variable(torch.Tensor(train_y.values).long())
test_y = Variable(torch.Tensor(test_y.values).long())

loss_list = np.zeros((EPOCHS, ))
accuracy_list = np.zeros((EPOCHS, ))

# we use tqdm for nice loading bars
for epoch in tqdm.trange(EPOCHS):

    # To train, we get a prediction from the current network
    predicted_y = model(train_X)

    # Compute the loss to see how bad or good we are doing
    loss = loss_fn(predicted_y, train_y)

    # Append the loss to keep track of our performance
    loss_list[epoch] = loss.item()

    # Afterwards, we will need to zero the gradients to reset
    optimizer.zero_grad()
    loss.backward()
    optimizer.step()

    # Calculate the accuracy, call torch.no_grad() to prevent updating gradients
    # while calculating accuracy
    with torch.no_grad():
        y_pred = model(test_X)
        correct = (torch.argmax(y_pred,
                                dim=1) == test_y).type(torch.FloatTensor)
        accuracy_list[epoch] = correct.mean()

# Plot the Accuracy and Loss
# Specify all the files we need
state_dict = dict(model.state_dict())
state_dict = {key: value.tolist() for key, value in state_dict.items()}
print(state_dict)
json_data = json.dumps(
    state_dict
)  # The indent parameter is optional, it makes the JSON output more readable

model_path = os.path.join('network.onnx')
compiled_model_path = os.path.join('network.ezkl')
pk_path = os.path.join('test.pk')
vk_path = os.path.join('test.vk')
settings_path = os.path.join('settings.json')
srs_path = os.path.join('kzg.srs')
witness_path = os.path.join('witness.json')
data_path = os.path.join('input.json')
cal_data_path = os.path.join('cal_data.json')

# After training, export to onnx (network.onnx) and create a data file (input.json)

# create a random input
x = test_X[0].reshape(1, 4)

# Flips the neural net into inference mode
model.eval()

# Export the model
torch.onnx.export(
    model,  # model being run
    x,  # model input (or a tuple for multiple inputs)
    model_path,  # where to save the model (can be a file or file-like object)
    export_params=
    True,  # store the trained parameter weights inside the model file
    opset_version=10,  # the ONNX version to export the model to
    do_constant_folding=
    True,  # whether to execute constant folding for optimization
    input_names=['input'],  # the model's input names
    output_names=['output'],  # the model's output names
    dynamic_axes={
        'input': {
            0: 'batch_size'
        },  # variable length axes
        'output': {
            0: 'batch_size'
        }
    })

data_array = ((x).detach().numpy()).reshape([-1]).tolist()

data = dict(input_data=[data_array])

# use the test set to calibrate the circuit
# Serialize data into file:
json.dump(data, open(data_path, 'w'))

# use the test set to calibrate the circuit
cal_data = dict(input_data=test_X.flatten().tolist())

# Serialize calibration data into file:
json.dump(data, open(cal_data_path, 'w'))
# Serialize calibration data into file:

res = ezkl.gen_settings(model_path, settings_path)
assert res == True

res = ezkl.calibrate_settings(cal_data_path, model_path, settings_path,
                              "resources")  # Optimize for resources
res = ezkl.compile_circuit(model_path, compiled_model_path, settings_path)
assert res == True
# res = ezkl.get_srs(srs_path, settings_path)

res = ezkl.setup(
    compiled_model_path,
    vk_path,
    pk_path,
    srs_path,
)

assert res == True
assert os.path.isfile(vk_path)
assert os.path.isfile(pk_path)
assert os.path.isfile(settings_path)

# Generate the Witness for the proof

# now generate the witness file
witness_path = os.path.join('witness.json')

res = ezkl.gen_witness(data_path, compiled_model_path, witness_path)
assert os.path.isfile(witness_path)

# Generate the proof

proof_path = os.path.join('proof.json')

proof = ezkl.prove(
    witness_path,
    compiled_model_path,
    pk_path,
    proof_path,
    srs_path,
    "single",
)
print(proof)
assert os.path.isfile(proof_path)

# verify our proof

res = ezkl.verify(
    proof_path,
    settings_path,
    vk_path,
    srs_path,
)

assert res == True
print("verified")

sol_code_path = os.path.join('Verifier.sol')
abi_path = os.path.join('Verifier.abi')

res = ezkl.create_evm_verifier(vk_path, settings_path, sol_code_path, abi_path)

assert res == True
assert os.path.isfile(sol_code_path)
