from flask import Flask, request, jsonify, make_response
from flask_cors import CORS
from flask_bcrypt import Bcrypt
from pymongo import MongoClient
import jwt
import datetime
import base64

# Initialize Flask app
app = Flask(__name__)
CORS(app, supports_credentials=True, origins=["http://localhost:3000"])
bcrypt = Bcrypt(app)
app.config['SECRET_KEY'] = 'my_secret_key'

# MongoDB setup for storing users and images
client = MongoClient('mongodb://localhost:27017/')
db = client.photo_gallery
users = db.users
images = db.images

def encode_image(image_path):
    """
    Encodes an image to a base64 string.
    
    :param image_path: Path to the image file.
    :return: Base64 encoded string of the image.
    """
    with open(image_path, "rb") as img_file:
        return base64.b64encode(img_file.read()).decode('utf-8')

def decode_image(encoded_string, filename):
    """
    Decodes a base64 string to an image file.
    
    :param encoded_string: Base64 string of the image.
    :param filename: Filename to save the decoded image.
    """
    with open(filename, "wb") as img_file:
        img_file.write(base64.b64decode(encoded_string))

# File upload endpoint
@app.route('/api/upload', methods=['POST'])
def upload_file():
    """
    Endpoint to upload an image file. The image is saved as a base64 string in the database.
    Only image file formats are allowed (jpeg, png, gif, jpg).

    :return: JSON response indicating success or failure.
    """
    if 'image' not in request.files:
        return jsonify({'error': 'No file part'}), 400

    file = request.files['image']
    if file.filename == '':
        return jsonify({'error': 'No selected file'}), 400

    # Check file MIME type
    if not file.content_type in ['image/jpeg', 'image/png', 'image/gif', 'image/jpg']:
        return jsonify({'error': 'File type not allowed'}), 400

    image_data = file.read()
    encoded_image = base64.b64encode(image_data).decode('utf-8')

    # Retrieve token from Authorization header
    auth_header = request.headers.get('Authorization')
    if auth_header:
        token = auth_header.split(" ")[1]  # Assumes format "Bearer <token>"
    else:
        return jsonify({'error': 'Authorization header is missing'}), 401

    try:
        username = jwt.decode(token, app.config['SECRET_KEY'], algorithms=['HS256'])['username']
        images.insert_one({"username": username, "data": encoded_image})
        return jsonify({'message': 'File uploaded successfully'}), 201
    except jwt.ExpiredSignatureError:
        return jsonify({'error': 'Token expired'}), 401
    except jwt.InvalidTokenError:
        return jsonify({'error': 'Invalid token'}), 401
    except Exception as e:
        return jsonify({'error': str(e)}), 500

# Retrieve images endpoint
@app.route('/api/images', methods=['GET'])
def get_images():
    """
    Endpoint to get all images uploaded by the authenticated user.

    :return: JSON response with the images or an error message.
    """
    auth_header = request.headers.get('Authorization')
    if auth_header:
        token = auth_header.split(" ")[1]  # Assumes format "Bearer <token>"
    else:
        return jsonify({'error': 'Authorization header is missing'}), 401

    try:
        payload = jwt.decode(token, app.config['SECRET_KEY'], algorithms=['HS256'])
        username = payload['username']
        images_data = list(images.find({"username": username}, {'_id': 0, 'data': 1}))
        return jsonify({'images': images_data}), 200
    except jwt.ExpiredSignatureError:
        return jsonify({'error': 'Token expired'}), 401
    except jwt.InvalidTokenError:
        return jsonify({'error': 'Invalid token'}), 401

# User registration endpoint
@app.route('/register/', methods=['POST'])
def register():
    """
    Endpoint to register a new user. Stores user details including hashed password.
    
    :return: JSON response indicating success or failure.
    """
    data = request.json
    username = data.get('username')
    first_name = data.get('first_name')
    last_name = data.get('last_name')
    password = data.get('password')

    if not username or not password:
        return jsonify({'error': 'Missing username or password'}), 400

    if users.find_one({'username': username}):
        return jsonify({'error': 'Username already exists'}), 409

    hashed_password = bcrypt.generate_password_hash(password).decode('utf-8')
    users.insert_one({
        'username': username,
        'first_name': first_name,
        'last_name': last_name,
        'password': hashed_password
    })
    return jsonify({'message': 'User created successfully'}), 201

# User login endpoint
@app.route('/login/', methods=['POST'])
def login():
    """
    Endpoint to authenticate a user and issue a JWT.
    
    :return: JSON response indicating success or failure, with a set cookie for the token.
    """
    data = request.json
    username = data.get('username')
    password = data.get('password')

    if not username or not password:
        return jsonify({'error': 'Missing username or password'}), 400

    user = users.find_one({'username': username})
    if user and bcrypt.check_password_hash(user['password'], password):
        token = jwt.encode({
            'username': username,
            'exp': datetime.datetime.utcnow() + datetime.timedelta(hours=1)
        }, app.config['SECRET_KEY'], algorithm='HS256')

        user_data = {'username': user['username']}
        resp = make_response(jsonify({'message': 'Login successful', 'user': user_data, 'token': token}))
        resp.set_cookie('token', token, httponly=True, secure=False, samesite='None')
        return resp
    else:
        return jsonify({'error': 'Invalid username or password'}), 401

# Welcome endpoint
@app.route('/')
def home():
    """
    Welcome endpoint for the photo gallery app.
    
    :return: A welcome message.
    """
    return 'Welcome to the Photo Gallery App!'

if __name__ == '__main__':
    app.run(debug=True)  # Consider setting debug to False in a production environment
