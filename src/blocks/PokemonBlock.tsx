import axios from 'axios';
import { useEffect, useState } from "react";
import Block from './Block';
import './BlockStyles.css';
import { BlockModel } from './types';

function Pokemon() {
  const TOTAL_POKEMONS = 600;
  const [pokemon_name, setPokemonName] = useState('');
  const [pokemon_image, setPokemonImage] = useState('');

  useEffect(() => {
    const zero_padding = (number: number) => {
      if (number >= 100) return number;
      if (number >= 10) return '0' + number;
      return '00' + number;
    }

    async function pokemon() {
      const pokemon_id_1 = Math.floor(Math.random() * (TOTAL_POKEMONS - 1)) + 1;
      const data = await axios.get(`https://pokeapi.co/api/v2/pokemon/${pokemon_id_1}/`);
      setPokemonName(data.data.name);

      const pokemon_image_uri = `https://assets.pokemon.com/assets/cms2/img/pokedex/detail/${zero_padding(pokemon_id_1)}.png`;
      setPokemonImage(pokemon_image_uri);
    }
    pokemon();
  }, []);

  return (
    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', flexDirection: 'column', marginBottom: '40px', font: '#000' }}>
      <strong>A wild {pokemon_name} appeared! 😱</strong>
      <img src={pokemon_image} alt={pokemon_name} />
    </div>
  );
}

export default class PokemonBlock extends Block {
  render() {
    return (
      <Pokemon />
    );
  }

  renderEditModal(done: (data: BlockModel) => void) {
    return (<h1>Nothing to edit here - the Pokemon is chosen randomly.</h1>);
  }
}