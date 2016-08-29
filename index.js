'use strict';

var audios = new Map()
var currentSound

phrases().then(function(data) {
  console.info('Loaded phrase data...')

  return data.phrases.map(function(data) {
    var phrase = document.createElement('div')
    phrase.classList.add('phrase')
    phrase.classList.add('loading')

    var text = document.createElement('div')
    text.classList.add('phrase-text')
    text.innerText = data.phrase

    phrase.appendChild(text)
    phrase.addEventListener('mousedown', playAudio.bind(null, data))

    var elems = data.sounds.map(function(name){
      var audio = new Audio('sounds/' + name)
      audio.addEventListener('canplaythrough', function() { 
        console.info(`Ready to play ${data.phrase}...`)
        phrase.classList.remove('loading')
      }, false)
      return audio
    })
    audios.set(data.phrase, elems)

    console.info(`Loading ${data.phrase}...`)

   

    return phrase
  })
}).then(appendAllToBody).then(hideLoader).catch(function(error) {
  alert('Something broke while setting up. Try reloading the page?')
  console.error(error)
  debugger
})

function playAudio(data) {
  if (currentSound) {
    currentSound.pause()
    currentSound.currentTime = 0
  }
  debugger
  currentSound = randomElement(audios.get(data.phrase))
  if (currentSound.error) {
    alert(`Failed to play ${data.phrase}. Try another one?`)
    console.error(`Could not play ${data.phrase}:\n${error.toString()}`)
  }
  currentSound.play()
  console.info(`Playing ${data.phrase}...`)
}

function hideLoader(){
  console.info('Hiding loading notif...')
  document.getElementsByClassName('loader')[0].style.display = 'none'
}

function randomElement(arr){
  debugger
  return arr[Math.floor(arr.length * Math.random())];
}

function appendAllToBody(elems) {
  console.info(`Adding ${elems.length} phrases to the DOM...`)
  elems.forEach(function(e) { document.body.appendChild(e)})
}

function phrases() {
  return fetch('phrases.json')
    .then(function(response) {
      return response.json()
    }).then(function(json) {
      console.log('parsed json', json)
      return json
    }).catch(function(ex) {
      console.log('JSON failed', ex)
      throw ex
    })
  // return new Promise(function (resolve, reject) {
  //  // var request = new XMLHttpRequest()
  //  // ajaxRequest.onreadystatechange
  //  resolve({
  //    "phrases": [
  //      {
  //        "phrase": "\"DUDE\"",
  //        "sound": "Funk.aiff"
  //      },
  //      {
  //        "phrase": "\"BOIIIII\"",
  //        "sound": "grenade.wav"
  //      },
  //      {
  //        "phrase": "\"BOI\"",
  //        "sound": "boi.mp3"
  //      },
  //      {
  //        "phrase": "\"BOI HE BOUTA DO IT\"",
  //        "sound": "boi_he_bouta_doit.mp3"
  //      },
  //      {
  //        "phrase": "\"HE DID IT\"",
  //        "sound": "he_did_it.mp3"
  //      },
  //      {
  //        "phrase": "CANDY STORE (CLEAN)",
  //        "sound": "candy_store_clean.mp3"
  //      },
  //    ]
  //  })
  // })
}