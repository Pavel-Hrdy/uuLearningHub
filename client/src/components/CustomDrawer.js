import React from 'react';
import Box from '@mui/material/Box';
import Drawer from '@mui/material/Drawer';
import Toolbar from '@mui/material/Toolbar';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemText from '@mui/material/ListItemText';
import { Link, useLocation } from 'react-router-dom';
import Divider from '@mui/material/Divider/Divider';
import { Collapse } from '@mui/material';
import { useState, useEffect } from "react";
import { ExpandLess, ExpandMore } from '@mui/icons-material';

const drawerWidth = 240;

const CustomDrawer = () => {
    const [selectedChapter, setChapter] = useState('');
    const [chapters, setChapters] = useState([]);
    const { pathname } = useLocation();

    const addChapters = async () => {
        const data = await fetch("http://localhost:5000/chapter");
        const finalData = await data.json();
        setChapters(finalData);
    }
    useEffect(
        () => {
            setChapter('');
            addChapters();
        }, []
    )

    const handleChapterClick = (chapterId) => {
        setChapter(selectedChapter === chapterId ? 'NO-CHAPTER' : chapterId);
    };

    const isSubchapterActive = (chapterId, subchapterId) => {
        let pathnameSplits = pathname.split('/');
        pathnameSplits = pathnameSplits.filter((item) => item.length !== 0)
        if (pathnameSplits.length > 0 && pathnameSplits[0] === "chapter") {
            const currChapterId = pathnameSplits[1];
            const currSubchapterId = pathnameSplits[2];
            return chapterId === currChapterId && currSubchapterId === subchapterId;
        }
        return false;
    }

    const isChapterActive = (chapterId) => {
        let pathnameSplits = pathname.split('/');
        pathnameSplits = pathnameSplits.filter((item) => item.length !== 0)
        if (pathnameSplits.length > 0 && pathnameSplits[0] === "chapter") {
            const currChapterId = pathnameSplits[1];
            return chapterId === currChapterId;
        }
        return false;
    }

    const handleChapterCollapse = (chapterId) => {
        if (selectedChapter === '') {
            if (isChapterActive(chapterId)) {
                setChapter(chapterId);

                return true;
            }
            return false;
        } else {
            return selectedChapter === chapterId;
        }
    }

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
                    <ListItemButton component={Link} to="/" selected={selectedChapter === '--welcome--'} onClick={() => setChapter("--welcome--")}>
                        <ListItemText primary='Vítejte' />
                    </ListItemButton>
                </ListItem>
            </List>
            <Divider />

            {chapters.map((chapter, index) => (
                <List subheader={
                    <ListItemButton key={index + 'title'} onClick={() => handleChapterClick(chapter.chapterOrderNumber)}  >
                        <ListItemText key={index + 'titleText'} primary={chapter.name} primaryTypographyProps={{ style: { fontWeight: 'bold' } }} />
                        {handleChapterCollapse(chapter.chapterOrderNumber) ? <ExpandLess /> : <ExpandMore />}
                    </ListItemButton>
                }>
                    <Collapse in={handleChapterCollapse(chapter.chapterOrderNumber) === true} timeout="auto" unmountOnExit>
                        {
                            chapter.subchapters.map((subchapter, subchapterIndex) => (
                                <ListItem key={subchapterIndex + subchapter.subchapterOrderNumber} disablePadding>
                                    <ListItemButton selected={isSubchapterActive(chapter.chapterOrderNumber, subchapter.subchapterOrderNumber) === true} key={subchapterIndex + subchapter.subchapterOrderNumber + 'button'} component={Link} to={"/chapter/" + chapter.chapterOrderNumber + '/' + subchapter.subchapterOrderNumber}>
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