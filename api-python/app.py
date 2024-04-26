from flask import Flask, request, jsonify, session
from flask_cors import CORS, cross_origin
from datetime import datetime
import mysql.connector


app = Flask(__name__)
cors = CORS(app)
app.config['CORS_HEADERS'] = 'Content-Type'
app.secret_key = "#12345#"
        
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
clientes = []

@app.route('/cadastro_clientes', methods=['POST'])
def cadastrar_cliente():
    conn = connect_db()
    cursor = conn.cursor()
    
    data = request.get_json()
    nome = data.get('nome')
    email = data.get('email')
    telefone = data.get('telefone')
    cpf = data.get('cpf')
    senha = data.get('senha')

    if not nome or not email or not telefone or not cpf or not senha:
        return jsonify({'erro': 'Todos os campos são obrigatórios'}), 400

    for cliente in clientes:
        if cliente['cpf'] == cpf:
            return jsonify({'erro': 'CPF já cadastrado'}), 400
    
    cursor.execute('INSERT INTO cadastro_clientes (nome, email, telefone, cpf, senha) VALUES (%s, %s, %s, %s, %s)', (nome, email, telefone, cpf, senha))
    
    conn.commit()
    conn.close()

    return jsonify({'mensagem': 'Cliente cadastrado com sucesso'}), 201

@app.route('/cadastro_clientes', methods=['GET'])
def get_cadastro():
    conn = connect_db()
    cursor = conn.cursor(dictionary=True)

    # Selecionar todas os cadastros
    cursor.execute('SELECT * FROM cadastro_clientes')
    clientes = cursor.fetchall()

    conn.close()

    return jsonify(clientes)

#Login
users = []

@app.route('/users', methods=['GET'])
def get_users():
    return jsonify(users)

@app.route('/login', methods=['POST'])
def login():
    conn = connect_db()
    cursor = conn.cursor()
    
    data = request.get_json()
    email = data.get('email')
    senha = data.get('senha')
    
    # Verifique se o CPF e a senha correspondem a um registro na tabela de clientes
    query = "SELECT * FROM cadastro_clientes WHERE email = %s AND senha = %s"
    cursor.execute(query, (email, senha))
    cliente = cursor.fetchall()
    
    if not cliente: 
        return jsonify({'error': 'Missing username or email'}), 500
    
    if cliente:
        # Autenticação bem-sucedida
        # Você pode armazenar informações de autenticação na sessão se desejar
        session['client_name'] = cliente[0][1]
        
    return jsonify({'user': {
        'nome': cliente[0][1],
        'cpf': cliente[0][4]
    }}), 200       

if __name__ == '__main__':
    app.run(debug=True, port=1414)