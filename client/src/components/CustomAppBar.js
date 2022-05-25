import AppBar from '@mui/material/AppBar'
import Typography from '@mui/material/Typography'
import Toolbar from '@mui/material/Toolbar'
import TextField from '@mui/material/TextField/TextField'
import Box from '@mui/material/Box/Box'
import IconButton from '@mui/material/IconButton/IconButton'
import SearchIcon from "@mui/icons-material/Search";
import { ReactComponent as LogoSvg } from '../images/logo.svg';

const CustomAppBar = () => <AppBar position="fixed" sx={{ zIndex: (theme) => theme.zIndex.drawer + 1, backgroundColor: '#c1edff' }}>
    <Toolbar>
        <LogoSvg width={120} height={70} />
        <Box marginLeft="auto"><TextField id="outlined-search" size='small' type="search" sx={{ input: { color: 'black', backgroundColor: 'white' } }} /></Box>
        <IconButton type="submit" aria-label="search">
            <SearchIcon style={{ fill: "white" }} />
        </IconButton>
    </Toolbar>

</AppBar>

export default CustomAppBar