let move_1 = document.getElementById("move1_id")
let move_2 = document.getElementById("move2_id")
let move_3 = document.getElementById("move3_id")
let move_4 = document.getElementById("move4_id")

let pokemon = document.getElementById("select-pokemon")
let move1= document.getElementById("move-info-1")
let move2= document.getElementById("move-info-2")
let move3= document.getElementById("move-info-3")
let move4= document.getElementById("move-info-4")

let version_id = document.getElementById("version-id").innerText
let versionName = document.getElementById("version-name").innerText

let pokemonContainer = document.getElementById("pokemon-details")

pokemon.addEventListener("change", e=>{
    let pokemon_id = (pokemon.value.split(" "))[1]
    console.log(pokemon_id)
    getApiInfo("pokemon", pokemon_id).then(result=>{

        move1.innerText = ""
        move2.innerText = ""
        move3.innerText = ""
        move4.innerText = ""
        
        let moves = result["data"]["moves"]

        let name = result["data"]["forms"][0]["name"]
        let types = result["data"]["types"]
        let sprite = result["data"]["sprites"]["front_default"]

        let card = createPokemonCard(name, sprite, types)

        pokemonContainer.innerText = ""
        pokemonContainer.append(card)
        for (let i = 1; i < 5; i++){

            let option_id = `move${i}_id`
            
            let move_option = document.getElementById(option_id)

            move_option.innerText = ""

            create_move_options(move_option, moves)
        }
    })
})

move_1.addEventListener("change", e=>{
    let move_id = move_1.value

    move1.innerText = ""
    getApiInfo("move", move_id).then(result=>{
        info = getMoveInfo(result)

        let moveCardInfo = createMoveInfo(info[0], info[1], info[2], info[3], info[4], info[5], info[6])

        move1.append(moveCardInfo)
    })
})

move_2.addEventListener("change", e=>{
    let move_id = move_2.value

    move2.innerText = ""
    getApiInfo("move", move_id).then(result=>{
        info = getMoveInfo(result)

        let moveCardInfo = createMoveInfo(info[0], info[1], info[2], info[3], info[4], info[5], info[6])

        move2.append(moveCardInfo)
    })
})

move_3.addEventListener("change", e=>{
    let move_id = move_3.value

    move3.innerText = ""
    getApiInfo("move", move_id).then(result=>{
        info = getMoveInfo(result)

        let moveCardInfo = createMoveInfo(info[0], info[1], info[2], info[3], info[4], info[5], info[6])

        move3.append(moveCardInfo)
    })
})

move_4.addEventListener("change", e=>{
    let move_id = move_4.value

    move4.innerText = ""
    getApiInfo("move", move_id).then(result=>{
        info = getMoveInfo(result)

        let moveCardInfo = createMoveInfo(info[0], info[1], info[2], info[3], info[4], info[5], info[6])

        move4.append(moveCardInfo)
    })
})

function onStartUp() {
    let pokemon_id = (pokemon.value.split(" ")[1])
    getApiInfo("pokemon", pokemon_id).then(result=>{
        let name = result["data"]["forms"][0]["name"]
        let types = result["data"]["types"]
        let sprite = result["data"]["sprites"]["front_default"]

        let card = createPokemonCard(name, sprite, types)

        pokemonContainer.append(card)
    })

    let move1_id = move_1.value
    let move2_id = move_2.value
    let move3_id = move_3.value
    let move4_id = move_4.value

    let ids = [move1_id, move2_id, move3_id, move4_id]
    let containers = [move1, move2, move3, move4]
    for (let i = 0; i < ids.length ; i++){
        getApiInfo("move", ids[i]).then(result=>{
            info = getMoveInfo(result)
            
            let moveCardInfo = createMoveInfo(info[0], info[1], info[2], info[3], info[4], info[5], info[6])

            let container = containers[i]

            container.append(moveCardInfo)
        })
    }
}

onStartUp()