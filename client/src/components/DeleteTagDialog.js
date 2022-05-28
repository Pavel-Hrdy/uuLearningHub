import { useState, useEffect } from 'react';
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';
import { useNavigate } from "react-router-dom";
import List from '@mui/material/List/List';
import ListItemText from '@mui/material/ListItemText/ListItemText';
import ListItem from '@mui/material/ListItem/ListItem';
import Box from '@mui/material/Box/Box';

const DeleteTagDialog = ({ open, handleClose, tag }) => {
    const [videoList, setVideoList] = useState([]);

    const deleteTag = async () => {
        if (tag.id && videoList) {
            const data = await fetch('http://localhost:5000/tag/delete', {
                method: 'POST',
                headers: {
                    Accept: 'application/json',
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    id: tag.id,
                    videoList: videoList
                })
            });
            const finalData = await data.json();
            console.log(finalData);
        }
    }

    const handleDeleteTag = async () => {
        await deleteTag();
        handleClose();
    }

    const fetchVideos = async () => {
        if (tag.id) {
            const data = await fetch('http://localhost:5000/tag/listVideos', {
                method: 'POST',
                headers: {
                    Accept: 'application/json',
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    id: tag.id
                })
            });

            const finalData = await data.json();
            console.log(finalData);
            if (data.status === 200) {
                setVideoList(finalData);
            }
        }
    }

    useEffect(
        () => {
            setVideoList([]);
            fetchVideos();
            // eslint-disable-next-line
        }, [tag.id]
    )



    return <Dialog
        open={open}
        onClose={handleClose}
    >
        <DialogTitle id="delete-tag-dialog-title">
            {"Upozornění"}
        </DialogTitle>
        <DialogContent>
            <DialogContentText id="delete-tag-dialog-description">
                {"Opravdu chcete smazat tento tag? " + (videoList.length > 0 ? "Smaže se tím i z těchto videí:" : "")}
                <List>
                    {

                        videoList ? videoList.map((video) => {
                            return <ListItem disablePadding>
                                <ListItemText secondary={video.name} />
                            </ListItem>
                        }) : <Box />
                    }

                </List>
            </DialogContentText>
        </DialogContent>
        <DialogActions>
            <Button onClick={handleClose}>Ne</Button>
            <Button onClick={handleDeleteTag} autoFocus>
                Ano
            </Button>
        </DialogActions>
    </Dialog>

}
export default DeleteTagDialog