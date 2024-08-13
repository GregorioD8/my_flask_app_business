from flask import Flask, request, jsonify
from flask_cors import CORS
from flask_migrate import Migrate
from flask_restful import Api, Resource
from models import db, Client, Coach, Session, CoachClient
from datetime import datetime

app = Flask(__name__)
app.config['SQLALCHEMY_DATABASE_URI'] = 'sqlite:///app.db'
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False
app.json.compact = False

# Instantiate CORS
CORS(app)
migrate = Migrate(app, db)
db.init_app(app)

# Instantiate REST API
api = Api(app)

@app.route('/')
def home():
    return ''

class Clients(Resource):
    def get(self):
        try:
            clients = Client.query.all()
            new_clients = [c.to_dict(only=('id', 'name', 'goals')) for c in clients]
            return new_clients, 200
        except Exception as e:
            return {'error': 'Bad request', 'message': str(e)}, 400

    def post(self):
        try:
            new_client = Client(
                name=request.json['name'],
                goals=request.json['goals']
            )
            db.session.add(new_client)
            db.session.commit()
            return new_client.to_dict(only=('id', 'name', 'goals')), 201
        except Exception as e:
            return {'errors': ['validation errors', str(e)]}, 400

api.add_resource(Clients, '/clients')

class ClientsById(Resource):
    def get(self, id):
        try:
            client = Client.query.filter_by(id=id).first()
            if not client:
                return {'error': 'Client not found'}
            return client.to_dict(only=('id', 'name', 'goals', 'sessions')), 200
        except Exception as e:
            return {'error': 'Client not found', 'message': str(e)}, 404

    def patch(self, id):
        try:
            client = Client.query.filter_by(id=id).first()
            if not client:
                return {'error': 'Client not found'}, 404
            data = request.json
            for key, value in data.items():
                setattr(client, key, value)
            db.session.commit()
            return client.to_dict(only=('id', 'name', 'goals', 'sessions')), 200
        except Exception as e:
            return {'errors': ['validation errors', str(e)]}, 400

    def delete(self, id):
        try:
            client = Client.query.filter_by(id=id).first()
            if not client:
                return {'error': 'Client not found'}
            db.session.delete(client)
            db.session.commit()
            return {}, 204
        except Exception as e:
            return {'error': 'Client not found', 'message': str(e)}, 404

api.add_resource(ClientsById, '/clients/<int:id>')

class Coaches(Resource):
    def get(self):
        try:
            coaches = [coach.to_dict(only=('id', 'name', 'specialization')) for coach in Coach.query.all()]
            return coaches, 200
        except Exception as e:
            return {'error': 'Bad request', 'message': str(e)}, 400

    def post(self):
        try:
            new_coach = Coach(
                name=request.json['name'],
                specialization=request.json['specialization']
            )
            db.session.add(new_coach)
            db.session.commit()
            return new_coach.to_dict(only=('id', 'name', 'specialization')), 201
        except Exception as e:
            return {'errors': ['validation errors', str(e)]}, 400

api.add_resource(Coaches, '/coaches')

class Sessions(Resource):
    def get(self):
        try:
            sessions = Session.query.all()
            session_data = [
                {
                    'id': session.id,
                    'date': session.date.strftime('%Y-%m-%d %H:%M:%S'),
                    'notes': session.notes,
                    'goal_progress': session.goal_progress,
                    'coach_name': session.coach.name,  # Include coach name here
                    'client_name': session.client.name,  # Include client name here
                }
                for session in sessions
            ]
            return session_data, 200
        except Exception as e:
            return {'error': 'Bad request', 'message': str(e)}, 400

    def post(self):
        data = request.json

        try:
            date_str = data.get('date')
            datetime_obj = datetime.strptime(date_str, '%Y-%m-%d %H:%M:%S')

            new_session = Session(
                date=datetime_obj,
                notes=data['notes'],
                goal_progress=data['goal_progress'],
                coach_id=data['coach_id'],
                client_id=data['client_id']
            )
            db.session.add(new_session)
            db.session.commit()
            return {
                'id': new_session.id,
                'date': new_session.date.strftime('%Y-%m-%d %H:%M:%S'),
                'notes': new_session.notes,
                'goal_progress': new_session.goal_progress,
                'coach_name': new_session.coach.name,  # Include coach name here
                'client_name': new_session.client.name,  # Include client name here
            }, 201
        except Exception as e:
            print("Error when creating a new session:", str(e))
            return {'errors': ['validation errors', str(e)]}, 400

api.add_resource(Sessions, '/sessions')

class SessionsById(Resource):
    def patch(self, session_id):
        try:
            session = Session.query.get_or_404(session_id)
            data = request.json
            for key, value in data.items():
                setattr(session, key, value)
            db.session.commit()
            session_data = {
                'id': session.id,
                'date': session.date.strftime('%Y-%m-%d %H:%M:%S'),
                'notes': session.notes,
                'goal_progress': session.goal_progress,
                'coach': session.coach.to_dict(only=('id', 'name')),
                'client': session.client.to_dict(only=('id', 'name'))
            }
            return session_data, 200
        except Exception as e:
            return {'errors': ['validation errors', str(e)]}, 400

    def delete(self, session_id):
        try:
            session = Session.query.get_or_404(session_id)
            db.session.delete(session)
            db.session.commit()
            return {}, 204
        except Exception as e:
            return {'error': 'Session not found', 'message': str(e)}, 404

api.add_resource(SessionsById, '/sessions/<int:session_id>')

#### Route for listing clients of a specific coach ####
@app.route('/coaches/<int:coach_id>/clients')
def get_clients_for_coach(coach_id):
    try:
        clients = db.session.query(Client).join(CoachClient).filter(CoachClient.coach_id == coach_id).distinct().all()
        client_list = [client.to_dict(only=('id', 'name')) for client in clients]
        return jsonify(client_list), 200
    except Exception as e:
        return {'error': 'Bad request', 'message': str(e)}, 400

@app.route('/coaches/<int:coach_id>/sessions')
def get_sessions_for_coach(coach_id):
    try:
        client_id = request.args.get('client_id')
        query = db.session.query(Session, Client, Coach)\
                          .join(Client, Session.client_id == Client.id)\
                          .join(Coach, Session.coach_id == Coach.id)\
                          .filter(Session.coach_id == coach_id)
        
        if client_id:
            query = query.filter(Session.client_id == client_id)
        
        sessions = query.all()
        session_list = [{
            'id': s.Session.id,
            'date': s.Session.date.strftime('%Y-%m-%d %H:%M:%S'),
            'client_name': s.Client.name,
            'coach_name': s.Coach.name,
            'notes': s.Session.notes,
            'goal_progress': s.Session.goal_progress
        } for s in sessions]
        return jsonify(session_list), 200
    except Exception as e:
        return {'error': 'Bad request', 'message': str(e)}, 400
    
class CoachClientResource(Resource):
    def get(self):
        try:
            coach_clients = CoachClient.query.all()
            return [cc.to_dict() for cc in coach_clients], 200
        except Exception as e:
            return {'error': 'Bad request', 'message': str(e)}, 400

    def post(self):
        try:
            new_coach_client = CoachClient(
                coach_id=request.json['coach_id'],
                client_id=request.json['client_id'],
                notes=request.json.get('notes', '')
            )
            db.session.add(new_coach_client)
            db.session.commit()
            return new_coach_client.to_dict(), 201
        except Exception as e:
            return {'errors': ['validation errors', str(e)]}, 400

api.add_resource(CoachClientResource, '/coach_clients')

if __name__ == '__main__':
    app.run(debug=True)