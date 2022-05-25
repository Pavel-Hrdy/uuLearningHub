import Box from "@mui/material/Box/Box";
import Typography from "@mui/material/Typography/Typography";
import { ReactComponent as LogoSvg } from '../images/logo.svg';

const Home = () =>
    <Box>
        <LogoSvg height={270} />
        <Typography paragraph paddingLeft={2}>
            Zde najdete všechny potřebné materiály k naučení JavaScriptu.
        </Typography>
    </Box>

export default Home