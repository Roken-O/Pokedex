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

  function renderBigCard(index){
    return `
       <img class="arrowImg" onclick="arrowRightImage(${index}, event)" src="./img/arrow-left-solid.svg" alt="nach links Image" >
       <div onclick="doNotClose(event)" id="popCard" class="popup-content"></div>
       <img class="arrowImg" onclick="arrowLeftImage(${index}, event)" src="./img/arrow-right-solid.svg" alt="nach rechts Image">`;
  }

  function renderPopup(index, pokemonData){
    return `
       <div class="big-card">
          <div class="big-card-header">
              <span class="padding-12">#${pokemonData["id"]} </span>
              <span> ${pokemonData["name"]}</span>
          </div>
          <div class="display-flex bg-${pokemonData["types"][0]["type"]["name"]}">
          <img src="${pokemonData["sprites"]["other"]["official-artwork"]["front_default"]}" class="card-img-top" alt="${pokemonData["name"]}">
          </div>
          <div id="pokemonTypes${index}" class="card-footer m-top-bottom"></div>
       </div>`;
  }

  function renderTypesHTML(index){
    return `
       <div class="display-flex info-buttons">
           <button onclick="rendermain(${index})" type="button" class="btn btn-outline-secondary">main</button>
           <div class="line"></div>
           <button onclick="renderStats(${index})"  type="button" class="btn btn-outline-secondary">stats</button>
           <div class="line"></div>
           <button onclick="renderEvoChain(${index})" type="button" class="btn btn-outline-secondary">evo chain</button>
       </div>
       <div id="mainContainer"></div>`;
  }

  function renderMainHTML(pokemonData){
    return `   
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
      </table>`;
  }

  function renderStatsHTML(stat, pokemonData){
    return `
          <tr>
            <td>${stat["stat"]["name"]}: </td>
            <td class="td-progress">
              <div class="progress" role="progressbar" aria-label="${stat["stat"]["name"]}" aria-valuenow="${stat["base_stat"]}" aria-valuemin="0" aria-valuemax="100">
                <div class="progress-bar bg-${pokemonData["types"][0]["type"]["name"]}" style="width: ${stat["base_stat"]}%">${stat["base_stat"]}</div>
              </div>
            </td>
          </tr>`;
  }

  function renderEvoChainHTML(evoPokemonData){
    return `
       <div class="evo-pokemon">
         <img src="${evoPokemonData['sprites']['other']["official-artwork"]['front_default']}" alt="${evoPokemonData['name']}">
         <span>${evoPokemonData['name']}</span>
       </div>`;
  }

  function showWarningMassage(){
    return `
        <div class="filter-name">
           <span>Dieses Pokémon existiert nicht!</span>
           <button onclick="closeWarningMassage()" type="button" class="btn btn-outline-danger">OK</button>
       </div>`;
  }