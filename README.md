# Pokemon Team Builder

## API and Tech Stack
This app used the [Pokemon API](https://pokeapi.co/) to get its data. The app will be getting the following data from the API:
- Pokemon Version Names
- Pokemon Data
- Pokemon Moves

The app used the following tech stack:
- Flask (Python)
- Javascript
- PostgresSQL
- HTML
- CSS
- AJAX
## Description
The goal of this app is to provide a way for Pokemon players to pre-create their teams before playing the game.

As an avid fan of Pokemon I often find myself wanting to optimize my gameplay whenever I would replay one the old titles that Pokemon has which inspired me to make this game. 

Players will be able to select the title that they want and from there, build the best team that they can think off.

This was inspired by the specialized way of playing Pokemon called Nuzlockes wherein if a Pokemon loses all its HP, the user will not be able to use that pokemon anymore. I've often watched players do extensive research before attempting to do Nuzlockes and watching them helped me think of this app that I hope would be a good tool for them.

## Database and Schema
A view of the database schema will be found [here](https://dbdiagram.io/d/634511c1f0018a1c5fd80325). Users will not be asked any sensitive data and any passwords stored in the database will be encrypted using Bcrypt.

Users will only be asked the following to signup:
- username
- password

## User Flow
A user will be asked to either sign up or login if they already have an account. They will then be able to either create a team consisting of 6 different Pokemons each or edit any existing Pokemon build that they have.

Each Pokemon is only limited to 4 moves from their designated pool moves. Once a user selects a Pokemon, their move selection will only be limited to the moves available to that Pokemon and the version that they belong to.

## More than CRUD?
This app allows users to filter through all the versions that the main title Pokemon games have. Aside from that, a Pokemon's move pool will always only include those that are available in the version that the user chose.

This app is a working Pokedex. A user can select a Pokemon and will be able to determine a Pokemon's move and any essential information about that move.