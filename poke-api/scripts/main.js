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
const searchInput = document.querySelector("#pokemonName");
const filterButton = document.querySelector("#filterData");

// 結果表示用の基本HTML構造を保存
const baseResultHTML = resultDiv.innerHTML;

// ポケモンデータを表示
async function displayPokemonData(pokemonName) {
  try {
    const pokemon = await pokemonData.getPokemonByName(pokemonName);
    // 基本構造を復元
    resultDiv.innerHTML = baseResultHTML;

    // 要素の再取得
    const pokemonInfoDiv = resultDiv.querySelector(".pokemon-info");
    const pokemonImage = resultDiv.querySelector("#pokemonImage");
    const pokemonNameDisplay = resultDiv.querySelector("#pokemonNameDisplay");
    const pokemonHeight = resultDiv.querySelector("#pokemonHeight");
    const pokemonWeight = resultDiv.querySelector("#pokemonWeight");
    const pokemonTypes = resultDiv.querySelector("#pokemonTypes");

    // データの表示
    pokemonImage.src = pokemon.image;
    pokemonImage.alt = pokemon.name;
    pokemonNameDisplay.textContent =
      pokemon.name.charAt(0).toUpperCase() + pokemon.name.slice(1);
    pokemonHeight.textContent = `Height: ${pokemon.height}m`;
    pokemonWeight.textContent = `Weight: ${pokemon.weight}kg`;
    pokemonTypes.textContent = `Types: ${pokemon.types.join(", ")}`;

    pokemonInfoDiv.style.display = "block";
    resultDiv.classList.add("active");
  } catch (error) {
    showError("Pokemon not found. Please check the spelling and try again.");
  }
}

// エラーメッセージの表示
function showError(message) {
  // 基本構造を復元
  resultDiv.innerHTML = baseResultHTML;

  // pokemon-infoを非表示
  const pokemonInfoDiv = resultDiv.querySelector(".pokemon-info");
  if (pokemonInfoDiv) {
    pokemonInfoDiv.style.display = "none";
  }

  // エラーメッセージを表示
  const errorDiv = document.createElement("p");
  errorDiv.className = "error-message";
  errorDiv.textContent = message;
  resultDiv.appendChild(errorDiv);
  resultDiv.classList.add("active");
}

// フィルター機能
async function filterPokemonData(minHeight, maxHeight, minWeight, maxWeight) {
  try {
    const allPokemon = await pokemonData.getAllPokemon();
    const filteredPokemon = allPokemon.filter(
      (pokemon) =>
        pokemon.height >= minHeight &&
        pokemon.height <= maxHeight &&
        (minWeight === 0 || pokemon.weight >= minWeight) &&
        (maxWeight === Infinity || pokemon.weight <= maxWeight)
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

  // Clear any existing error messages
  const errorMessage = resultDiv.querySelector(".error-message");
  if (errorMessage) {
    errorMessage.remove();
  }

  // 基本構造を保持しつつ、リストを表示
  const pokemonInfoDiv = resultDiv.querySelector(".pokemon-info");
  if (pokemonInfoDiv) {
    pokemonInfoDiv.style.display = "none";
  }

  // リスト表示用のdivを作成
  const listDiv = document.createElement("div");
  listDiv.className = "pokemon-list";
  listDiv.innerHTML = pokemonList
    .map(
      (pokemon) => `
      <div class="pokemon-card">
        <img src="${pokemon.image}" alt="${
        pokemon.name
      }" class="pokemon-image" />
        <h3>${pokemon.name.charAt(0).toUpperCase() + pokemon.name.slice(1)}</h3>
        <p>Height: ${pokemon.height}m</p>
        <p>Weight: ${pokemon.weight}kg</p>
        <p>Types: ${pokemon.types.join(", ")}</p>
      </div>
    `
    )
    .join("");

  // 既存のリストがあれば削除
  const existingList = resultDiv.querySelector(".pokemon-list");
  if (existingList) {
    existingList.remove();
  }

  // 新しいリストを追加
  resultDiv.appendChild(listDiv);
  resultDiv.classList.add("active");
}

// イベントリスナー
form.addEventListener("submit", async (e) => {
  e.preventDefault();
  const pokemonName = searchInput.value.trim();
  if (pokemonName) {
    await displayPokemonData(pokemonName);
  }
});

filterButton.addEventListener("click", () => {
  const minHeight = parseFloat(document.querySelector("#minHeight").value) || 0;
  const maxHeight =
    parseFloat(document.querySelector("#maxHeight").value) || Infinity;
  const minWeight = parseFloat(document.querySelector("#minWeight").value) || 0;
  const maxWeight =
    parseFloat(document.querySelector("#maxWeight").value) || Infinity;

  filterPokemonData(minHeight, maxHeight, minWeight, maxWeight);
});
