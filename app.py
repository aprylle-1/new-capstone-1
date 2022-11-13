from crypt import methods
from curses import flash
from ensurepip import version
from sys import flags
from flask import Flask, jsonify, request, render_template, session, redirect, flash
from flask_debugtoolbar import DebugToolbarExtension
from forms import UserForm
from models import User, connect_db, db, Pokemon, Team
from flask_bcrypt import Bcrypt

import requests


app = Flask(__name__)
API_URL = "https://pokeapi.co/api/v2"

app.config["SQLALCHEMY_DATABASE_URI"] = "postgresql:///pokemon_teams"
app.config["SECRET_KEY"] = "nasdjfjksdhfjksdjkflsd"
app.config["SQLALCHEMY_TRACK_MODIFICATIONS"] = False
#Flow user is directed to a page where they can choose a pokemon version
#That in turn will give them a list of pokemon using the pokedex

connect_db(app)
bcrypt = Bcrypt()
@app.route("/signup", methods=["GET", "POST"])
def signup():

    if session.get("CURR_USER"):
        return redirect("/")

    form = UserForm()

    if form.validate_on_submit():

        username = form.username.data
        password = form.password.data

        user = User.signup(username=username, password=password)

        if user:
            session["CURR_USER"] = user.id
            return redirect("/")
        else:
            flash("Ooops, something went wrong", "danger")
            return redirect ("/signup")

    return render_template ("users/signup.html", form=form)


@app.route("/login", methods=["POST", "GET"])
def login():
    
    if (session.get("CURR_USER")):
        return redirect("/")

    form = UserForm()

    if form.validate_on_submit():
        
        username = form.username.data
        password = form.password.data

        user = User.login(username=username, password=password)

        if(user):
            session["CURR_USER"] = user.id    
            flash(f"Welcome back {user.username}!", "success")       
            return redirect("/teams")
        
        else:
            flash("Incorrect username or password", "danger")
            return redirect("/login")
    
    return render_template("users/login.html", form=form)

@app.route("/logout")
def logout():
    session.pop("CURR_USER")
    return redirect("/login")

@app.route("/")
def show_all_pokemon_version():

    if session.get("CURR_USER"):
        resp = (requests.get(f"{API_URL}/version-group/")).json()
        version_groups = resp["results"]

        version_groups = [(version_group["name"], version_group["url"].replace(f"{API_URL}/version-group", "").replace("/", "")) 
        for version_group in version_groups if version_group["name"] not in ("colosseum", "xd")] #only include main games for now

        return render_template("homepage.html", version_groups=version_groups)
    else:
        flash("Need to login to access this page", "info")
        return redirect("/login")

@app.route("/pokemons")
def show_all_pokemon_per_version():

    if session.get("CURR_USER"):
        version_id = int(request.args["version_group"])

        version_info= (requests.get(f"{API_URL}/version-group/{version_id}")).json() #get information from api based on version group
        pokedex_url = version_info["pokedexes"][0]["url"] #get pokedex of version group
        version_name = version_info["name"]
        try:
            version_name_formatted = version_name.split("-")
            if (version_name in ["black-2-white-2", "omega-ruby-alpha-sapphire", "ultra-sun-ultra-moon", "lets-go-pikachu-lets-go-eevee"]):
                version_name_formatted = f"{version_name_formatted[0].capitalize()} {version_name_formatted[1].capitalize()}/{version_name_formatted[2].capitalize()} {version_name_formatted[3].capitalize()}"
            else:
                version_name_formatted = f"{version_name_formatted[0].capitalize()}/{version_name_formatted[1].capitalize()}"
        except:
            version_name_formatted = version_name.capitalize()
        pokemons = [(pokemon["pokemon_species"]["name"], pokemon["pokemon_species"]["url"].replace(f"{API_URL}/pokemon-species", "").replace("/", "")) for pokemon in requests.get(pokedex_url).json()["pokemon_entries"]] #create a list of tuples that contains the pokemon name and id

        return render_template("pokemons.html", pokemons=pokemons, version=(version_name, version_id, version_name_formatted))
    else:
        flash("Need to login to access this page", "info")
        return redirect("/login")

@app.route("/pokemon/edit/<team_id>/<pokemon_id>", methods=["GET"])
def get_edit_pokemon_form(team_id, pokemon_id):
    
    if session.get("CURR_USER"):
        pokemon = Pokemon.query.get(pokemon_id)
        team = Team.query.get(team_id)
        version_id = team.version_id
        version_info = (requests.get(f"{API_URL}/version-group/{version_id}")).json()
        version_name = version_info["name"]
        moves = pokemon.get_all_moves()

        move_names = []

        pokedex_url = version_info["pokedexes"][0]["url"]
        pokemons = [(pokemon["pokemon_species"]["name"], pokemon["pokemon_species"]["url"].replace(f"{API_URL}/pokemon-species", "").replace("/", "")) for pokemon in requests.get(pokedex_url).json()["pokemon_entries"]]

        moves_available = (requests.get(f"{API_URL}/pokemon/{pokemon.pokemon_id}")).json()["moves"]

        final_moves = []

        final_moves2 = {}
        for move_details in moves_available:
            versions = [version["version_group"]["name"] for version in move_details["version_group_details"]]
 
            if version_name in versions:
                move_id = int(move_details["move"]["url"].replace(f"{API_URL}/move", "").replace("/", ""))
                final_move = (move_details["move"]["name"], move_id)
                final_moves.append(final_move)
                final_moves2[move_id] = move_details["move"]["name"]

        for move in moves:
            move_names.append(final_moves2[move])
        return render_template("pokemon.html", team_id=team_id, pokemon=pokemon, moves=moves, move_names=move_names, version=(version_id, version_name), pokemons=pokemons, final_moves=final_moves)

    else:
        flash("Need to login to access this page", "info")
        return redirect("/login")

@app.route("/pokemon/edit/<team_id>/<pokemon_id>", methods=["POST"])
def edit_pokemon(team_id, pokemon_id):
    
    if session.get("CURR_USER"):    
        id = request.form.get("pokemon_id")

        pokemon = Pokemon.query.get(id)

        pokemon_name, pokemon_id = request.form.get("pokemon").split()
        move1_id= request.form.get("move1_id")
        move2_id= request.form.get("move2_id")
        move3_id = request.form.get("move3_id")
        move4_id = request.form.get("move4_id")

        pokemon.pokemon_id = pokemon_id
        pokemon.pokemon_name = pokemon_name
        pokemon.move1_id = move1_id
        pokemon.move2_id = move2_id
        pokemon.move3_id = move3_id
        pokemon.move4_id = move4_id

        db.session.commit()
    
        return redirect(f"/teams/{team_id}")

    else:
        flash("Need to login to access this page", "info")
        return redirect("/login")

@app.route("/teams")
def show_all_teams():

    if session.get("CURR_USER"):
        user_id = session["CURR_USER"] 
        teams = Team.query.filter(Team.user_id == user_id).all()
        info = []
        for team in teams:
            pokemons = team.get_all_pokemons()
            info.append((team,pokemons))
        return render_template("users/teams.html", info=info)
    else:
        flash("Need to login to access this page", "info")
        return redirect("/login")

@app.route("/teams/<team_id>")
def show_team_details(team_id):

    if session.get("CURR_USER"):
        team = Team.query.get(team_id)
        pokemons = team.get_all_pokemons()
        pokemons_info = []
        for pokemon in pokemons:
            moves = pokemon.get_all_moves()
            pokemons_info.append((pokemon, moves))
        return render_template("users/team.html", pokemons_info=pokemons_info, team_id=team_id)
    
    else:
        flash("Need to login to access this page", "info")
        return redirect("/login")

@app.route("/teams/create", methods=["POST", "GET"])
def create_team():

    if session.get("CURR_USER"):

        version_id = request.form.get("pokemon_version")
        user_id = session["CURR_USER"]
        pokemons = []
    
        for i in range(1,7):
            #gets pokemons 1-6
            pokemon = request.form.get(f"pokemon_{i}")
            pokemon_name, pokemon_id = pokemon.split()
            moves = []
            for j in range(1,5):
                move = request.form.get(f"pokemon_{i}_move_{j}")
                moves.append(move)
            pokemon_build = Pokemon(pokemon_id=int(pokemon_id),pokemon_name=pokemon_name, move1_id=int(moves[0]), move2_id=int(moves[1]),move3_id=int(moves[2]), move4_id=int(moves[3]))
            pokemons.append(pokemon_build)
    
    else:
        flash("Need to login to access this page", "info")
        return redirect("/login")

    db.session.add_all(pokemons)
    db.session.commit()
    team = Team(user_id=user_id, version_id=int(version_id), pokemon1=pokemons[0].id, pokemon2=pokemons[1].id, pokemon3 = pokemons[2].id, pokemon4 = pokemons[3].id, pokemon5=pokemons[4].id, pokemon6=pokemons[5].id)

    db.session.add(team)
    db.session.commit()

    return redirect("/teams")

@app.route("/teams/delete/<team_id>", methods=["POST"])
def delete_team(team_id):

    if session.get("CURR_USER"):
        team = Team.query.get(team_id)
        pokemons = team.get_all_pokemons()

        db.session.delete(team)
        db.session.commit()

        for pokemon in pokemons:
            db.session.delete(pokemon)
            db.session.commit()
        flash("You have successfully deleted your team", "danger")

        return redirect("/teams")
    
    else:
        flash("Need to login to access this page", "info")
        return redirect("/login")

