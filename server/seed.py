import logging
from .config import app
from .models import db, Coach, Client, Session
from datetime import datetime, timedelta
from werkzeug.security import generate_password_hash
from sqlalchemy import text
import random

# Set up logging
logging.basicConfig(level=logging.INFO, format='%(asctime)s - %(levelname)s - %(message)s')

def drop_tables():
    """Drop existing tables if they exist."""
    with app.app_context():
        try:
            with db.engine.connect() as connection:
                connection.execute(text("DROP TABLE IF EXISTS sessions CASCADE;"))
                connection.execute(text("DROP TABLE IF EXISTS clients CASCADE;"))
                connection.execute(text("DROP TABLE IF EXISTS coaches CASCADE;"))
            logging.info("Successfully dropped existing tables.")
        except Exception as e:
            logging.error(f"Error dropping tables: {e}")

def create_coaches():
    """Create a list of coaches to be added to the database."""
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
    """Create a list of clients to be added to the database."""
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
    Client(name="James Williams", goals="Build self-esteem"),
    Client(name="Ella Thompson", goals="Overcome procrastination"),
    Client(name="Olivia Brown", goals="Find work-life balance"),
    Client(name="Noah Jones", goals="Improve communication skills"),
    Client(name="Isabella Garcia", goals="Develop a growth mindset"),
    Client(name="Ethan Martinez", goals="Manage fear of failure"),
    Client(name="Ava Lee", goals="Navigate relationship issues"),
    Client(name="Lucas Walker", goals="Strengthen resilience"),
    Client(name="Mason Hall", goals="Overcome perfectionism"),
    Client(name="Harper Allen", goals="Explore career options"),
    Client(name="Aiden Young", goals="Manage feelings of inadequacy"),
    Client(name="Lily King", goals="Work on body image"),
    Client(name="Scarlett Wright", goals="Enhance emotional intelligence"),
    Client(name="Henry Scott", goals="Develop better habits"),
    Client(name="Chloe Adams", goals="Increase productivity"),
    Client(name="Benjamin Nelson", goals="Explore personal values"),
    Client(name="Emily Carter", goals="Navigate major life changes"),
    Client(name="Alexander Mitchell", goals="Improve time management"),
    Client(name="Madison Perez", goals="Develop coping strategies for stress"),
    Client(name="Charlotte Rodriguez", goals="Enhance decision-making skills"),
    Client(name="Elijah Johnson", goals="Build effective communication skills"),
    Client(name="Sofia Lee", goals="Improve negotiation skills"),
    Client(name="Amelia Hall", goals="Strengthen leadership abilities"),
    Client(name="Samuel Lewis", goals="Explore creative expression"),
    Client(name="Victoria Martinez", goals="Enhance critical thinking skills"),
    Client(name="Isaac Rodriguez", goals="Develop assertiveness"),
    Client(name="Grace Walker", goals="Increase overall well-being"),
    Client(name="Evelyn Hall", goals="Manage anger and frustration"),
    Client(name="William Young", goals="Explore personal interests"),
    ]
    return clients

import random  # Ensure you have imported the random module

def create_sessions(coaches, clients):
    """Create a list of sessions to be added to the database."""
    sessions = []
    days_to_add = 30  # Total days to add sessions
    time_slots = [f"{hour}:00" for hour in range(9, 17)]  # Time slots from 9 AM to 4 PM

    for day in range(days_to_add):
        session_date = datetime(2024, 11, 1) + timedelta(days=day)  # Start date

        # Skip weekends
        if session_date.weekday() in (5, 6):  # 5 = Saturday, 6 = Sunday
            continue

        for coach in coaches:
            # Randomly select between 3 to 5 unique time slots for this coach
            num_sessions = random.randint(3, 5)
            selected_slots = random.sample(time_slots, num_sessions)

            # For each selected slot, assign a unique client
            for slot in selected_slots:
                hour = int(slot.split(':')[0])  # Get hour from the time slot
                
                # Find a client that is not already booked for this day
                available_clients = [client for client in clients if not any(
                    session.client_id == client.id and session.date.date() == session_date.date()
                    for session in sessions
                )]
                
                if not available_clients:
                    continue  # Skip if no available clients

                client = random.choice(available_clients)  # Select a random client

                session = Session(
                    date=datetime(session_date.year, session_date.month, session_date.day, hour, 0),
                    client_id=client.id,
                    coach_id=coach.id,
                    notes=f"Session with {client.name}",
                    goal_progress=random.randint(1, 10)  # Random goal progress
                )
                sessions.append(session)

    return sessions
    
if __name__ == '__main__':
    with app.app_context():
        try:
            logging.info('Dropping existing tables...')
            drop_tables()

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

            logging.info("Done seeding!")

        except Exception as e:
            logging.error(f"An error occurred: {e}")
            db.session.rollback()
