from flask import Flask
from models import db
from flask_cors import CORS

app = Flask(__name__)
CORS(app)
app.config['SQLALCHEMY_DATABASE_URI'] = 'sqlite:///expenses.db'
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False

db.init_app(app)

@app.route('/initdb')
def init_db():
    with app.app_context():
        db.create_all()
    return 'Database initialized!'

if __name__ == '__main__':
    app.run(debug=True) 