import AppBar from '@mui/material/AppBar'
import Toolbar from '@mui/material/Toolbar'
import TextField from '@mui/material/TextField/TextField'
import Box from '@mui/material/Box/Box'
import TagIcon from '@mui/icons-material/Tag';
import { ReactComponent as LogoSvg } from '../images/logo.svg';
import Autocomplete from '@mui/material/Autocomplete/Autocomplete'
import Button from '@mui/material/Button/Button';
import LinkIcon from '@mui/icons-material/Link';
import { GlobalContext } from "context/GlobalContext";
import { useContext, useState } from "react";
import EditTagsDialog from './EditTagsDialog';

const CustomAppBar = () => {
    const context = useContext(GlobalContext);
    const [isEditTagsDialogOpen, openEditTagsDialog] = useState(false);

    return <AppBar position="fixed" sx={{ zIndex: (theme) => theme.zIndex.drawer + 1, backgroundColor: '#c1edff' }}>
        <Toolbar>
            <LogoSvg width={120} height={70} />
            <Box paddingLeft={3}>
                {
                    context.adminMode ? <Box paddingBottom={0.5} alignSelf={"center"}>
                        <Button onClick={() => openEditTagsDialog(true)} variant="outlined" size="small" startIcon={<TagIcon />}>
                            Upravit tagy
                        </Button>
                    </Box> : <Box />
                }
                {
                    context.adminMode ? <Box alignSelf={"center"}>
                        <Button variant="outlined" size="small" startIcon={<LinkIcon />}>
                            Upravit linky
                        </Button>
                    </Box> : <Box />
                }
            </Box>
            <Box marginLeft="auto" display="flex" width={300} >
                <Autocomplete
                    freeSolo
                    fullWidth
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
        <EditTagsDialog open={isEditTagsDialogOpen} handleClose={() => openEditTagsDialog(false)} />
    </AppBar>
}

export default CustomAppBar