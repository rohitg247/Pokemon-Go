// import Evolution from "@/components/Evolution";
// import Navigation from "@/components/Navigation";
import { ApolloClient, InMemoryCache, gql } from "@apollo/client";
import {
    Box,
    Button,
    Container,
    Grid,
    Modal,
    Stack,
    Typography
} from "@mui/material";

import { useState } from "react";
import Nextevolve from "../components/Nextevolve";

const client = new ApolloClient({
    uri: 'https://graphql-pokemon2.vercel.app',
    cache: new InMemoryCache()
})

export default function PokemonDetails({ pokemon }) {
    const [open, setOpen] = useState(false);
    const handleClose = () => setOpen(false);
    let flag = false;
    const [evolution, setEvolution] = useState([
        {
            id: pokemon.id,
            name: pokemon.name,
            numarginBottomer: pokemon.numarginBottomer,
            image: pokemon.image,
            types: pokemon.types,
        },
    ]);

    if (evolution?.length > 1) {
        flag = true;
    }

    const handleOpen = async () => {
        if (!flag) {
            await client
                .query({
                    query: gql`
            query pokemon($id: String, $name: String) {
              pokemon(id: $id, name: $name) {
                id
                name
                evolutions {
                  id
                  number
                  name
                  image
                  types
                }
              }
            }
          `,
                    variables: {
                        id: pokemon.id,
                        name: pokemon.name,
                    },
                })
                .then((res) => {
                    console.log(res.data.pokemon)
                    setEvolution((prev) => [
                        ...prev,
                        ...(res?.data?.pokemon?.evolutions || []),
                    ]);
                    setOpen(true);
                })
                .catch((err) => {
                    alert(err, "Cant get Evolution");
                });
        } else {
            setOpen(true);
        }
    };
    //   console.log(evolution);
    return (
        <Box style={{ backgroundImage: 'url(https://wallpaper-mania.com/wp-content/uploads/2018/09/High_resolution_wallpaper_background_ID_77700838033.jpg)' }}>
            {/* <Navigation /> */}
            <Container>
                <Box style={{
                    marginBottom: 4,
                    height: "40rem",
                    padding: 5,
                    display: "flex",
                    justifyContent: "center",
                    aligItems: "center",
                }}>
                    <Grid style={{
                        border: "1px solid black",
                        borderRadius: "10px",
                        marginTop: '70px',
                        height: 500,
                        width: 900,
                        backgroundColor: '#fff'
                    }} justifyContent="center" alignItems="center" container spacing={2}>
                        <Grid item xs={12} md={6} style={{ display: "flex", alignItems: "center", justifyContent: "center" }}>
                            <img src={pokemon.image} alt={pokemon.name} height={400} width={400} />
                        </Grid>
                        <Grid item xs={12} md={6} style={{ display: "flex", flexDirection: "column" }}>
                            <Typography variant="h2" style={{ marginBottom: 2 }}>
                                {pokemon.name}
                            </Typography>
                            <Typography variant="h5" style={{ marginBottom: 2 }}>
                                #{pokemon.number}
                            </Typography>
                            <Box style={{ marginBottom: 2 }}>
                                {pokemon.types.map((type) => (
                                    <Button
                                        key={type}
                                        disabled={true}
                                        variant="contained"
                                        style={{ marginBottom: 2, marginBottom: 2, marginRight: 10, color: "#000" }}
                                    >
                                        {type}
                                    </Button>
                                ))}
                            </Box>
                            <Box style={{ marginBottom: 2 }}>
                                <Typography variant="h6" style={{ marginBottom: 1 }}>
                                    Classification
                                </Typography>
                                <Typography>{pokemon.classification}</Typography>
                            </Box>
                            <Box style={{ marginBottom: 2 }}>
                                <Typography variant="h6" style={{ marginBottom: 1 }}>
                                    Weight
                                </Typography>
                                <Typography>
                                    {pokemon.weight.minimum} - {pokemon.weight.maximum}
                                </Typography>
                            </Box>
                            <Box style={{ marginBottom: 2 }}>
                                <Typography variant="h6" style={{ marginBottom: 1 }}>
                                    Height
                                </Typography>
                                <Typography>
                                    {pokemon.height.minimum} - {pokemon.height.maximum}
                                </Typography>

                                <Box style={{ marginTop: 1 }}>
                                    <Typography variant="h6" >
                                        Resistant
                                    </Typography>
                                    <Typography variant="subtitle1">
                                        {pokemon.resistant.join(", ")}
                                    </Typography>
                                </Box>

                                <Box style={{ marginTop: 1 }}>
                                    <Typography variant="h6" >
                                        Weaknesses
                                    </Typography>
                                    <Typography variant="subtitle1">
                                        {pokemon.weaknesses.join(", ")}
                                    </Typography>
                                </Box>
                            </Box>
                            <Button variant="contained" sx={{
                                backgroundColor: "#D3D3D3", color: "#000", mt: -0.6
                            }} onClick={() => handleOpen()} >Evolution</Button>
                        </Grid>
                    </Grid>
                </Box>
            </Container>
            <Modal open={open} onClose={() => setOpen(false)}>
                <Nextevolve evolution={evolution} />
            </Modal>
        </Box>
    )
}
export const getStaticPaths = async () => {
    return {
        paths: [],
        fallback: "blocking",
    };
};

export const getStaticProps = async (req, res) => {
    const { id } = req.params;
    const { data } = await client.query({
        query: gql`
        query pokemon($id: String, $name: String) {
          pokemon(id: $id, name: $name) {
            id
            number
            name
            weight {
              minimum
              maximum
            }
            height {
              minimum
              maximum
            }
            classification
            types
            resistant
            weaknesses
            image
          }
        }
      `,
        variables: {
            id: id,
        },
    });
    return {
        props: {
            pokemon: data.pokemon,
        },
    };
};
