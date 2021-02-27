document.getElementById('submitInput').addEventListener('click', function(event){
  getResults(event);
});

async function getResults(event){
  event.preventDefault();
  // get form values
  let name = document.getElementById('characterInput').value;

  // check if name is empty
  let url = "";
  let charcterResult;
  if (name === "") {
    let number = Math.floor(Math.random() * Math.floor(80));
    url = "https://www.swapi.tech/api/people/" + number;
    let json = await fetch(url)
      .then(function(response) {
        // make sure the request was successful
        if (response.status != 200) {
          return {
            text: "Error calling the SWAPI service: " + response.statusText
          }
        }
        return response.json();
      });
      characterResult = json.result;
  }
  else {
    url = "https://www.swapi.tech/api/people/?name=" + name;
    let json = await fetch(url)
      .then(function(response) {
        // make sure the request was successful
        if (response.status != 200) {
          return {
            text: "Error calling the SWAPI service: " + response.statusText
          }
        }
        return response.json()
      });

      characterResult = json.result[0];
  }
  if (name == "tim"){
    document.getElementById("result").innerHTML = "<h2>Nobody likes " + name + "</h2>";
  }
  else if  (characterResult == undefined){
    document.getElementById("result").innerHTML = "<h2>There is no result for " + name + "</h2>";
  }
  else {
      // call planet API
      let planetJson = await fetch(characterResult.properties.homeworld)
        .then(function(response) {
          // make sure the request was successful
          if (response.status != 200) {
            return {
              text: "Error calling the SWAPI service: " + response.statusText
            }
          }
          return response.json();
        });

        // call film API
        let filmList = await fetch("https://www.swapi.tech/api/films")
          .then(function(response) {
            // make sure the request was successful
            if (response.status != 200) {
              return {
                text: "Error calling the SWAPI service: " + response.statusText
              }
            }
            return response.json();
          });

          //search movies
          let filmJson = null;
          for (let i = 0; i < filmList.result.length; i++){
            for (let j = 0; j < filmList.result[i].properties.planets.length; j++){
              if (filmList.result[i].properties.planets[j] === characterResult.properties.homeworld){
                filmJson = filmList.result[i];
                break;
              }
            }
            if (filmJson != null) {
              break;
            }
          }
          console.log(filmJson);

      //assignValues
      let results = "";
      results += '<div class = "character"><h2>' + characterResult.properties.name + '</h2>';
      results += '<p><strong>Born: </strong>' + characterResult.properties.birth_year + '</p>';
      results += '<p><strong>Gender: </strong>' + characterResult.properties.gender + '</p>';
      results += '<img src="/images/';

      if (characterResult.properties.gender === "male") {
        results += 'boy.png">';
      }
      else if (characterResult.properties.gender === "female") {
        results += 'girl.png">';
      }
      else {
        results += 'it.png">';
      }
      results += '</div>';
      results += '<div class = "planet"><h2>' + planetJson.result.properties.name + '</h2>';
      results += '<p><strong>Population: </strong>' + planetJson.result.properties.population + '</p>';
      results += '<p><strong>Surface Water: </strong>' + planetJson.result.properties.surface_water + '%</p>';
      results += '<img src="/images/';

      if (parseInt(planetJson.result.properties.surface_water) < 33) {
        results += 'brown.png">';
      }
      else if (parseInt(planetJson.result.properties.surface_water) > 66) {
        results += 'blue.png">';
      }
      else {
        results += 'green.png">';
      }
      results += '</div>';
      results += '<div class = "film">';
      if (filmJson === null){
        results += '<h2>The homeworld of ' + characterResult.properties.name + ' does not appear in any of the films' + '</h2>';
      }
      else {
        results += '<h2>' + planetJson.result.properties.name + ' first appears in ' + filmJson.properties.title + '</h2>';
      }
      results += '</div>';
      document.getElementById("result").innerHTML = results;
    }
}
