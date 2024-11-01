# config.py
import os
import logging
from flask import Flask
from flask_cors import CORS
from flask_migrate import Migrate
from flask_restful import Api
from flask_sqlalchemy import SQLAlchemy
from sqlalchemy import MetaData
from dotenv import load_dotenv 
load_dotenv() 

# Set up logging
logging.basicConfig(level=logging.INFO, format='%(asctime)s - %(levelname)s - %(message)s')

# Instantiate the Flask app
app = Flask(__name__)

# Set configurations for the app
app.config['SQLALCHEMY_DATABASE_URI'] = os.environ.get('DATABASE_URI')  # Fetch the database URI from environment
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False  # Disable track modifications to save resources
app.config['SECRET_KEY'] = os.environ.get('SECRET_KEY', 'your_default_secret_key')  # Default secret key for sessions
app.json.compact = False  # Disable compact JSON for better readability

# Define metadata for the database
metadata = MetaData(naming_convention={
    "ix": "ix_%(column_0_label)s",
    "uq": "uq_%(table_name)s_%(column_0_name)s",
    "ck": "ck_%(table_name)s_%(constraint_name)s",
    "fk": "fk_%(table_name)s_%(column_0_name)s_%(referred_table_name)s",
    "pk": "pk_%(table_name)s"
})

# Instantiate the database and migration objects
db = SQLAlchemy(metadata=metadata)
migrate = Migrate(app, db)

# Initialize the database with the app
db.init_app(app)

# Instantiate REST API and enable CORS
api = Api(app)
CORS(app)

logging.info("Flask app configured successfully.")