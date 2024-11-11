// フィルター機能追加
import { HttpRequest } from "./HttpRequest.js";

export class PokemonData {
  constructor() {
    this.httpClient = new HttpRequest("https://pokeapi.co/api/v2");
    this.pokemonCache = new Map();
  }

  async getPokemonByName(name) {
    try {
      const pokemon = await this.httpClient.get(
        `/pokemon/${name.toLowerCase()}`
      );
      return this.formatPokemonData(pokemon);
    } catch (error) {
      throw new Error("Pokemon not found");
    }
  }

  async getAllPokemon() {
    try {
      // Fetch first 151 Pokemon (can be adjusted)
      const response = await this.httpClient.get("/pokemon?limit=151");
      const pokemonList = await Promise.all(
        response.results.map(async (pokemon) => {
          if (this.pokemonCache.has(pokemon.name)) {
            return this.pokemonCache.get(pokemon.name);
          }
          const details = await this.httpClient.get(`/pokemon/${pokemon.name}`);
          const formattedData = this.formatPokemonData(details);
          this.pokemonCache.set(pokemon.name, formattedData);
          return formattedData;
        })
      );
      return pokemonList;
    } catch (error) {
      throw new Error("Failed to fetch Pokemon list");
    }
  }

  formatPokemonData(pokemon) {
    return {
      name: pokemon.name,
      image: pokemon.sprites.other["official-artwork"].front_default,
      height: pokemon.height / 10,
      weight: pokemon.weight / 10,
      types: pokemon.types.map(
        (type) =>
          type.type.name.charAt(0).toUpperCase() + type.type.name.slice(1)
      ),
    };
  }
}

// // フィルター機能前
// import { HttpRequest } from "./HttpRequest.js";

// export class PokemonData {
//   constructor() {
//     this.httpClient = new HttpRequest("https://pokeapi.co/api/v2");
//   }

//   async getPokemonByName(name) {
//     try {
//       const pokemon = await this.httpClient.get(
//         `/pokemon/${name.toLowerCase()}`
//       );
//       return {
//         name: pokemon.name,
//         image: pokemon.sprites.other["official-artwork"].front_default,
//         height: pokemon.height / 10,
//         weight: pokemon.weight / 10,
//         types: pokemon.types.map(
//           (type) =>
//             type.type.name.charAt(0).toUpperCase() + type.type.name.slice(1)
//         ),
//       };
//     } catch (error) {
//       throw new Error("Pokemon not found");
//     }
//   }
// }
