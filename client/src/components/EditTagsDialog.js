import * as React from 'react';
import Dialog from '@mui/material/Dialog';
import List from '@mui/material/List';
import AppBar from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';
import IconButton from '@mui/material/IconButton';
import Typography from '@mui/material/Typography';
import CloseIcon from '@mui/icons-material/Close';
import Slide from '@mui/material/Slide';
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

const Transition = React.forwardRef(function Transition(props, ref) {
    // @ts-ignore
    return <Slide direction="up" ref={ref} {...props} />;
});

const fabStyle = {
    right: 40,
    bottom: 20,
    position: 'fixed'
};

export default function EditTagsDialog({ open, handleClose }) {
    const [tags, setTags] = useState([]);
    const [selectedTag, setSelectedTag] = useState({
        "id": "",
        "name": ""
    });
    const [isAddDialogOpen, openAddDialog] = useState(false);
    const [isDeleteDialogOpen, openDeleteDialog] = useState(false);

    const fetchTags = async () => {
        const tagData = await fetch('http://localhost:5000/tag/list', {
            method: 'POST',
            headers: {
                Accept: 'application/json',
                'Content-Type': 'application/json'
            },
        });
        const finalData = await tagData.json();
        setTags(finalData);
    }

    const handleTagDelete = async (tag) => {
        setSelectedTag(tag);
        openDeleteDialog(true)
    }

    const handleTagEdit = (tag) => {
        setSelectedTag(tag);
        openAddDialog(true);
    }

    useEffect(
        () => {
            fetchTags()
            // eslint-disable-next-line
        }, [open, isAddDialogOpen, isDeleteDialogOpen]
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
                        Úprava tagů
                    </Typography>
                </Toolbar>
            </AppBar>
            <Container maxWidth="sm">
                <List>
                    {
                        tags.map((tag) => (
                            <Box id={tag.name + 'box'}>
                                <ListItem id={tag.name + 'list-item'}
                                    secondaryAction={
                                        <Box>
                                            <IconButton aria-label="edit" color='primary' onClick={() => handleTagEdit(tag)}>
                                                <EditIcon />
                                            </IconButton>
                                            <IconButton edge="end" aria-label="delete" color='error' onClick={() => handleTagDelete(tag)}>
                                                <DeleteIcon />
                                            </IconButton>
                                        </Box>
                                    }
                                >
                                    <ListItemAvatar>
                                        <Avatar sx={{ bgcolor: "#1976d2" }}>
                                            <TagIcon />
                                        </Avatar>
                                    </ListItemAvatar>
                                    <ListItemText
                                        primary={tag.name}
                                    />

                                </ListItem>
                                <Divider />
                            </Box>
                        ))
                    }
                </List>
            </Container>

            <Fab color="primary" aria-label="add" onClick={() => {
                setSelectedTag({
                    "id": "",
                    "name": ""
                })
                openAddDialog(true);
            }}
                // @ts-ignore
                style={fabStyle}>
                <AddIcon />
            </Fab>
            <AddTagDialog open={isAddDialogOpen} handleClose={() => openAddDialog(false)} tag={selectedTag} />
            <DeleteTagDialog open={isDeleteDialogOpen} handleClose={() => openDeleteDialog(false)} tag={selectedTag} />
        </Dialog >
    );
}
