/* contains functions that are repeatedly used */

const API_URL = "https://pokeapi.co/api/v2"

function createMoveInfo(name, power, pp, priority, damage_class, type, effect)
{
    /*Name*/
    let move = document.createElement("table")
    move.classList.add("table")
    move.classList.add("table-striped")
    move.classList.add("table-bordered")

    let nameContainer = document.createElement("th")
    nameContainer.innerText = name
    move.append(nameContainer)

    /*Effect*/

    let effectContainer = document.createElement("tr")
    
    let effectLabel = document.createElement("td")
    effectLabel.innerText = "Effect"
    effectContainer.append(effectLabel)
    
    let effectValueContainer = document.createElement("td")
    effectValueContainer.innerText = effect
    effectContainer.append(effectValueContainer)

    move.append(effectContainer)
    /*Type*/
    let typeContainer = document.createElement("tr")
    
    let label = document.createElement("td")
    label.innerText = "Type"
    typeContainer.append(label)

    let typeValueContainer = document.createElement("td")
    let typeValue = document.createElement("div")
    typeValue.innerText = type
    typeValue.classList.add("badge")
    typeValue.classList.add(type)
    typeValueContainer.append(typeValue)
    typeContainer.append(typeValueContainer)

    move.append(typeContainer)

    /*Damage Class*/
    let damageClassContainer = document.createElement("tr")
    let damageClassLabel = document.createElement("td")
    damageClassLabel.innerText = "Damage"
    damageClassContainer.append(damageClassLabel)

    let damageClass = document.createElement("td")
    damageClass.innerText = damage_class
    damageClassContainer.append(damageClass)
    move.append(damageClassContainer)

    /*Power*/
    let powerContainer = document.createElement("tr")
    let powerClassLabel = document.createElement("td")
    powerClassLabel.innerText = "Power"
    powerContainer.append(powerClassLabel)
    
    let powerValueContainer = document.createElement("td")
    powerValueContainer.innerText = power
    powerContainer.append(powerValueContainer)
    move.append(powerContainer)

    /*Power Points*/
    let ppContainer = document.createElement("tr")
    let ppLabelContainer = document.createElement("td")
    ppLabelContainer.classList.add("small")
    ppLabelContainer.innerText = "Power Points (PP)"
    ppContainer.append(ppLabelContainer)

    let ppValueContainer = document.createElement("td")
    ppValueContainer.innerText = pp
    ppContainer.append(ppValueContainer)
    move.append(ppContainer)

    /*Priority*/
    let priorityContainer = document.createElement("tr")
    let priorityLabelContainer = document.createElement("td")
    priorityLabelContainer.innerText = "Priority"
    priorityContainer.append(priorityLabelContainer)

    let priorityValueContainer = document.createElement("td")
    priorityValueContainer.innerText = priority
    priorityContainer.append(priorityValueContainer)

    move.append(priorityContainer)

    return move
}

function getMoveInfo(result){
    let moveInfo = result["data"]

    let name = moveInfo["name"]

    let power = moveInfo["power"]

    let pp = moveInfo["pp"]

    let priority = moveInfo["priority"]

    let damageClass = moveInfo["damage_class"]["name"]

    let type = moveInfo["type"]["name"]

    let effect_entries = moveInfo["effect_entries"]

    let effect_entry_final = ""

    for (let effect_entry of effect_entries){
        if (effect_entry["language"]["name"] == "en"){
            effect_entry_final = effect_entry["short_effect"]
        }
    }

    return [name, power, pp, priority, damageClass, type, effect_entry_final]
}
function create_move_options (element, moves) {

    //creating default option everytime a pokemon is chosen
    let default_option = document.createElement("option")
    default_option.innerText = "Select Move"
    default_option.setAttribute("selected", "selected")
    default_option.setAttribute("disabled", "disabled")
    default_option.setAttribute("hidden", "hidden")
    default_option.value = ""
    
    element.append(default_option)
    
    for (let move of moves){
        let version_groups = move["version_group_details"]
        
        let versions = []
        
        for (let version_group of version_groups){
            versions.push(version_group["version_group"]["name"])
        }
        console.log(versions.includes(versionName))
        console.log(move["move"]["name"])
        if (versions.includes(versionName)){
            let select_move = document.createElement("option")
            select_move.value = (move["move"]["url"]).replace(`${API_URL}/move`, "").replaceAll("/", "")
            select_move.innerText = move["move"]["name"]
            element.append(select_move)
        }
    }
}

const getApiInfo = async function(route, id) {
    const result = await axios.get(`${API_URL}/${route}/${id}`)
    const new_result = await result
    return new_result
}

function createPokemonCard (name, sprite, types){
    let card = document.createElement("div")

    card.classList.add("card")
    
    let infoContainer = document.createElement("div")

    let nameContainer = document.createElement("div")
    nameContainer.classList.add("card-header")
    nameContainer.innerText = name
    infoContainer.append(nameContainer)
    
    for (let type of types){
        
        let typeContainer = document.createElement("span")
        typeContainer.classList.add("badge")
        typeContainer.classList.add(type["type"]["name"])

        typeContainer.innerText = type["type"]["name"]

        infoContainer.append(typeContainer)
    }

    card.append(infoContainer)

    let imageContainer = document.createElement("div")
    imageContainer.classList.add("pokemon-image")

    let img = document.createElement("img")
    img.src = sprite
    img.classList.add("pokemon-image")

    imageContainer.append(img)

    card.append(imageContainer)

    return card
}

function createMoveContainerForDisplay (moves){
    let moveContainer = document.createElement("div")
        
    let cardHeader = document.createElement("div")
    cardHeader.classList.add("card-header")
    cardHeader.innerText = "Moves"

    let moveListContainer = document.createElement("ul")
    moveListContainer.classList.add("list-group")
    moveListContainer.classList.add("list-group-flush")

    for (let move of moves){
        let li = document.createElement("li")

        getApiInfo("move", move).then(result=>{
            li.innerText = result["data"]["name"]
            li.classList.add("list-group-item")
            moveListContainer.append(li)
        })
    }
    
    moveContainer.append(cardHeader)
    moveContainer.append(moveListContainer)

    return moveContainer
}