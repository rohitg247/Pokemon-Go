import { ApolloClient, InMemoryCache, gql } from '@apollo/client';
import styles from '../styles/Home.module.css'
import { useEffect, useState } from 'react';
import { useRouter } from 'next/dist/client/router';
import { Box, Pagination } from '@mui/material';
let initialData = 60

const client = new ApolloClient({
  uri: 'https://graphql-pokemon2.vercel.app',
  cache: new InMemoryCache()
})

const firstIndex = 0;

export const GetPokemonData = async (p) => {
  try {
    let first = (p * 20);
    const data = await client.query({
      query: gql`
              query pokemons {
              pokemons(first: ${first}) {
              id
              number
              name
              types
              image
                }
              }
          `
    });

    return data
  } catch (err) {
    console.log(err)
  }
}

const Home = ({ data }) => {

  let router = useRouter()
  const [pageSize, setPageSize] = useState(20);
  const [page, setPage] = useState(1);
  const [pokemons, setPokemons] = useState(data.data.pokemons.slice(firstIndex, pageSize));

  useEffect(() => {
    setPokemons(() => data.data.pokemons.slice(0, pageSize));
  }, [pageSize]);

  const handleChange = async (event, value) => {
    if (value > 3) {
      const res = await GetPokemonData(value);
      data = res;
    }
    setPage(value);
    setPokemons(() => data.data.pokemons.slice(firstIndex + pageSize * (value - 1), pageSize * value));
  };


  return (
    <div className={styles.container}>
      {/* style={{
      backgroundImage: 'url(https://w0.peakpx.com/wallpaper/433/219/HD-wallpaper-pokeball-nintendo-pocket-monsters-pokemon.jpg)', backgroundRepeat: "no-repeat",
      backgroundSize: "cover", border: "1px solid red", width: "100%"
    }}> */}
      <Box style={{ width: '100%', display: "flex", justifyContent: "center", alignItems: "center", marginBottom: '20px' }}>
        <Pagination
          count={8}
          page={page}
          onChange={handleChange}
          size="large"
          variant="contained"
          shape="rounded"
          style={{
            backgroundImage: 'linear-gradient(to right, #56CCF2 , #2F80ED)',
            boxShadow: '0px 2px 2px rgba(0, 0, 0, 0.25)',
            borderRadius: '20px',
            '&:hover': {
              backgroundImage: 'linear-gradient(to right, #2F80ED , #56CCF2)',
              color: 'white',
              boxShadow: '0px 4px 4px rgba(0, 0, 0, 0.25)'
            }
          }}
        />
      </Box>
      <ul className={styles.grid}>
        {pokemons.map((pokemon) => (
          <li
            style={{
              cursor: "pointer",
              transition: "all 0.3s ease-in-out",
              transform: "scale(1)",
            }}
            onClick={() => router.push(`/${pokemon.id}`)}
            key={pokemon.id}
            className={styles.card}
            onMouseEnter={(e) => {
              e.target.style.transform = "scale(1.05)";
            }}
            onMouseLeave={(e) => {
              e.target.style.transform = "scale(1)";
            }}
          >
            <img src={pokemon.image} alt={pokemon.name} className={styles.image} />
            <div className={styles.details}>
              <p className={styles.name}>{pokemon.name}</p>
              <p className={styles.number}>#{pokemon.number}</p>
              <p className={styles.type}>{pokemon.types.join(", ")}</p>
            </div>
          </li>
        ))}
      </ul>
      <Box style={{ width: '100%', display: "flex", justifyContent: "center", alignItems: "center", marginTop: '20px' }}>
        <Pagination
          count={8}
          page={page}
          onChange={handleChange}
          size="large"
          variant="contained"
          shape="rounded"
          style={{
            backgroundImage: 'linear-gradient(to right, #56CCF2 , #2F80ED)',
            boxShadow: '0px 2px 2px rgba(0, 0, 0, 0.25)',
            borderRadius: '20px',
            '&:hover': {
              backgroundImage: 'linear-gradient(to right, #2F80ED , #56CCF2)',
              color: 'white',
              boxShadow: '0px 4px 4px rgba(0, 0, 0, 0.25)'
            }
          }}
        />

      </Box>
    </div>
  );
};

export async function getStaticProps() {
  const res = await client.query({
    query: gql`
      query GetPokemons {
        pokemons(first: ${initialData}) {
          id
          name
          image
          number
          types
        }
      }
    `
  });

  return {
    props: {
      data: res
    },
    revalidate: 60
  };
}

export default Home;
