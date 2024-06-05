let data = [];
let start = 1;
let end = 15;

function init() {
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
    rendertypes(i, pokemonData);
  }
}

function rendertypes(i, pokemonData) {
  let type = document.getElementById(`pokemonTypes${i}`);
  for (let j = 0; j < pokemonData["types"].length; j++) {
    let pokemonType = pokemonData["types"][j];
    type.innerHTML += `
          <span class="bg-${pokemonType["type"]["name"]}">${pokemonType["type"]["name"]}</span>`;
  }
}

function openCard(index) {
  const bigCard = document.getElementById("bigCard");
  bigCard.style.display = "flex";
  const pokemonData = data[index];
  bigCard.innerHTML = "";
  bigCard.innerHTML += `<div onclick="doNotClose(event)" id="popCard" class="popup-content"></div>`;
  let popup = document.getElementById("popCard");
  popup.innerHTML = renderPopup(index, pokemonData);
  rendertypes(index, pokemonData);
  popup.innerHTML += renderTypesHTML(index);
  rendermain(index);
}

function rendermain(index) {
  const pokemonData = data[index];
  let mainContainer = document.getElementById("mainContainer");
  // mainContainer.innerHTML = '';
  mainContainer.innerHTML = renderMainHTML(pokemonData);
  let pokemonAbility = document.getElementById("pokemon-abilities");
  pokemonAbility.innerHTML = "";
  for (let j = 0; j < pokemonData["abilities"].length; j++) {
    const ability = pokemonData["abilities"][j];
    j + 1 == pokemonData["abilities"].length
      ? (pokemonAbility.innerHTML += `${ability["ability"]["name"]}. `)
      : (pokemonAbility.innerHTML += `${ability["ability"]["name"]}, `);
  }
}

function renderStats(index) {
  let statsContainer = document.getElementById("mainContainer");
  statsContainer.innerHTML = '<table class="mainTable" id="statTable"></table>';
  for (let i = 0; i < data[index]["stats"].length; i++) {
    let stat = data[index]["stats"][i];

    document.getElementById("statTable").innerHTML += renderStatsHTML(stat);
  }
}

async function fetchEvolutionChain(pokemonId) {
  const speciesResponse = await fetch(
    `https://pokeapi.co/api/v2/pokemon-species/${pokemonId}/`
  );
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
  let evoChainContainer = document.getElementById("mainContainer");
  evoChainContainer.innerHTML = `<div class="evo-chain"></div>`;
  let evoChainDiv = evoChainContainer.querySelector(".evo-chain");

  for (const evoName of evoChainList) {
    const evoPokemonResponse = await fetch(`https://pokeapi.co/api/v2/pokemon/${evoName}` );
    const evoPokemonData = await evoPokemonResponse.json();
    evoChainDiv.innerHTML += renderEvoChainHTML(evoPokemonData);
  }
}

function closePopup() {
  const bigCard = document.getElementById("bigCard");
  bigCard.style.display = "none";
}

function doNotClose(event) {
  event.stopPropagation();
}

function loadMorePokemon() {  
  fetchData();
}

function filterName() {
  let numOfFilterName = 0;
  let search = document.getElementById("search").value;
  search = search.toLowerCase();
  console.log(search);

  let content = document.getElementById("content");
  content.innerHTML = "";

  for (let i = 0; i < data.length; i++) {
    const pokemonName = data[i]["name"];
    if (pokemonName.toLowerCase().includes(search)) {
      let pokemonData = data[i];
      content.innerHTML += renderCards(i, pokemonData);
      rendertypes(i, pokemonData);
      numOfFilterName++;
    }
  }
  if (numOfFilterName == 0) {
    content.innerHTML = `<div class="filter-name"><span>Dieses Pokémon existiert nicht!</span></div>`
  }
}
