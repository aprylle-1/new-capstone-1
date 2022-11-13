let pokemonList = document.getElementById("pokemon-list")
let card = document.getElementById("card")
let moveList = document.getElementById("move-list")
let moveDefinition = document.getElementById("move-card")
let versionName = document.getElementById("version").innerText

let displayPokemon = document.getElementById("display-pokemon")
let pokemon1_name = document.getElementById("pokemon_1_name")
let pokemon2_name = document.getElementById("pokemon_2_name")
let pokemon3_name = document.getElementById("pokemon_3_name")
let pokemon4_name = document.getElementById("pokemon_4_name")
let pokemon5_name = document.getElementById("pokemon_5_name")
let pokemon6_name = document.getElementById("pokemon_6_name")

let pokemon1 = document.getElementById("pokemon_select_1")
let pokemon2 = document.getElementById("pokemon_select_2")
let pokemon3 = document.getElementById("pokemon_select_3")
let pokemon4 = document.getElementById("pokemon_select_4")
let pokemon5 = document.getElementById("pokemon_select_5")
let pokemon6 = document.getElementById("pokemon_select_6")

let pokemons = [pokemon1, pokemon2, pokemon3, pokemon4, pokemon5, pokemon6]

/*Creates Pokedex Entry --> shows pokemon's sprite, type, and available moves*/
displayPokemon.addEventListener("change", e=>{
    let id = displayPokemon.value
    let spinner = '<div class="spinner-border" role="status"><span class="visually-hidden"></span></div>'
    card.innerHTML = spinner
    getApiInfo("pokemon", id).then(result => {
        card.innerHTML = ""
        let image = result["data"]["sprites"]["front_default"]
        let img = document.createElement("img")
        img.classList.add("pokemon-image")
        img.src= image
        card.append(img)

        let name = result["data"]["forms"][0]["name"]
        let types = result["data"]["types"]
        /*div containing pokemon details*/
        let div = document.createElement("div")
        div.classList.add("card-body")

        let h5 = document.createElement("h5")
        name = name.charAt(0).toUpperCase() + name.slice(1)
        h5.innerText = name
        h5.setAttribute("id", "pokemon-name")
        h5.setAttribute("data-id", id)

        div.append(h5)

        let info = document.createElement("div")
        info.innerText = "Types:"
        for (let type of types) {
            typeContainer = document.createElement("div")
            typeContainer.innerText = type["type"]["name"]
            typeContainer.classList.add(type["type"]["name"])
            typeContainer.classList.add("badge")
            info.append(typeContainer)
        }
        
        card.append(div)
        card.append(info)

        let moves = result["data"]["moves"]

        let movesContainer = document.createElement("div")
        movesContainer.classList.add("vertical-menu-moves")
        movesContainer.setAttribute("id", "move-list")
        
        let ul = document.createElement("ul")
        ul.classList.add("list-group")
        ul.setAttribute("id", "move-list")
        
        for (let move of moves){
            let version_groups = move["version_group_details"]
        
            let versions = []
            
            for (let version_group of version_groups){
                versions.push(version_group["version_group"]["name"])
            }
            /*Makes sure that moves available on the list are the ones available on that specific version*/
            if (versions.includes(versionName)){
                let li = document.createElement("li")
                li.classList.add("list-group-item")
                li.classList.add("move")
                li.innerText = move["move"]["name"]

                let id = move["move"]["url"].replace(`${API_URL}/move`, "").replaceAll("/", "")
                li.setAttribute("data-id", id)
                ul.append(li)
            }
 
        }

        movesContainer.append(ul)
        card.append(movesContainer)
    })
})

/*Event Listener --> Creates Move Information Card - gets triggered when user clicks on a move listed*/
document.addEventListener("click", e => {
    if ([...e.target.classList].includes("move"))
    {

        let move = e.target
        let id = move.dataset.id        
        moveDefinition.innerText = ""
        getApiInfo("move", id).then(result => 
        {
            let info = getMoveInfo(result)

            let name = info[0]

            let power = info[1]

            let pp = info[2]

            let priority = info[3]

            let damageClass = info[4]

            let type = info[5]

            let effect = info[6]

            let move = createMoveInfo(name, power, pp, priority, damageClass, type, effect)

            moveDefinition.append(move)
        })
    }
})

/*Event Listeners for Every Pokemon Dropdown --> will create a list of moves available to the Pokemon everytime value is changed*/
pokemon1.addEventListener("change", e=>{
    let pokemon_id = (pokemon1.value.split(" "))[1]
    getApiInfo("pokemon", pokemon_id).then(result=>{
        let moves = result["data"]["moves"]
    
        for (let i = 1; i < 5; i++){

            let option_id = `pokemon_1_move_${i}`
            
            let move_option = document.getElementById(option_id)

            move_option.innerText = ""

            create_move_options(move_option, moves)
        }
    })
})
pokemon2.addEventListener("change", e=>{
    let pokemon_id = (pokemon2.value.split(" "))[1]
    pokemon2_name = pokemon2.innerText
    getApiInfo("pokemon", pokemon_id).then(result=>{
        let moves = result["data"]["moves"]
        console.log(moves)

        for (let i = 1; i < 5; i++){
            let option_id = `pokemon_2_move_${i}`
            
            let move_option = document.getElementById(option_id)

            move_option.innerText = ""

            create_move_options(move_option, moves)
        }
        // let move_1 = document.getElementById("pokemon_1_move_1")
        // move_1.innerText = ""
    })
})
pokemon3.addEventListener("change", e=>{
    let pokemon_id = (pokemon3.value.split(" "))[1]
    pokemon3_name = pokemon3.innerText
    getApiInfo("pokemon", pokemon_id).then(result=>{
        let moves = result["data"]["moves"]
        console.log(moves)

        for (let i = 1; i < 5; i++){
            let option_id = `pokemon_3_move_${i}`
            
            let move_option = document.getElementById(option_id)

            move_option.innerText = ""

            create_move_options(move_option, moves)
        }
        // let move_1 = document.getElementById("pokemon_1_move_1")
        // move_1.innerText = ""
    })
})
pokemon4.addEventListener("change", e=>{
    let pokemon_id = (pokemon4.value.split(" "))[1]
    pokemon4_name = pokemon4.innerText
    getApiInfo("pokemon", pokemon_id).then(result=>{
        let moves = result["data"]["moves"]
        console.log(moves)

        for (let i = 1; i < 5; i++){
            let option_id = `pokemon_4_move_${i}`
            
            let move_option = document.getElementById(option_id)

            move_option.innerText = ""

            create_move_options(move_option, moves)
        }
        // let move_1 = document.getElementById("pokemon_1_move_1")
        // move_1.innerText = ""
    })
})
pokemon5.addEventListener("change", e=>{
    let pokemon_id = (pokemon5.value.split(" "))[1]
    pokemon5_name = pokemon5.innerText
    getApiInfo("pokemon", pokemon_id).then(result=>{
        let moves = result["data"]["moves"]
        console.log(moves)

        for (let i = 1; i < 5; i++){
            let option_id = `pokemon_5_move_${i}`
            
            let move_option = document.getElementById(option_id)

            move_option.innerText = ""

            create_move_options(move_option, moves)
        }
        // let move_1 = document.getElementById("pokemon_1_move_1")
        // move_1.innerText = ""
    })
})
pokemon6.addEventListener("change", e=>{
    let pokemon_id = (pokemon6.value.split(" "))[1]
    pokemon6_name = pokemon6.innerText
    getApiInfo("pokemon", pokemon_id).then(result=>{
        let moves = result["data"]["moves"]
        console.log(moves)

        for (let i = 1; i < 5; i++){
            let option_id = `pokemon_6_move_${i}`
            
            let move_option = document.getElementById(option_id)

            move_option.innerText = ""

            create_move_options(move_option, moves)
        }
        // let move_1 = document.getElementById("pokemon_1_move_1")
        // move_1.innerText = ""
    })
})