var pokemonList = ["Bulbasaur", "Ivysaur", "Venusaur", "Charmander", "Charmeleon", "Charizard",
  "Squirtle", "Wartortle", "Blastoise", "Caterpie", "Metapod", "Butterfree", "Weedle", "Kakuna",
  "Beedrill", "Pidgey", "Pidgeotto", "Pidgeot", "Rattata", "Raticate", "Spearow", "Fearow", "Ekans",
  "Arbok", "Pikachu", "Raichu", "Sandshrew", "Sandslash", "Nidoran-f", "Nidorina", "Nidoqueen", "Nidoran-m",
  "Nidorino", "Nidoking", "Clefairy", "Clefable", "Vulpix", "Ninetales", "Jigglypuff", "Wigglytuff",
  "Zubat", "Golbat", "Oddish", "Gloom", "Vileplume", "Paras", "Parasect", "Venonat", "Venomoth", "Diglett",
  "Dugtrio", "Meowth", "Persian", "Psyduck", "Golduck", "Mankey", "Primeape", "Growlithe", "Arcanine",
  "Poliwag", "Poliwhirl", "Poliwrath", "Abra", "Kadabra", "Alakazam", "Machop", "Machoke", "Machamp",
  "Bellsprout", "Weepinbell", "Victreebel", "Tentacool", "Tentacruel", "Geodude", "Graveler", "Golem",
  "Ponyta", "Rapidash", "Slowpoke", "Slowbro", "Magnemite", "Magneton", "Farfetch'd", "Doduo", "Dodrio",
  "Seel", "Dewgong", "Grimer", "Muk", "Shellder", "Cloyster", "Gastly", "Haunter", "Gengar", "Onix", "Drowzee",
  "Hypno", "Krabby", "Kingler", "Voltorb", "Electrode", "Exeggcute", "Exeggutor", "Cubone", "Marowak", "Hitmonlee",
  "Hitmonchan", "Lickitung", "Koffing", "Weezing", "Rhyhorn", "Rhydon", "Chansey", "Tangela", "Kangaskhan", "Horsea"
  , "Seadra", "Goldeen", "Seaking", "Staryu", "Starmie", "Mr.Mime", "Scyther", "Jynx", "Electabuzz", "Magmar",
  "Pinsir", "Tauros", "Magikarp", "Gyarados", "Lapras", "Ditto", "Eevee", "Vaporeon", "Jolteon", "Flareon", "Porygon",
  "Omanyte", "Omastar", "Kabuto", "Kabutops", "Aerodactyl", "Snorlax", "Articuno", "Zapdos", "Moltres", "Dratini",
  "Dragonair", "Dragonite", "Mewtwo", "Mew"];

document.addEventListener("DOMContentLoaded", function (event) {
  document.getElementById('nb').value = '';
  document.getElementById("info-screen").innerHTML = '';
  document.getElementById('screen').getElementsByTagName('img')[0].src = "";


  var form = document.forms.namedItem('fileinfo')
  var inputField = document.querySelector('#upload')
  inputField.addEventListener('change', function (ev) {
    console.log('Changed!')
    var data = new FormData(form)
    var req = new XMLHttpRequest()
    req.open('POST', 'identify', true)
    document.getElementById('screen').getElementsByTagName('img')[0].src = "img/pokedex/ripple.gif";
    req.onreadystatechange = function (ev) {
      if (this.status == 200 && this.readyState == 4) {
        var response = this.responseText
        console.log(response)
        response = JSON.parse(response)
        updateIdPokemon(response.id)
        setInfo(response)
      } else {
        console.log('Error ' + this.status)
      }
    }
    req.send(data)
  }, false)

});

function setInfo(data) {
  var toDisplay = '<div id="info-text">'

  toDisplay += pokemonList[idPokemon]
  toDisplay += '<br><br>Types:<br>'
  data.types.forEach((type) => {
    toDisplay += removeHyphens(type) + '<br>'
  })
  toDisplay += '<br>Abilities:<br>'
  data.abilities.forEach((ability) => {
    toDisplay += removeHyphens(ability) + '<br>'
  })
  toDisplay += '<br>' + data.flavor + '<br>'

  toDisplay += '<br> Stats:' + '<br>'
  data.stats.forEach((obj) => {
    for (key in obj) {
      toDisplay += removeHyphens(key) + ':' + obj[key] + '<br>'
    }
  })

  toDisplay += '</div>'
  toDisplay = toDisplay.toUpperCase()
  document.getElementById('info-screen').innerHTML = toDisplay
}

function removeHyphens(str) {
  return str.replace('-', ' ')
}

function getElemIdPokemon() {
  if (idPokemon < (pokemonList.length)) {
    document.getElementById('nb').value = idPokemon + 1;
  } else {
    document.getElementById('nb').value = idPokemon;
  }
}

var idPokemon = 0;

function updateIdPokemon(val) {
  if (val <= pokemonList.length) {
    idPokemon = parseInt(val) - 1
    getElemIdPokemon()
    document.getElementById("info-screen").innerHTML = pokemonList[idPokemon];
    document.getElementById('screen').getElementsByTagName('img')[0].src = "img/pokedex/pokemon/" + pokemonList[idPokemon] + ".jpg";
  } else {
    document.getElementById("info-screen").innerHTML = "THIS POKEMON DOESN'T EXIST";
    document.getElementById('screen').getElementsByTagName('img')[0].src = "img/pokedex/pokemon/Pokemon-disappointed.jpg";
  }
}

function changePicturePokemon() {
  if (idPokemon == 24) {
    document.getElementById('screen').getElementsByTagName('img')[0].src = "img/pokedex/pokemon/Pikachu-drug.gif";
  }
}
