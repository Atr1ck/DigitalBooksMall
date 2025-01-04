from flask import Flask, abort, jsonify, request
import json
import mysql.connector
from mysql.connector import Error
from pathlib import Path
from flask_cors import CORS

current_dir = Path(__file__)
app = Flask(__name__)
CORS(app)
def load_books_from_json():
    with open(f'{current_dir.resolve().parent.parent}/books.json', 'r') as f:
        data = json.load(f)
    return data["books"]

def get_db_connection():
    try:
        connection = mysql.connector.connect(
            user="atr1ck",
            password="884621809",
            host="localhost",
            database="digitalmall",
            charset='utf8mb4',
            collation='utf8mb4_unicode_ci'
        )
        if connection.is_connected():
            print("成功连接到 MariaDB 数据库") 
            return connection
        
    except Error as e:
        print(f"数据库连接或操作失败: {e}")

@app.route('/check_user', methods=['POST'])
def check_user():
    data = request.get_json()
    username = data.get('username')
    password = data.get('password')
    print(username)
    print(password)
    connection = get_db_connection()
    cursor = connection.cursor(dictionary=True)

    query = "SELECT id, password FROM users WHERE username = %s"
    cursor.execute(query, (username,))
    user = cursor.fetchone()

    cursor.close()
    connection.close()
    
    if user and user['password'] == password:  # Check password (you should use a proper method like bcrypt here)
        return jsonify({'success': True})
    else:
        return jsonify({'success': False, 'error': 'Invalid username or password'})

# API 端点：返回user书籍
@app.route('/<string:user>/books', methods=['GET'])
def get_books(user):
    connection = get_db_connection()
    cursor = connection.cursor(dictionary=True)

    query = """
        SELECT books.id, books.title, books.author, books.price
        FROM books
        JOIN user_books ON books.id = user_books.book_id
        JOIN users ON users.id = user_books.user_id
        WHERE users.username = %s
        """
    cursor.execute(query, (user,))
    books_data = cursor.fetchall()

    cursor.close()
    connection.close()
    return jsonify(books_data)

@app.route('/users/<string:user>', methods=['GET'])
def get_user_info(user):
    connection = get_db_connection()
    cursor = connection.cursor(dictionary=True)
    cursor.execute("SELECT * FROM users WHERE username = %s", (user,))
    user_data = cursor.fetchone()
    cursor.close()
    connection.close()
    if user_data:
        return jsonify(user_data)
    else:
        abort(404, description="用户未找到")

# 更新用户信息
@app.route('/users/<string:user>', methods=['POST'])
def update_user_info(user):
    connection = get_db_connection()
    cursor = connection.cursor()

    data = request.get_json()
    nickname = data.get('nickname')
    password = data.get('password')

    if not nickname or not password:
        return jsonify({"error": "Invalid input"}), 400

    update_query = """
        UPDATE users
        SET username = %s, password = %s
        WHERE username = %s
    """
    cursor.execute(update_query, (nickname, password, user))
    connection.commit()
    cursor.close()
    connection.close()

    return jsonify({"message": "User information updated successfully"})

@app.route('/books/<int:book_id>', methods=['DELETE'])
def delete_book(book_id):
    try:
        connection = get_db_connection()
        cursor = connection.cursor()
        
        cursor.execute("DELETE FROM books WHERE id = %s", (book_id,))
        connection.commit()
        cursor.close()
        connection.close()

        return jsonify({"message": "Book deleted successfully"}), 200
    except Error as e:
        return jsonify({"error": str(e)}), 500


if __name__ == '__main__':
    app.run(debug=True)