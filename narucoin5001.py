# -*- coding: utf-8 -*-
"""
Created on Thu Mar  6 12:11:16 2025

@author: SubhankarBhattacharj
"""

# Creating a Cryptocurrency

import datetime
import hashlib
import json
from flask import Flask, jsonify, request
import requests
from uuid import uuid4
from urllib.parse import urlparse
from flask_cors import CORS


# Part 1 - Building a Blockchain

class Blockchain:
    
    def __init__(self, wallet): 
        self.chain = []
        self.transactions = []
        self.create_block(proof=1, previous_hash='0')
        self.nodes = set()
        self.id = 1
        self.wallet = wallet
        
        
    def add_transaction(self, sender, receiver, amount):
        if sender == node_address and float(amount) > self.wallet.balance :
            return None
        self.transactions.append({'id':self.id,
                                  'sender':sender,
                                  'receiver':receiver,
                                  'amount':amount})
        self.wallet.add_txs(self.id, sender, receiver, amount)
        #print(node_address)
        if receiver == node_address:
            self.wallet.balance += float(amount)
        elif sender == node_address:
            self.wallet.balance -= float(amount)
        self.id += 1
        previous_block = self.get_previous_block()
        return previous_block['index'] + 1        
        
    
    def create_block(self, proof, previous_hash):
        block = {'index':len(self.chain)+1,
                 'timestamp':str(datetime.datetime.now()),
                 'proof':proof,
                 'transactions':self.transactions,
                 'prev_hash':previous_hash}
        self.transactions = []
        self.chain.append(block)
        return block

    
    def get_previous_block(self):
        return self.chain[-1]


    def proof_of_work(self, previous_proof):
        new_proof = 1
        check_proof = False
        while check_proof is False:
            hash_operation = hashlib.sha256(str(new_proof**2 - previous_proof**2).encode()).hexdigest()
            if hash_operation[:5] == '00000':
                check_proof = True
            else:
                new_proof += 1
        return new_proof       
    

    def hash(self, block):
        encoded_block = json.dumps(block, sort_keys=True).encode()
        return hashlib.sha256(encoded_block).hexdigest()             
    
    
    def is_chain_valid(self, chain):
        previous_block = chain[0]
        block_index = 1
        while block_index < len(chain):
            block = chain[block_index]
            # Check 1
            if block['prev_hash'] != self.hash(previous_block):
                return False
            # Check 2
            previous_proof = previous_block['proof']
            proof = block['proof']
            hash_operation = hashlib.sha256(str(proof**2 - previous_proof**2).encode()).hexdigest()
            if hash_operation[:5] != '00000':
                return False
            previous_block = block
            block_index += 1
        return True            
    
    
    def add_node(self, address):
        parsed_url = urlparse(address)
        self.nodes.add(parsed_url.netloc)
        
    
    def replace_chain(self):
        network = self.nodes
        longest_chain = None
        max_length = len(self.chain)
        for node in network:
            response = requests.get(f'http://{node}/get_chain')
            if response.status_code == 200:
                length = response.json()['length']
                chain = response.json()['chain']
                if length > max_length and self.is_chain_valid(chain):
                    max_length = length
                    longest_chain = chain
        if longest_chain:
            self.chain = longest_chain
            self.id = self.chain[-1]['transactions'][-1]['id'] + 1
            self.transactions = []
            return True            
        return False
    
    
    def get_transactions(self):
        network = self.nodes
        transaction_ids = [x['id'] for x in self.transactions] 
        for node in network:
            response = requests.get(f'http://{node}/get_chain')
            if response.status_code == 200:
                transactions = response.json()['transactions']
                for transaction in transactions:
                    if transaction['id'] not in transaction_ids:
                        transaction_ids.append(transaction['id'])
                        self.transactions.append(transaction)
        if transaction_ids:
            self.id = max(transaction_ids) + 1
            

class Wallet:
    
    def __init__(self):
        self.balance = 0
        self.private_key = 'thisisprivate'
        self.public_key = node_address
        self.transactions = []
        
        
    def add_txs(self, index, sender, receiver, amount):
        self.transactions.append({'id':index,
                                  'sender':sender,
                                  'receiver':receiver,
                                  'amount':amount})
        return True
        
        
# Part 2 - Mining our Blockchain

# Creating a Web App
app = Flask(__name__)
cors = CORS(app)

# Creating an address for the node on Port 5000
node_address = str(uuid4()).replace('-','')

# Creating a Blockchain
blockchain = Blockchain(Wallet())


# Mining a new block
@app.route('/mine_block', methods=['GET'])
def mine_block():
    previous_block = blockchain.get_previous_block()
    previous_proof = previous_block['proof']
    proof = blockchain.proof_of_work(previous_proof)
    previous_hash = blockchain.hash(previous_block)
    # Mining reward
    blockchain.add_transaction(sender='Coinbase', receiver=node_address, amount=5)
    block = blockchain.create_block(proof, previous_hash)
    response = {'message':'Congratulations, you just mined a block!',
                'index':block['index'],
                'timestamp':block['timestamp'],
                'proof':block['proof'],
                'transactions':block['transactions'],               
                'prev_hash':block['prev_hash']}
    return jsonify(response), 200


# Getting the full blockchain
@app.route('/get_chain', methods=['GET'])
def get_chain():
    response = {'chain':blockchain.chain,
                'transactions':blockchain.transactions,
                'length':len(blockchain.chain)}
    return jsonify(response), 200

@app.route('/get_transactions', methods=['GET'])
def get_transactions():
    blockchain.get_transactions()
    response = {'chain':blockchain.chain,
                'transactions':blockchain.transactions,
                'length':len(blockchain.chain)}
    return jsonify(response), 200


# Checking if blockchain is valid
@app.route('/is_valid', methods=['GET'])
def is_valid():
    valid = blockchain.is_chain_valid(blockchain.chain)
    if valid:
        response = {'message':'All good. The blockchain is valid.'}
    else:
        response = {'message':'F. The blockchain is not valid!'}
    return jsonify(response), 200

@app.route('/add_transaction', methods=['POST'])
def add_transaction():
    json = request.get_json()
    transaction_keys = {'sender','receiver','amount'}
    if not all (key in json for key in transaction_keys):
        return 'Some elements of the transaction are missing.', 400
    
    index = blockchain.add_transaction(json['sender'], json['receiver'], json['amount'])
    if index:
        response = {'message':'Transaction added.'}
    else: 
        response = {'message':'Transaction rejected. Not enough balance in wallet!'}
    return jsonify(response), 200
    


# Part 3 - Decentralizing our Blockchain

# Connecting new nodes
@app.route('/connect_node', methods=['POST'])
def connect_node():
    json = request.get_json()
    nodes = json.get('nodes')
    if nodes is None:
        return 'No node', 400
    for node in nodes:
        blockchain.add_node(node)
    response = {'message':'All the nodes are now connected.',
                'total_nodes':list(blockchain.nodes)}
    return jsonify(response), 201


# Replacing the chain by the longest chain
@app.route('/replace_chain',methods=['GET'])
def replace_chain():
    is_chain_replaced = blockchain.replace_chain()
    if is_chain_replaced:
        response = {'message':'The nodes had different chains so it was replaced by the longest one',
                    'chain':blockchain.chain}
    else:
        response = {'message':'The chain is the longest one',
                    'chain':blockchain.chain}
    return jsonify(response), 200


# Wallet 
@app.route('/wallet', methods=['GET'])
def get_wallet():
    response = {'publicKey':node_address,
                'Balance':blockchain.wallet.balance,
                'Txs':blockchain.wallet.transactions}
    return jsonify(response), 200



# Running the app
app.run(host='0.0.0.0', port=5001)

    





