/*eslint-env node*/
var express = require('express');
var cfenv = require('cfenv');
var bodyParser = require('body-parser')
var fileUpload = require('express-fileupload')
var request = require('request')
var fs = require('fs')
var app = express();
app.use(express.static(__dirname + '/public'));
app.use(bodyParser.urlencoded({ extended: true }))
app.use(fileUpload())
var appEnv = cfenv.getAppEnv();

app.post('/identify', (request, response) => {
  if (!request.files) {
    response.send('No file was uploaded!')
  } else {
    var image = request.files.image
    var filepath = __dirname + '/images/' + image.name
    image.mv(filepath, (err) => {
      if (err) {
        response.sendStatus(500)
      } else {
        identifyPokemon(filepath)
          .then((pokemon) => getPokemonInfo(pokemon))
          .then((info) => getFlavorText(info.name, 'alpha-sapphire', info))
          .then((info) => response.send(JSON.stringify(info, null, 4)))
          .catch((err) => {
            response.send(err)
          })
      }
    })
  }
})

function identifyPokemon(image) {
  var formData = {
    images_file: fs.createReadStream(image),
    parameters: fs.createReadStream(__dirname + '/vrconfig.json'),
    name: 'pokemon'
  }
  var uri = 'https://gateway-a.watsonplatform.net/visual-recognition/api/v3/classify?api_key=a6db7158a39f41250b12dfff5a46dc734a57b29a&version=2016-05-20'

  return new Promise((resolve, reject) => {
    request.post({ url: uri, formData: formData }, (err, httpResponse, body) => {
      if (err) {
        reject(err)
        return console.error('Upload failed!', err)
      }
      body = JSON.parse(body)
      var classes = body.images[0].classifiers[0].classes
      classes.forEach((vrClass) => {
        console.log(vrClass.class + ': ' + Math.fround(vrClass.score * 100))
      })
      var bestMatch = classes.reduce((prev, current) => prev.score > current.score ? prev : current)
      console.log('Most likely it is a ' + bestMatch.class)
      resolve(bestMatch.class)
    })
  })
}

function getPokemonInfo(pokemon) {
  return new Promise((resolve, reject) => {
    request('http://pokeapi.co/api/v2/pokemon/' + pokemon, (err, httpResponse, body) => {
      if (err) {
        reject(err)
      }
      var data = {}
      var body = JSON.parse(body)

      data.id = body.id
      data.name = body.name
      data.weight = body.weight
      data.height = body.height


      data.abilities = []
      body.abilities.forEach((ability) => {
        data.abilities.push(ability.ability.name)
      })

      data.stats = []
      body.stats.forEach((stat) => {
        var statObj = {}
        statObj[stat.stat.name] = stat.base_stat
        data.stats.push(statObj)
      })

      data.types = []
      body.types.forEach((type) => {
        data.types.push(type.type.name)
      })

      data.sprite = body.sprites.front_default
      resolve(data)
    })
  })
}

function getFlavorText(pokemon, version, dataObj) {
  return new Promise((resolve, reject) => {
    request('http://pokeapi.co/api/v2/pokemon-species/' + pokemon, (err, httpResponse, body) => {
      if (err) {
        reject(err)
      }
      body = JSON.parse(body)
      dataObj.habitat = body.habitat.name

      var flavorTextEntries = body.flavor_text_entries
      var versionFlavors = flavorTextEntries.filter((flavObj) => {
        return flavObj.version.name === version
      })
      var englishFlavor = versionFlavors.filter((flavObj) => {
        return flavObj.language.name === 'en'
      })
      dataObj.flavor = englishFlavor[0].flavor_text
      resolve(dataObj)
    })
  })
}

app.listen(appEnv.port, '0.0.0.0', function () {
  console.log("server starting on " + appEnv.url);
});
