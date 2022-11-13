let pokemons = Array.prototype.slice.call(document.querySelectorAll(".pokemon"))

let pokemon_ids = []

let teamContainer = document.getElementById("team-container")

let moveLists = Array.prototype.slice.call(document.querySelectorAll(".moves"))

let teamId = document.getElementById("team-id")

for (let i = 0; i < 6; i++){
    let pokemon = pokemons[i]

    let id = pokemon.dataset.id
    let pokemon_id = pokemon.dataset.pokemon_id

    getApiInfo("pokemon", id).then(result=>{

        let name = result["data"]["name"]
        let sprite = result["data"]["sprites"]["front_default"]
        let types = result["data"]["types"]

        let moves = []

        for (let li of moveLists[i].children){
            let id = li.dataset.id
            moves.push(id)
        }

        let card = createPokemonCard(name, sprite, types)
        teamContainer.append(card)

        let moveContainer = createMoveContainerForDisplay(moves)
        
        card.append(moveContainer)

        let a = document.createElement("a")
        a.innerText = "Edit"
        a.setAttribute("href", `/pokemon/edit/${teamId.innerText}/${pokemon_id}`)
        a.classList.add("btn")
        a.classList.add("btn-primary")
        card.append(a)
    })
}