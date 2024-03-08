from flask import Flask, request, jsonify
from flask_cors import CORS, cross_origin
from datetime import datetime
import mysql.connector


app = Flask(__name__)
cors = CORS(app)
app.config['CORS_HEADERS'] = 'Content-Type'

def connect_db():
    return mysql.connector.connect(
        host='localhost',
        user='root',
        password='98515135',
        database='OrganizacaoFinanceira'
    )

@app.route('/transaction', methods=['POST'])
def add_transaction():
    conn = connect_db()
    cursor = conn.cursor()

    data = request.get_json()
    description = data['description']
    amount = data['amount']
    category = data['category']
    date_transaction = data['date']
    date_formatted = datetime.strptime(date_transaction, "%Y-%m-%dT%H:%M:%S.%fZ")
    date_formatted_sql = date_formatted.strftime("%Y-%m-%d")

    # formatted_date = datetime.datetime.strptime(date_transaction, '%d-%m-%Y')

    # Inserir a transação no banco de dados
    cursor.execute('INSERT INTO transactions (description, amount, date, category) VALUES (%s, %s, %s, %s)', (description, amount, date_formatted_sql, category))
    conn.commit()
    conn.close()

    return jsonify({'message': 'Transação adicionada com sucesso'}), 201

# Campo para deletar transação

@app.route('/transactions/<int:id>', methods=['DELETE'])
def delete_transaction(id):
    cursor = db.cursor()
    
    # Deletar a transação do banco de dados
    cursor.execute("DELETE FROM transacoes WHERE id = %s", (id,))
    db.commit()
    
    return jsonify({"mensagem": "Transação deletada com sucesso"}), 200

@app.route('/transactions', methods=['GET'])
def get_transactions():
    conn = connect_db()
    cursor = conn.cursor(dictionary=True)

    # Selecionar todas as transações do banco de dados
    cursor.execute('SELECT * FROM transactions')
    transactions = cursor.fetchall()

    conn.close()

    return jsonify(transactions)

# Cadastro do Cliente
@app.route('/clientes', methods=['POST'])
def cadastrarCliente():
    conn = connect_db()
    cursor = conn.cursor()
    
    data = request.get_json()
    nome = data['nome'],
    cpf = data['cpf'],
    email = data['email'],
    telefone = data['telefone'],
    senha = data['senha']
    
    cursor.execute('INSERT INTO Clientes (nome, cpf, email, telefone, senha) VALUES (%s, %s, %s, %s, %s)', (nome, cpf, email, telefone, senha))
    conn.commit()
    conn.close()

    return jsonify({'message': 'Cadastro adicionado com sucesso'}), 201

@app.route('/Cliente', methods=['GET'])
def get_cadastro():
    conn = connect_db()
    cursor = conn.cursor(dictionary=True)

    # Selecionar todas os cadastros
    cursor.execute('SELECT * FROM Clientes')
    Clientes = cursor.fetchall()

    conn.close()

    return jsonify({'cliente': Clientes})
    

        
if __name__ == '__main__':
    app.run(debug=True, port=1414)