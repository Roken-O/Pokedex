/**
 * Array to store images of Pokémon.
 * @type {string[]}
 */
let img = [];

/**
 * Array to store Pokémon data fetched from the API.
 * @type {Object[]}
 */
let data = [];

/**
 * Start index for fetching Pokémon data.
 * @type {number}
 */
let start = 1;

/**
 * End index for fetching Pokémon data.
 * @type {number}
 */
let end = 20;

/**
 * Index for tracking the next Pokémon image in the header.
 * @type {number}
 */
let indexNextIcon = 0;

/**
 * Initializes the application by fetching Pokémon data and setting up the UI.
 * Shows a loading indicator while data is being fetched.
 */
async function init() {
  showLoader();
  try {
    await fetchData();
  } catch (error) {
    console.error(error);
  }
  hideLoader();
  getImgHeader();
  nextImgHeader();
}

/**
 * Displays the loading spinner.
 */
function showLoader() {
  document.getElementById('loader').style.display = 'flex';
}

/**
 * Hides the loading spinner.
 */
function hideLoader() {
  document.getElementById('loader').style.display = 'none';
}

/**
 * Fetches Pokémon data from the API and updates the global data array.
 * Updates the range of indices for the next set of data to fetch.
 * Renders the fetched Pokémon data to the UI.
 * @async
 */
async function fetchData() {
  for (let i = start; i <= end; i++) {
    const response = await fetch(`https://pokeapi.co/api/v2/pokemon/${i}/`);
    const pokemon = await response.json();

    data.push(pokemon);
  }
  start += 20;
  end += 20;
  renderPokemonData();
}

/**
 * Updates the header image with the first 20 Pokémon images.
 */
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

/**
 * Cycles through Pokémon images in the header with a fade-out animation.
 */
function nextImgHeader() {
  let pokemonImg = document.getElementById('next-pokemon-img');
  pokemonImg.classList.add('fade-out');
  setTimeout(() => {
    if (indexNextIcon == 0) {
      indexNextIcon = img.length - 1;
    } else {
      indexNextIcon--;
    }
    pokemonImg.src = img[indexNextIcon];
    pokemonImg.classList.remove('fade-out');
  }, 500);
  setTimeout(nextImgHeader, 4000);
}

/**
 * Renders Pokémon data on the page by dynamically creating HTML content.
 */
function renderPokemonData() {
  let content = document.getElementById("content");
  content.innerHTML = "";
  for (let i = 0; i < data.length; i++) {
    const pokemonData = data[i];
    content.innerHTML += renderCards(i, pokemonData);
    rendertypes(i, pokemonData);
  }
}

/**
 * Renders the types of a Pokémon as badges.
 * @param {number} i - The index of the Pokémon in the data array.
 * @param {Object} pokemonData - The data object of the Pokémon.
 */
function rendertypes(i, pokemonData) {
  let type = document.getElementById(`pokemonTypes${i}`);
  for (let j = 0; j < pokemonData["types"].length; j++) {
    let pokemonType = pokemonData["types"][j];
    type.innerHTML += `<span class="m-right-span bg-${pokemonType["type"]["name"]}">${pokemonType["type"]["name"]}</span>`;
  }
}

/**
 * Opens a detailed view of a Pokémon card.
 * @param {number} index - The index of the Pokémon in the data array.
 */
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

/**
 * Renders the main attributes of a Pokémon in the detail view.
 * @param {number} index - The index of the Pokémon in the data array.
 */
function rendermain(index) {
  const pokemonData = data[index];
  let mainContainer = document.getElementById("mainContainer");
  mainContainer.innerHTML = renderMainHTML(pokemonData);
  let pokemonAbility = document.getElementById("pokemon-abilities");
  pokemonAbility.innerHTML = "";
  for (let j = 0; j < pokemonData["abilities"].length; j++) {
    const ability = pokemonData["abilities"][j];
    pokemonAbility.innerHTML += j + 1 === pokemonData["abilities"].length
      ? `${ability["ability"]["name"]}. `
      : `${ability["ability"]["name"]}, `;
  }
}

/**
 * Renders the stats of a Pokémon in a table format.
 * @param {number} index - The index of the Pokémon in the data array.
 */
function renderStats(index) {
  let statsContainer = document.getElementById("mainContainer");
  statsContainer.innerHTML = '<table class="mainTable" id="statTable"></table>';
  for (let i = 0; i < data[index]["stats"].length; i++) {
    let pokemonData = data[index];
    let stat = data[index]["stats"][i];
    document.getElementById("statTable").innerHTML += renderStatsHTML(stat, pokemonData);
  }
}

/**
 * Fetches the evolution chain of a Pokémon by its ID.
 * @async
 * @param {number} pokemonId - The ID of the Pokémon.
 * @returns {Promise<Object>} The evolution chain data of the Pokémon.
 */
async function fetchEvolutionChain(pokemonId) {
  const speciesResponse = await fetch(`https://pokeapi.co/api/v2/pokemon-species/${pokemonId}/`);
  const speciesData = await speciesResponse.json();
  const evolutionChainUrl = speciesData["evolution_chain"]["url"];
  const evolutionChainResponse = await fetch(evolutionChainUrl);
  const evolutionChainData = await evolutionChainResponse.json();
  return evolutionChainData["chain"];
}

/**
 * Extracts the evolution chain names from the evolution chain data.
 * @param {Object} chain - The evolution chain object.
 * @returns {string[]} The names of the Pokémon in the evolution chain.
 */
function extractEvolutionChain(chain) {
  const evolutionChain = [];
  for (let current = chain; current; current = current["evolves_to"].length ? current["evolves_to"][0] : null) {
    evolutionChain.push(current["species"]["name"]);
  }
  return evolutionChain;
}

/**
 * Renders the evolution chain of a Pokémon in the detail view.
 * @async
 * @param {number} index - The index of the Pokémon in the data array.
 */
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

/**
 * Closes the Pokémon detail view popup.
 */
function closePopup() {
  const bigCard = document.getElementById("bigCard");
  bigCard.style.display = "none";
}

/**
 * Prevents the event from propagating to parent elements.
 * @param {Event} event - The event object.
 */
function doNotClose(event) {
  event.stopPropagation();
}

/**
 * Loads more Pokémon data from the API and appends it to the existing list.
 * Shows a loading indicator while data is being fetched.
 * @async
 */
async function loadMorePokemon() {
  let loadButton = document.getElementById("load-btn");
  loadButton.disabled = true;
  loadButton.style.display = 'none';
  showLoader();
  try {
    await fetchData();
  } catch (error) {
    console.error(error);
  }
  hideLoader();
  loadButton.disabled = false;
  loadButton.style.display = 'flex';
}

/**
 * Filters the Pokémon list by name based on the search input.
 */
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
    if (numOfFilterName === 0) {
      content.innerHTML = showWarningMassage();
    }
  } else {
    renderPokemonData();
  }
}

/**
 * Closes the warning message and resets the Pokémon list.
 */
function closeWarningMassage() {
  renderPokemonData();
  document.getElementById("search").value = '';
}

/**
 * Navigates to the previous Pokémon image in the detail view.
 * @param {number} i - The index of the current Pokémon.
 * @param {Event} event - The event object.
 */
function arrowLeftImage(i, event) {
  event.stopPropagation();
  if (i == data.length - 1) {
    i = 0;
  } else {
    i = i + 1;
  }
  openCard(i);
}

/**
 * Navigates to the next Pokémon image in the detail view.
 * @param {number} i - The index of the current Pokémon.
 * @param {Event} event - The event object.
 */
function arrowRightImage(i, event) {
  event.stopPropagation();
  if (i == 0) {
    i = data.length - 1;
  } else {
    i = i - 1;
  }
  openCard(i);
}
