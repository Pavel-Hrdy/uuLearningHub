import React from 'react';
import Box from '@mui/material/Box';
import Drawer from '@mui/material/Drawer';
import Toolbar from '@mui/material/Toolbar';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemText from '@mui/material/ListItemText';
import { Link } from 'react-router-dom';
import Divider from '@mui/material/Divider/Divider';
import { Collapse } from '@mui/material';
import { useState, useEffect } from "react";
import { ExpandLess, ExpandMore } from '@mui/icons-material';
const drawerWidth = 240;

const CustomDrawer = () => {
    const [selectedChapter, setChapter] = useState('');
    const [chapters, setChapters] = useState([]);
    const addChapters = async () => {
        const data = await fetch("http://localhost:5000/chapter");
        const finalData = await data.json();
        setChapters(finalData);
    }
    useEffect(
        () => {
            addChapters();
        }, []
    )

    const handleChapterClick = (chapterId) => {
        setChapter(selectedChapter === chapterId ? '' : chapterId);
    };

    return <Drawer
        variant="permanent"
        sx={{
            width: drawerWidth,
            flexShrink: 0,
            [`& .MuiDrawer-paper`]: { width: drawerWidth, boxSizing: 'border-box' },
        }}>
        <Toolbar />
        <Box sx={{ overflow: 'auto' }}>
            <List>
                <ListItem key='welcome-item' disablePadding>
                    <ListItemButton component={Link} to="/">
                        <ListItemText primary='Vítejte' />
                    </ListItemButton>
                </ListItem>
            </List>
            <Divider />

            {chapters.map((chapter, index) => (
                <List subheader={
                    <ListItemButton key={index + 'title'} onClick={() => handleChapterClick(chapter.chapterOrderNumber)}  >
                        <ListItemText key={index + 'titleText'} primary={chapter.name} primaryTypographyProps={{ style: { fontWeight: 'bold' } }} />
                        {selectedChapter === chapter.chapterOrderNumber ? <ExpandLess /> : <ExpandMore />}
                    </ListItemButton>
                }>
                    <Collapse in={selectedChapter === chapter.chapterOrderNumber} timeout="auto" unmountOnExit>
                        {
                            chapter.subchapters.map((subchapter, subchapterIndex) => (
                                <ListItem key={subchapterIndex + subchapter.subchapterOrderNumber} disablePadding>
                                    <ListItemButton key={subchapterIndex + subchapter.subchapterOrderNumber + 'button'} component={Link} to={"/chapter/" + chapter.chapterOrderNumber + '/' + subchapter.subchapterOrderNumber}>
                                        <ListItemText primary={subchapter.name} />
                                    </ListItemButton>
                                </ListItem>
                            ))
                        }
                    </Collapse>
                </List>
            ))}
        </Box >
    </Drawer >
};

export default CustomDrawer