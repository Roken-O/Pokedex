const Base_URL = "https://pokeapi.co/api/v2/pokemon";

let data = [];

function init() {
  console.log("test");
  fetchData();
}

async function fetchPokeBall() {
  const response = await fetch(POKE_BALL_URL);
  const pokeBallData = await response.json();
  pokeBallImage = pokeBallData.sprites.default;
  document.getElementById(
    "pokeBall"
  ).innerHTML += `<img src="${pokeBallData}">`;
}

async function fetchData() {
  for (let i = 1; i <= 12; i++) {
    const response = await fetch(`https://pokeapi.co/api/v2/pokemon/${i}/`);
    const pokemon = await response.json();
    data.push(pokemon);
  }
  renderPokemonData();
}

function renderPokemonData() {
  let content = document.getElementById("content");
  content.innerHTML = "";
  for (let i = 0; i < data.length; i++) {
    const pokemonData = data[i];

    content.innerHTML += renderCards(i, pokemonData);
    let type = document.getElementById(`pokemonTypes${i}`);
    for (let j = 0; j < pokemonData["types"].length; j++) {
      let pokemonType = pokemonData["types"][j];
      type.innerHTML += `
            <span class="bg-${pokemonType["type"]["name"]}">${pokemonType["type"]["name"]}</span>`;
    }
  }
}

function renderCards(i, pokemonData) {
  return `
    <div onclick="openCard(${i})" class="card" id="card${i}">
     <div class="card-header">
       <span class="padding-12">#${pokemonData["id"]} </span>
       <span> ${pokemonData["name"]}</span>
     </div>
       <img class="bg-${pokemonData["types"][0]["type"]["name"]}" src="${pokemonData["sprites"]["other"]["official-artwork"]["front_default"]}" class="card-img-top" alt="${pokemonData["name"]}">
       <div id="pokemonTypes${i}" class="card-footer"></div>
       <div id="pokemon-info"></div>
    </div>`;
}

function openCard(index) {
  const bigCard = document.getElementById("bigCard");
  bigCard.style.display = "flex";
  const pokemonData = data[index];
  bigCard.innerHTML = "";
  bigCard.innerHTML += `
  <div onclick="doNotClose(event)" id="popCard" class="popup-content"></div>`;
  let popup = document.getElementById("popCard");
  popup.innerHTML = renderCards(index, pokemonData);
  let card = document.getElementById(`card${index}`);
  card.style.margin = "0";
  card.style.width = "350px";
  
  let pokemonInfo = document.getElementById('pokemon-info');
  pokemonInfo.innerHTML = `
  <ul class="nav nav-tabs">
  <li class="nav-item">
    <a class="nav-link active" aria-current="page" href="#">main</a>
  </li>
  <li class="nav-item">
    <a class="nav-link" href="#">stats</a>
  </li>
  <li class="nav-item">
    <a class="nav-link" href="#">evo chain</a>
  </li>
</ul>

<div>
   <table>
      <tr>
         <td>Height:</td>
         <td>${pokemonData["height"]}</td>
      </tr>
      <tr>
         <td>Weight:</td>
         <td>${pokemonData["weight"]}</td>
      </tr>
      <tr>
         <td>Base Experience:</td>
         <td>${pokemonData["base_experience"]}</td>
      </tr>
      <tr>
         <td>Abilities:</td>
         <td id="pokemon-abilities"></td>
      </tr>
</table>
</div>`;
let pokemonAbility = document.getElementById('pokemon-abilities');
pokemonAbility.innerHTML='';
for (let j = 0; j < pokemonData["abilities"].length; j++) {
  const ability = pokemonData["abilities"][j];
  j+1 == pokemonData["abilities"].length
  ? pokemonAbility.innerHTML +=`${ability['ability']['name']}. `
  :  pokemonAbility.innerHTML +=`${ability['ability']['name']}, `;
  
}
}

function closePopup() {
  const bigCard = document.getElementById("bigCard");
  bigCard.style.display = "none";
}

function doNotClose(event){
  event.stopPropagation();
}
