from flask_bcrypt import Bcrypt
from flask_sqlalchemy import SQLAlchemy
import requests

bcrypt = Bcrypt()
db = SQLAlchemy()
API_URL = "https://pokeapi.co/api/v2"

def connect_db(app):
    db.app = app
    db.init_app(app)

class User(db.Model):
    """Model for app users"""

    __tablename__ = "users"
    
    id = db.Column(db.Integer, autoincrement=True, primary_key=True)
    username = db.Column(db.Text, nullable=False, unique=True)
    password = db.Column(db.Text, nullable=False)

    @classmethod
    def signup(cls, username, password):
        
        hashed_password = bcrypt.generate_password_hash(password).decode("UTF-8")

        try:
            user = cls(username=username, password=hashed_password)

            db.session.add(user)
            db.session.commit()
            
            return user
        except:
            return None

    @classmethod
    def login(cls,username,password):

        user = User.query.filter(User.username==username).first()

        if user:
            is_auth = bcrypt.check_password_hash(user.password, password)
            if is_auth:
                return user
        return None

class Pokemon(db.Model):
    """Model for 1 pokemon build that includes at most 4 moves"""

    __tablename__ = "pokemons"

    id = db.Column(db.Integer, autoincrement=True, primary_key=True)
    
    pokemon_id = db.Column(db.Integer, nullable=False)

    pokemon_name = db.Column(db.Text, nullable=False)
    
    #data for move 1
    move1_id = db.Column(db.Integer, nullable=False)
    # move1_name = db.Column(db.Text, nullable=False)
    # move1_desc = db.Column(db.Text, nullable=False) #These are not nullable so that the pokemon build has at least 1 move

    #data for move2
    move2_id = db.Column(db.Integer)
    # move2_name = db.Column(db.Text)
    # move2_desc = db.Column(db.Text)

    #data for move3
    move3_id = db.Column(db.Integer)
    # move3_name = db.Column(db.Text)
    # move3_desc = db.Column(db.Text)

    #data for move4
    move4_id = db.Column(db.Integer)
    # move5_name = db.Column(db.Text)
    # move4_desc = db.Column(db.Text)

    def get_all_moves(self):
        moves = [self.move1_id, self.move2_id, self.move3_id, self.move4_id]
        return moves

class Team(db.Model):
    """Model for 1 pokemon team"""

    __tablename__ = "teams"

    id = db.Column(db.Integer, primary_key=True)
    version_id = db.Column(db.Integer, nullable=False)
    user_id = db.Column(db.Integer, db.ForeignKey("users.id"), nullable=False) #each team should have an associated user
    pokemon1 = db.Column(db.Integer, db.ForeignKey("pokemons.id"), nullable=False) #each team should have 1 pokemon
    pokemon2 = db.Column(db.Integer, db.ForeignKey("pokemons.id")) 
    pokemon3 = db.Column(db.Integer, db.ForeignKey("pokemons.id")) 
    pokemon4 = db.Column(db.Integer, db.ForeignKey("pokemons.id")) 
    pokemon5 = db.Column(db.Integer, db.ForeignKey("pokemons.id")) 
    pokemon6 = db.Column(db.Integer, db.ForeignKey("pokemons.id"))

    def get_all_pokemons(self):
        pokemons = []
        if self.pokemon1:
            pokemons.append(Pokemon.query.get(self.pokemon1))
        if self.pokemon2:
            pokemons.append(Pokemon.query.get(self.pokemon2))
        if self.pokemon3:
            pokemons.append(Pokemon.query.get(self.pokemon3))
        if self.pokemon4:
            pokemons.append(Pokemon.query.get(self.pokemon4))
        if self.pokemon5:
            pokemons.append(Pokemon.query.get(self.pokemon5))
        if self.pokemon6:
            pokemons.append(Pokemon.query.get(self.pokemon6))
        
        return pokemons
