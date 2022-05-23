import * as React from 'react';
import Box from '@mui/material/Box';
import Drawer from '@mui/material/Drawer';
import Toolbar from '@mui/material/Toolbar';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemText from '@mui/material/ListItemText';
import { Link } from 'react-router-dom';
import chapters from "../chapters.json"
import Divider from '@mui/material/Divider/Divider';
const drawerWidth = 240;

const CustomDrawer = () =>
(
    <Drawer
        variant="permanent"
        sx={{
            width: drawerWidth,
            flexShrink: 0,
            [`& .MuiDrawer-paper`]: { width: drawerWidth, boxSizing: 'border-box' },
        }}
    >
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
                    <ListItem key={index} disablePadding>
                        <ListItemButton component={Link} to={"/chapter/" + chapter.id} style={{ fontWeight: 'bold' }}>
                            {chapter.title}
                        </ListItemButton>
                    </ListItem>
                }>
                    {
                        chapter.subchapters.map((subchapter, index) => (
                            <ListItem key={index} disablePadding>
                                <ListItemButton component={Link} to={"/chapter/" + chapter.id + '/' + subchapter.id}>
                                    <ListItemText primary={subchapter.title} />
                                </ListItemButton>
                            </ListItem>
                        ))
                    }

                </List>
            ))}

        </Box>
    </Drawer>
);

export default CustomDrawer