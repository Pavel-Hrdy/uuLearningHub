import Box from "@mui/material/Box/Box";
import FormControlLabel from "@mui/material/FormControlLabel/FormControlLabel";
import Switch from "@mui/material/Switch/Switch";
import Typography from "@mui/material/Typography/Typography";
import { ReactComponent as LogoSvg } from '../images/logo.svg';
import { useContext } from 'react';
import { GlobalContext } from "context/GlobalContext";
const switchStyle = {
    right: 20,
    bottom: 20,
    position: 'fixed'
};

const Home = () => {
    const context = useContext(GlobalContext);
    return <Box>

        <img src="logo.svg" alt="Monkey face" style={{ width: "60%", height: "auto" }}></img>
        <Typography paragraph paddingLeft={2}>
            Zde najdete všechny potřebné materiály k naučení JavaScriptu.
        </Typography>
        <Box display="flex" sx={switchStyle} >
            <FormControlLabel control={<Switch checked={context.adminMode} onChange={(_, value) => context.changeAdminMode(value)} />} label="Admin mode" />
        </Box>
    </Box>
}
export default Home