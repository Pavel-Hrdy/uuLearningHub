import AppBar from '@mui/material/AppBar'
import Toolbar from '@mui/material/Toolbar'
import TextField from '@mui/material/TextField/TextField'
import Box from '@mui/material/Box/Box'

import { ReactComponent as LogoSvg } from '../images/logo.svg';
import Autocomplete from '@mui/material/Autocomplete/Autocomplete'

const CustomAppBar = () => <AppBar position="fixed" sx={{ zIndex: (theme) => theme.zIndex.drawer + 1, backgroundColor: '#c1edff' }}>
    <Toolbar>
        <LogoSvg width={120} height={70} />
        <Box marginLeft="auto" width={300}>
            <Autocomplete
                freeSolo
                disableClearable
                options={[]}
                renderInput={(params) => (
                    <TextField
                        {...params}
                        label="Vyhledávání"
                        InputProps={{
                            ...params.InputProps,
                            type: 'search',
                        }}
                    />
                )}
            />
        </Box>
    </Toolbar>
</AppBar>

export default CustomAppBar