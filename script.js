let img = [];
let data = [];
let start = 1;
let end = 20;
let indexNextIcon = 0;

async function init() {
  try {
    await fetchData();
  } catch (error) {
    console.error(error);
  }
  getImgHeader();
  nextImgHeader();
}

async function fetchData() {
  for (let i = start; i <= end; i++) {
    const response = await fetch(`https://pokeapi.co/api/v2/pokemon/${i}/`);
    const pokemon = await response.json();

    data.push(pokemon);
  }
  start = start + 20;
  end = end + 20;
  renderPokemonData();
}

function getImgHeader() {
  for (let i = 0; i < 20; i++) {
    const pokemon = data[i];
    if (pokemon) {
      const imgSrc = pokemon['sprites']['other']['showdown']['front_shiny'];
      img.push(imgSrc);
    }
  }
  document.getElementById('next-pokemon-img').src = img[0];
}

function nextImgHeader() {
  let pokemonImg = document.getElementById('next-pokemon-img');
  pokemonImg.classList.add('fade-out');
  setTimeout(() => {
    if (indexNextIcon == 0) {
      indexNextIcon = img.length - 1;
    } else {
      indexNextIcon = indexNextIcon - 1;
    }
    pokemonImg.src = img[indexNextIcon];
    pokemonImg.classList.remove('fade-out');
  }, 500);
  setTimeout(nextImgHeader, 4000);
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
    type.innerHTML += `<span class="m-right-span bg-${pokemonType["type"]["name"]}">${pokemonType["type"]["name"]}</span>`;
  }
}

function openCard(index) {
  const bigCard = document.getElementById("bigCard");
  bigCard.style.display = "flex";
  const pokemonData = data[index];
  bigCard.innerHTML = "";
  bigCard.innerHTML += renderBigCard(index);
  let popup = document.getElementById("popCard");
  popup.innerHTML += renderPopup(index, pokemonData);
  rendertypes(index, pokemonData);
  popup.innerHTML += renderTypesHTML(index);
  rendermain(index);
}

function rendermain(index) {
  const pokemonData = data[index];
  let mainContainer = document.getElementById("mainContainer");
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
    let pokemonData = data[index];
    let stat = data[index]["stats"][i];
    document.getElementById("statTable").innerHTML += renderStatsHTML(
      stat,
      pokemonData
    );
  }
}

async function fetchEvolutionChain(pokemonId) {
  const speciesResponse = await fetch(`https://pokeapi.co/api/v2/pokemon-species/${pokemonId}/`);
  const speciesData = await speciesResponse.json();
  const evolutionChainUrl = speciesData["evolution_chain"]["url"];
  const evolutionChainResponse = await fetch(evolutionChainUrl);
  const evolutionChainData = await evolutionChainResponse.json();
  return evolutionChainData["chain"];
}

function extractEvolutionChain(chain) {
  const evolutionChain = [];
  for (let current = chain; current; current = current["evolves_to"].length ? current["evolves_to"][0] : null) {
    evolutionChain.push(current["species"]["name"]);
  }
  return evolutionChain;
}

async function renderEvoChain(index) {
  const pokemonData = data[index];
  const evolutionChain = await fetchEvolutionChain(pokemonData["id"]);
  const evoChainList = extractEvolutionChain(evolutionChain);
  let evoChainContainer = document.getElementById("mainContainer");
  evoChainContainer.innerHTML = `<div class="evo-chain"></div>`;
  let evoChainDiv = evoChainContainer.querySelector(".evo-chain");

  for (const evoName of evoChainList) {
    const evoPokemonResponse = await fetch(`https://pokeapi.co/api/v2/pokemon/${evoName}`);
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

async function loadMorePokemon() {
  let loadButton = document.getElementById("load-btn");
  loadButton.disabled = true;
  loadButton.style.display = 'none';

  try {
    await fetchData();
  } catch (error) {
    console.error(error);
  }
  loadButton.disabled = false;
  loadButton.style.display = 'flex';
}

function filterName() {
  let numOfFilterName = 0;
  let search = document.getElementById("search").value;
  search = search.toLowerCase();
  if (search.length > 2) {
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
      content.innerHTML = showWarningMassage();
    }
  } else {
    renderPokemonData();
  }
}

function closeWarningMassage() {
  renderPokemonData();
  document.getElementById("search").value = '';
}

function arrowLeftImage(i, event) {
  event.stopPropagation();
  if (i == data.length - 1) {
    i = 0;
  } else {
    i = i + 1;
  }
  openCard(i);
}

function arrowRightImage(i, event) {
  event.stopPropagation();
  if (i == 0) {
    i = data.length - 1;
  } else {
    i = i - 1;
  }
  openCard(i);
}
