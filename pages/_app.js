import { Box } from '@mui/material'
import Navbar from '../components/Navbar'
// import '../styles/global.css'

export default function App({ Component, pageProps }) {
  return (
    <>
      <Navbar />
      <Box style={{
        backgroundImage: 'url(https://w0.peakpx.com/wallpaper/433/219/HD-wallpaper-pokeball-nintendo-pocket-monsters-pokemon.jpg)', backgroundRepeat: "no-repeat",
        backgroundSize: "cover"
      }} >
        <Component {...pageProps} />
      </Box>
    </>
  )
}