let data = [];
let start = 1;
let end = 15 ;
function init() {
  console.log("test");
  fetchData();
  
}

async function fetchData() {
  for (let i = start; i <= end; i++) {
    const response = await fetch(`https://pokeapi.co/api/v2/pokemon/${i}/`);
    const pokemon = await response.json();
    data.push(pokemon);
  }
  start = start + 15;
  end = end + 15;
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
    <div onclick="openCard(${i})" class="card">
     <div class="card-header">
       <span class="padding-12">#${pokemonData["id"]} </span>
       <span> ${pokemonData["name"]}</span>
     </div>
     <div class="display-flex bg-${pokemonData["types"][0]["type"]["name"]}">
       <img class="pokemon-img" src="${pokemonData["sprites"]["other"]["official-artwork"]["front_default"]}" class="card-img-top" alt="${pokemonData["name"]}">
      </div>
       <div id="pokemonTypes${i}" class="card-footer"></div>
    </div>`;
}

function openCard(index) {
  const bigCard = document.getElementById("bigCard");
  bigCard.style.display = "flex";
  const pokemonData = data[index];
  bigCard.innerHTML = "";
  bigCard.innerHTML += `
  <div onclick="doNotClose(event)" id="popCard" class="popup-content">
  </div>`;
  let popup = document.getElementById("popCard");

  popup.innerHTML = `
  <div class="big-card">
     <div class="big-card-header">
       <span class="padding-12">#${pokemonData["id"]} </span>
       <span> ${pokemonData["name"]}</span>
     </div>
     <div class="display-flex bg-${pokemonData["types"][0]["type"]["name"]}">
     <img  src="${pokemonData["sprites"]["other"]["official-artwork"]["front_default"]}" class="card-img-top" alt="${pokemonData["name"]}">
    </div>
       <div id="pokemonTypes${index}" class="card-footer"></div>
  </div>`;

  popup.innerHTML += `
   <div class="display-flex info-buttons">
      <button onclick="rendermain(${index})" type="button" class="btn btn-outline-secondary">main</button>
      <div class="line"></div>
      <button onclick="renderStats(${index})"  type="button" class="btn btn-outline-secondary">stats</button>
      <div class="line"></div>
      <button onclick="renderEvoChain(${index})" type="button" class="btn btn-outline-secondary">evo chain</button>
   </div>
   <div id="mainContainer"></div>
`;

   rendermain(index); 
}

function rendermain(index){
  const pokemonData = data[index];
  let mainContainer = document.getElementById('mainContainer');
  // mainContainer.innerHTML = '';
  mainContainer.innerHTML = `   
  <table class="mainTable">
  <tr>
     <td>Height:</td>
     <td class="mainTable-td">${pokemonData["height"]} m</td>
  </tr>
  <tr>
     <td>Weight:</td>
     <td class="mainTable-td">${pokemonData["weight"]} kg</td>
  </tr>
  <tr>
     <td>Base Experience:</td>
     <td class="mainTable-td">${pokemonData["base_experience"]}</td>
  </tr>
  <tr>
     <td>Abilities:</td>
     <td  id="pokemon-abilities"></td>
  </tr>
</table>
`;
let pokemonAbility = document.getElementById('pokemon-abilities');
  pokemonAbility.innerHTML = '';
  for (let j = 0; j < pokemonData["abilities"].length; j++) {
    const ability = pokemonData["abilities"][j];
    j + 1 == pokemonData["abilities"].length
      ? pokemonAbility.innerHTML += `${ability['ability']['name']}. `
      : pokemonAbility.innerHTML += `${ability['ability']['name']}, `;

  }
}

function renderStats(index) {
  let statsContainer = document.getElementById('mainContainer');
  statsContainer.innerHTML = '<table class="mainTable" id="statTable"></table>';
  for (let i = 0; i < data[index]['stats'].length; i++) {
    let stat = data[index]['stats'][i];

    document.getElementById('statTable').innerHTML += `
      <tr>
        <td>${stat['stat']['name']}: </td>
        <td class="td-progress">
          <div class="progress" role="progressbar" aria-label="${stat['stat']['name']}" aria-valuenow="${stat['base_stat']}" aria-valuemin="0" aria-valuemax="100">
            <div class="progress-bar" style="width: ${stat['base_stat']}%">${stat['base_stat']}</div>
          </div>
        </td>
      </tr>
    `;
  }
}


async function fetchEvolutionChain(pokemonId) {
  const speciesResponse = await fetch(`https://pokeapi.co/api/v2/pokemon-species/${pokemonId}/`);
  const speciesData = await speciesResponse.json();
  const evolutionChainUrl = speciesData.evolution_chain.url;
  const evolutionChainResponse = await fetch(evolutionChainUrl);
  const evolutionChainData = await evolutionChainResponse.json();
  return evolutionChainData.chain;
}

function extractEvolutionChain(chain) {
  const evolutionChain = [];
  let current = chain;
  while (current) {
    evolutionChain.push(current.species.name);
    current = current.evolves_to.length ? current.evolves_to[0] : null;
  }
  return evolutionChain;
}

async function renderEvoChain(index) {
  const pokemonData = data[index];
  const evolutionChain = await fetchEvolutionChain(pokemonData.id);
  const evoChainList = extractEvolutionChain(evolutionChain);
  let evoChainContainer = document.getElementById('mainContainer');
  evoChainContainer.innerHTML = `<div class="evo-chain"></div>`;
  let evoChainDiv = evoChainContainer.querySelector('.evo-chain');
  
  for (const evoName of evoChainList) {
    const evoPokemonResponse = await fetch(`https://pokeapi.co/api/v2/pokemon/${evoName}`);
    const evoPokemonData = await evoPokemonResponse.json();
    evoChainDiv.innerHTML += `
      <div class="evo-pokemon">
        <img src="${evoPokemonData.sprites.other['official-artwork'].front_default}" alt="${evoPokemonData.name}">
        <span>${evoPokemonData.name}</span>
      </div>`;
  }
}

// function renderEvoChain(index){
//   let evoChainContainer = document.getElementById('mainContainer');

//   evoChainContainer.innerHTML = `
//       <div>
//       <img src="${data[index]["sprites"]["other"]["showdown"]["front_default"]}">
//       <img src="${data[index + 1]["sprites"]["other"]["showdown"]["front_default"]}">
//       <img src="${data[index + 2]["sprites"]["other"]["showdown"]["front_default"]}">
//       </div>`;
//   // for (let i = 0; i < 3; i++) {
//   //   const evoChain = data[index];
    
//   // }
// }


function closePopup() {
  const bigCard = document.getElementById("bigCard");
  bigCard.style.display = "none";
}

function doNotClose(event) {
  event.stopPropagation();
}

function loadMorePokemon(){
  fetchData();
}
