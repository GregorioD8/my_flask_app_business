import logging
from .config import app
from .models import db, Coach, Client, Session, ClientAgreement
import os
from datetime import datetime, timedelta
from werkzeug.security import generate_password_hash
from sqlalchemy import text

logging.basicConfig(level=logging.INFO, format='%(asctime)s - %(levelname)s - %(message)s')

def drop_tables():
    with app.app_context():
        with db.engine.connect() as connection:
            connection.execute(text("DROP TABLE IF EXISTS client_agreements;"))
            connection.execute(text("DROP TABLE IF EXISTS sessions;"))
            connection.execute(text("DROP TABLE IF EXISTS clients;"))
            connection.execute(text("DROP TABLE IF EXISTS coaches;"))

def create_coaches():
    coaches = [
        Coach(name="Matilda Hubert", specialization="Trauma Coaching", username="matilda", password_hash=generate_password_hash("password123")),
        Coach(name="Ricky Milton", specialization="Mindfulness and Performance Coaching", username="ricky", password_hash=generate_password_hash("password123")),
        Coach(name="Sam Morton", specialization="Depression Coaching", username="sam", password_hash=generate_password_hash("password123")),
        Coach(name="Denise Lawson", specialization="Trauma Coaching", username="denise", password_hash=generate_password_hash("password123")),
        Coach(name="Natalie Ventura", specialization="Mindfulness and Performance Coaching", username="natalie", password_hash=generate_password_hash("password123")),
        Coach(name="Veronica Bolton", specialization="Depression Coaching", username="veronica", password_hash=generate_password_hash("password123")),
    ]
    return coaches

def create_clients():
    clients = [
        Client(name="Alice Smith", goals="Overcome anxiety"),
        Client(name="Bob Johnson", goals="Move on from the death of a loved one"),
        Client(name="Charlie Brown", goals="Get over ex-girlfriend"),
        Client(name="David Wilson", goals="Set boundaries with family and friends"),
        Client(name="Eva Green", goals="More confidence"),
        Client(name="Hannah White", goals="Cope with social anxiety"),
        Client(name="Sophia Davis", goals="Recover from a traumatic event"),
        Client(name="Lily Thompson", goals="Manage chronic stress"),
        Client(name="Jack Lewis", goals="Enhance focus during work"),
        Client(name="Amelia Baker", goals="Overcome fear of public speaking"),
        Client(name="Michael Harris", goals="Develop mindfulness habits"),
        Client(name="Daniel King", goals="Work through childhood trauma"),
        Client(name="Ella Wright", goals="Heal from abusive relationship"),
        Client(name="Zoe Scott", goals="Manage anxiety from past experiences"),
        Client(name="Logan Adams", goals="Improve stress management"),
        Client(name="Abigail Martinez", goals="Increase mindfulness in daily activities"),
        Client(name="Owen Mitchell", goals="Balance work and personal life"),
        Client(name="Mason Carter", goals="Reduce depressive symptoms"),
        Client(name="Mia Thompson", goals="Enhance mental well-being"),
        Client(name="Liam Anderson", goals="Develop positive coping strategies"),
    ]
    return clients

def create_sessions(coaches, clients):
    base_sessions = [
        # Creating sessions for specific client-coach pairs for month of November
        Session(date=datetime(2024, 10, 30, 9, 0), client_id=clients[0].id, coach_id=coaches[0].id, notes="Got better at boundaries", goal_progress=8),
        Session(date=datetime(2024, 10, 30, 10, 0), client_id=clients[1].id, coach_id=coaches[1].id, notes="Got back with abusive ex", goal_progress=6),
        Session(date=datetime(2024, 10, 30, 11, 0), client_id=clients[2].id, coach_id=coaches[2].id, notes="Got stronger socially", goal_progress=4),
        Session(date=datetime(2024, 11, 1, 9, 0), client_id=clients[3].id, coach_id=coaches[0].id, notes="Discussed coping strategies", goal_progress=7),
        Session(date=datetime(2024, 11, 1, 10, 0), client_id=clients[4].id, coach_id=coaches[1].id, notes="Improved mindfulness techniques", goal_progress=9),
        Session(date=datetime(2024, 11, 1, 11, 0), client_id=clients[5].id, coach_id=coaches[2].id, notes="Worked on self-esteem", goal_progress=5),
        Session(date=datetime(2024, 11, 2, 9, 0), client_id=clients[6].id, coach_id=coaches[0].id, notes="Strengthened boundaries", goal_progress=8),
        Session(date=datetime(2024, 11, 2, 10, 0), client_id=clients[7].id, coach_id=coaches[1].id, notes="Discussed family issues", goal_progress=6),
        Session(date=datetime(2024, 11, 2, 11, 0), client_id=clients[8].id, coach_id=coaches[2].id, notes="Explored past trauma", goal_progress=5),
        Session(date=datetime(2024, 11, 3, 9, 0), client_id=clients[9].id, coach_id=coaches[0].id, notes="Setting new goals", goal_progress=10),
        Session(date=datetime(2024, 11, 3, 10, 0), client_id=clients[10].id, coach_id=coaches[1].id, notes="Enhanced coping mechanisms", goal_progress=7),
        Session(date=datetime(2024, 11, 3, 11, 0), client_id=clients[11].id, coach_id=coaches[2].id, notes="Focusing on positive outcomes", goal_progress=9),
        Session(date=datetime(2024, 11, 4, 9, 0), client_id=clients[12].id, coach_id=coaches[0].id, notes="Discussed future plans", goal_progress=8),
        Session(date=datetime(2024, 11, 4, 10, 0), client_id=clients[13].id, coach_id=coaches[1].id, notes="Improved stress management", goal_progress=7),
        Session(date=datetime(2024, 11, 4, 11, 0), client_id=clients[14].id, coach_id=coaches[2].id, notes="Worked on relaxation techniques", goal_progress=6),
        Session(date=datetime(2024, 11, 5, 9, 0), client_id=clients[15].id, coach_id=coaches[0].id, notes="Explored new strategies", goal_progress=9),
        Session(date=datetime(2024, 11, 5, 10, 0), client_id=clients[16].id, coach_id=coaches[1].id, notes="Discussed relationship goals", goal_progress=5),
        Session(date=datetime(2024, 11, 5, 11, 0), client_id=clients[17].id, coach_id=coaches[2].id, notes="Focused on work-life balance", goal_progress=8),
        Session(date=datetime(2024, 11, 6, 9, 0), client_id=clients[18].id, coach_id=coaches[0].id, notes="Setting realistic expectations", goal_progress=10),
        Session(date=datetime(2024, 11, 6, 10, 0), client_id=clients[19].id, coach_id=coaches[1].id, notes="Strengthening coping strategies", goal_progress=7),
    ]
    
    additional_sessions = []
    days_to_add = 30  # Total days to add sessions

    for i, coach in enumerate(coaches):
        for j in range(10):  # For each client, add 10 sessions
            for day in range(days_to_add):
                session_date = datetime(2024, 10, 30) + timedelta(days=day)

                # Skip weekends
                if session_date.weekday() in (5, 6):  # 5 = Saturday, 6 = Sunday
                    continue

                hour_offset = 9 + (j % 9)  # Rotate through hours from 9 AM to 5 PM
                if hour_offset >= 17:  # Limit to 5 PM
                    hour_offset = 9

                additional_sessions.append(
                    Session(
                        date=datetime(session_date.year, session_date.month, session_date.day, hour_offset, 0),
                        client_id=clients[(i + j) % len(clients)].id,
                        coach_id=coach.id,
                        notes=f"Session with {clients[(i + j) % len(clients)].name}",
                        goal_progress=(j % 10) + 1
                    )
                )

    return base_sessions + additional_sessions

def create_client_agreements(coaches, clients):
    # Creating client agreements for each coach-client pair
    # Will need to programatically add these for the pairs first session
    client_agreements = [
        ClientAgreement(client_id=clients[0].id, coach_id=coaches[0].id, agreement_status="SIGNED"),
        ClientAgreement(client_id=clients[1].id, coach_id=coaches[1].id, agreement_status="SIGNED"),
        ClientAgreement(client_id=clients[2].id, coach_id=coaches[2].id, agreement_status="SIGNED"),
        ClientAgreement(client_id=clients[3].id, coach_id=coaches[0].id, agreement_status="SIGNED"),
        ClientAgreement(client_id=clients[4].id, coach_id=coaches[1].id, agreement_status="SIGNED"),
        ClientAgreement(client_id=clients[5].id, coach_id=coaches[2].id, agreement_status="SIGNED"),
        ClientAgreement(client_id=clients[6].id, coach_id=coaches[0].id, agreement_status="SIGNED"),
        ClientAgreement(client_id=clients[7].id, coach_id=coaches[1].id, agreement_status="SIGNED"),
        ClientAgreement(client_id=clients[8].id, coach_id=coaches[2].id, agreement_status="SIGNED"),
        ClientAgreement(client_id=clients[9].id, coach_id=coaches[0].id, agreement_status="SIGNED"),
        ClientAgreement(client_id=clients[10].id, coach_id=coaches[1].id, agreement_status="SIGNED"),
        ClientAgreement(client_id=clients[11].id, coach_id=coaches[2].id, agreement_status="SIGNED"),
        ClientAgreement(client_id=clients[12].id, coach_id=coaches[0].id, agreement_status="SIGNED"),
        ClientAgreement(client_id=clients[13].id, coach_id=coaches[1].id, agreement_status="SIGNED"),
        ClientAgreement(client_id=clients[14].id, coach_id=coaches[2].id, agreement_status="SIGNED"),
        ClientAgreement(client_id=clients[15].id, coach_id=coaches[0].id, agreement_status="SIGNED"),
        ClientAgreement(client_id=clients[16].id, coach_id=coaches[1].id, agreement_status="SIGNED"),
        ClientAgreement(client_id=clients[17].id, coach_id=coaches[2].id, agreement_status="SIGNED"),
        ClientAgreement(client_id=clients[18].id, coach_id=coaches[0].id, agreement_status="SIGNED"),
        ClientAgreement(client_id=clients[19].id, coach_id=coaches[1].id, agreement_status="SIGNED"),
    ]
    
    return client_agreements

if __name__ == '__main__':
    db_path = os.path.join(os.path.dirname(__file__), 'app.db')

    if os.path.exists(db_path):
        os.remove(db_path)

    with app.app_context():
        try:
            logging.info('Dropping existing tables...')
            drop_tables()  # This line is new

            logging.info('Creating a new database...')
            db.create_all()

            logging.info("Seeding activities...")
            coaches = create_coaches()
            db.session.add_all(coaches)
            db.session.commit()

            logging.info("Seeding clients...")
            clients = create_clients()
            db.session.add_all(clients)
            db.session.commit()

            logging.info("Seeding sessions...")
            sessions = create_sessions(coaches, clients)
            db.session.add_all(sessions)
            db.session.commit()

            logging.info("Seeding client agreements...")
            client_agreements = create_client_agreements(coaches, clients)
            db.session.add_all(client_agreements)
            db.session.commit()

            logging.info("Done seeding!")

        except Exception as e:
            logging.error(f"An error occurred: {e}")
            db.session.rollback()  # Rollback the session in case of error