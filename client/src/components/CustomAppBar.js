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
import { useContext, useState, useEffect } from "react";
import EditTagsDialog from './EditTagsDialog';
import EditLinksDialog from './EditLinksDialog';
import { useNavigate } from "react-router-dom";

const CustomAppBar = () => {
    const context = useContext(GlobalContext);
    const navigate = useNavigate();
    const [isEditTagsDialogOpen, openEditTagsDialog] = useState(false);
    const [isEditLinksDialogOpen, openEditLinksDialog] = useState(false);
    const [searchQuery, setSearchQuery] = useState('');
    const [searchOptions, setSearchOptions] = useState([]);

    useEffect(
        () => {
            fetchSearchOptions()
            // eslint-disable-next-line
        }, [searchQuery]
    )

    const navigateToResults = (query) => {
        const isTag = searchQuery.length > 0 && searchQuery.charAt(0) === '#' ? 1 : 0;
        let editedQuery = query;

        if (isTag) {
            editedQuery = editedQuery.substring(1);
        }

        const path = `/search/?query=${editedQuery}&isTag=${isTag}`;
        navigate(path);
    }

    const fetchSearchOptions = async () => {
        //Vyhledávání podle tagu
        if (searchQuery.length > 0 && searchQuery.charAt(0) === '#') {

            const result = await fetch('http://localhost:5000/tag/list', {
                method: 'POST',
                headers: {
                    Accept: 'application/json',
                    'Content-Type': 'application/json'
                },
            });
            const finalData = await result.json();
            setSearchOptions(
                finalData.map((tag) => `#${tag.name}`)
            )
        } else if (searchQuery.length > 0)
        //Full text vyhledávání
        {
            const result = await fetch(`http://localhost:5000/video/?fulltext=${searchQuery}`);
            const finalData = await result.json();
            setSearchOptions(
                finalData.map((video) => video.name)
            );
        } else {
            setSearchOptions([]);
        }
    }

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
                        <Button onClick={() => openEditLinksDialog(true)} variant="outlined" size="small" startIcon={<LinkIcon />}>
                            Upravit linky
                        </Button>
                    </Box> : <Box />
                }
            </Box>
            <Box marginLeft="auto" display="flex" width={400} >
                <Autocomplete
                    freeSolo
                    fullWidth
                    disableClearable
                    options={searchOptions}
                    onKeyDown={e => {
                        if (e.code === 'Enter') {
                            // @ts-ignore
                            navigateToResults(e.target.value)
                        }
                    }}
                    onChange={(e, v) => navigateToResults(v)}
                    renderInput={(params) => (
                        <TextField
                            {...params}
                            label="Vyhledávání"
                            onChange={(e) => setSearchQuery(e.target.value)}

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
        <EditLinksDialog open={isEditLinksDialogOpen} handleClose={() => openEditLinksDialog(false)} />
    </AppBar>
}

export default CustomAppBar