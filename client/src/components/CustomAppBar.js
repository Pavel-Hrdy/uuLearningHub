import AppBar from '@mui/material/AppBar'
import Typography from '@mui/material/Typography'
import Toolbar from '@mui/material/Toolbar'
import TextField from '@mui/material/TextField/TextField'
import Box from '@mui/material/Box/Box'
import IconButton from '@mui/material/IconButton/IconButton'
import SearchIcon from "@mui/icons-material/Search";

const CustomAppBar = () => <AppBar position="fixed" sx={{ zIndex: (theme) => theme.zIndex.drawer + 1, backgroundColor: '#00b6c7' }}>
    <Toolbar>
        <Typography variant="h6" noWrap component="div">
            uuLearningHub
        </Typography>
        <Box marginLeft="auto"><TextField id="outlined-search" size='small' type="search" sx={{ input: { color: 'black', backgroundColor: 'white' } }} /></Box>
        <IconButton type="submit" aria-label="search">
            <SearchIcon style={{ fill: "white" }} />
        </IconButton>
    </Toolbar>

</AppBar>

export default CustomAppBar