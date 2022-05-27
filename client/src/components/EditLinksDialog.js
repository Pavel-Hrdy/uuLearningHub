import * as React from 'react';
import Dialog from '@mui/material/Dialog';
import List from '@mui/material/List';
import AppBar from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';
import IconButton from '@mui/material/IconButton';
import Typography from '@mui/material/Typography';
import CloseIcon from '@mui/icons-material/Close';
import Slide from '@mui/material/Slide';
import LinkIcon from '@mui/icons-material/Link';
import Fab from "@mui/material/Fab/Fab";
import AddIcon from '@mui/icons-material/Add';
import Container from "@mui/material/Container"
import { useState, useEffect } from "react";
import ListItem from '@mui/material/ListItem/ListItem';
import ListItemAvatar from '@mui/material/ListItemAvatar/ListItemAvatar';
import Avatar from '@mui/material/Avatar/Avatar';
import DeleteIcon from '@mui/icons-material/Delete';
import TagIcon from '@mui/icons-material/Tag';
import ListItemText from '@mui/material/ListItemText/ListItemText';
import Divider from '@mui/material/Divider/Divider';
import Box from '@mui/material/Box/Box';
import EditIcon from '@mui/icons-material/Edit';
import AddTagDialog from './AddTagDialog';
import DeleteTagDialog from './DeleteTagDialog';
import AddLinkDialog from './AddLinkDialog';

const Transition = React.forwardRef(function Transition(props, ref) {
    // @ts-ignore
    return <Slide direction="up" ref={ref} {...props} />;
});

const fabStyle = {
    right: 40,
    bottom: 20,
    position: 'fixed'
};

export default function EditLinksDialog({ open, handleClose }) {
    const [links, setLinks] = useState([]);
    const [selectedLink, setSelectedLink] = useState({
        "link": "",
        "name": ""
    });
    const [isAddDialogOpen, openAddDialog] = useState(false);
    const [isDeletedDialogOpen, openDeletedDialog] = useState(false);

    const fetchLinks = async () => {
        const linkData = await fetch('http://localhost:5000/link/');
        const finalData = await linkData.json();
        setLinks(finalData);
    }

    const handleTagEdit = (link) => {
        setSelectedLink(link);
        openAddDialog(true);
    }

    useEffect(
        () => {
            fetchLinks()
            // eslint-disable-next-line
        }, [open, isAddDialogOpen, isDeletedDialogOpen]
    )

    return (
        <Dialog
            fullScreen
            open={open}
            onClose={handleClose}
            // @ts-ignore
            TransitionComponent={Transition}
        >
            <AppBar sx={{ position: 'relative', backgroundColor: '#c1edff' }}>
                <Toolbar>
                    <IconButton
                        edge="start"
                        color="primary"
                        onClick={handleClose}
                        aria-label="close"
                    >
                        <CloseIcon />
                    </IconButton>
                    <Typography sx={{ ml: 2, flex: 1 }} variant="h6" color={"primary"}>
                        Úprava linků
                    </Typography>
                </Toolbar>
            </AppBar>
            <Container maxWidth="sm">
                <List>
                    {
                        links.map((link) => (
                            <Box id={link.name + 'box'}>
                                <ListItem id={link.name + 'list-item'}
                                    secondaryAction={
                                        <Box>
                                            <IconButton aria-label="edit" color='primary' onClick={() => handleTagEdit(link)}>
                                                <EditIcon />
                                            </IconButton>
                                        </Box>
                                    }
                                >
                                    <ListItemAvatar>
                                        <Avatar sx={{ bgcolor: "#1976d2" }}>
                                            <LinkIcon />
                                        </Avatar>
                                    </ListItemAvatar>
                                    <ListItemText
                                        primary={link.name}
                                    />
                                </ListItem>
                                <Divider />
                            </Box>
                        ))
                    }
                </List>
            </Container>

            <Fab color="primary" aria-label="add" onClick={() => {
                setSelectedLink({
                    "link": "",
                    "name": ""
                })
                openAddDialog(true);
            }}
                // @ts-ignore
                style={fabStyle}>
                <AddIcon />
            </Fab>
            <AddLinkDialog open={isAddDialogOpen} handleClose={() => openAddDialog(false)} />
        </Dialog >
    );
}
