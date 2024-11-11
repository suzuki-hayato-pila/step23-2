// import './style.css'
// import javascriptLogo from './javascript.svg'
// import viteLogo from '/vite.svg'
// import { setupCounter } from './counter.js'

import "../styles/style.css";
import { PokemonData } from "./modules/PokemonData.js";

// Initialize Pokemon Data handler
const pokemonData = new PokemonData();

// HTML要素の取得
const form = document.querySelector("#js-form");
const resultDiv = document.querySelector("#js-result");
const pokemonInfoDiv = resultDiv.querySelector(".pokemon-info");
const pokemonImage = document.querySelector("#pokemonImage");
const pokemonNameDisplay = document.querySelector("#pokemonNameDisplay");
const pokemonHeight = document.querySelector("#pokemonHeight");
const pokemonWeight = document.querySelector("#pokemonWeight");
const pokemonTypes = document.querySelector("#pokemonTypes");

// ポケモンデータを表示
async function displayPokemonData(pokemonName) {
  try {
    const pokemon = await pokemonData.getPokemonByName(pokemonName);
    displaySinglePokemon(pokemon);
  } catch (error) {
    showError("Pokemon not found. Please check the spelling and try again.");
  }
}

// シングルポケモン情報の更新
function displaySinglePokemon(pokemon) {
  pokemonImage.src = pokemon.image;
  pokemonImage.alt = pokemon.name;
  pokemonNameDisplay.textContent =
    pokemon.name.charAt(0).toUpperCase() + pokemon.name.slice(1);
  pokemonHeight.textContent = `Height: ${pokemon.height}m`;
  pokemonWeight.textContent = `Weight: ${pokemon.weight}kg`;
  pokemonTypes.textContent = `Types: ${pokemon.types.join(", ")}`;

  pokemonInfoDiv.style.display = "block";
  resultDiv.classList.add("active");
}

// エラーメッセージの表示
function showError(message) {
  resultDiv.innerHTML = `<p class="error-message">${message}</p>`;
  resultDiv.classList.add("active");
}

// 検索フォームのイベントリスナー
form.addEventListener("submit", async (e) => {
  e.preventDefault();
  const pokemonName = document.querySelector("#pokemonName").value.trim();
  if (pokemonName) {
    await displayPokemonData(pokemonName);
  }
});

const filterButton = document.querySelector("#filterData");

//　フィルター機能
filterButton.addEventListener("click", () => {
  const minHeight = parseFloat(document.querySelector("#minHeight").value) || 0;
  const maxHeight =
    parseFloat(document.querySelector("#maxHeight").value) || Infinity;
  const minWeight = parseFloat(document.querySelector("#minWeight").value) || 0;
  const maxWeight =
    parseFloat(document.querySelector("#maxWeight").value) || Infinity;

  filterPokemonData(minHeight, maxHeight, minWeight, maxWeight);
});

async function filterPokemonData(minHeight, maxHeight, minWeight, maxWeight) {
  try {
    const allPokemon = await pokemonData.getAllPokemon();
    const filteredPokemon = allPokemon.filter(
      (pokemon) =>
        pokemon.height >= minHeight &&
        pokemon.height <= maxHeight &&
        pokemon.weight >= minWeight &&
        pokemon.weight <= maxWeight
    );

    displayPokemonList(filteredPokemon);
  } catch (error) {
    showError("Error fetching data. Please try again later.");
  }
}

function displayPokemonList(pokemonList) {
  if (pokemonList.length === 0) {
    showError("No Pokemon found within the specified range.");
    return;
  }

  resultDiv.innerHTML = `
    <div class="pokemon-list">
      ${pokemonList
        .map(
          (pokemon) => `
        <div class="pokemon-card">
          <img src="${pokemon.image}" alt="${
            pokemon.name
          }" class="pokemon-image" />
          <h3>${
            pokemon.name.charAt(0).toUpperCase() + pokemon.name.slice(1)
          }</h3>
          <p>Height: ${pokemon.height}m</p>
          <p>Weight: ${pokemon.weight}kg</p>
          <p>Types: ${pokemon.types.join(", ")}</p>
        </div>
      `
        )
        .join("")}
    </div>
  `;
  resultDiv.classList.add("active");
}
