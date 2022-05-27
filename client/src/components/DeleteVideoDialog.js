import * as React from 'react';
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';
import { useNavigate } from "react-router-dom";
const DeleteVideoDialog = ({ open, handleClose, videoId }) => {
    const navigate = useNavigate();

    const deleteVideo = async () => {
        await fetch('http://localhost:5000/video/delete', {
            method: 'POST',
            headers: {
                Accept: 'application/json',
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                id: videoId
            })
        });
    }

    const handleDeleteVideo = async () => {
        await deleteVideo();
        handleClose();
        navigate(-1);
    }


    return <Dialog
        open={open}
        onClose={handleClose}
    >
        <DialogTitle id="delete-video-dialog-title">
            {"Upozornění"}
        </DialogTitle>
        <DialogContent>
            <DialogContentText id="delete-video-dialog-description">
                Opravdu chcete smazat toto video?
            </DialogContentText>
        </DialogContent>
        <DialogActions>
            <Button onClick={handleClose}>Ne</Button>
            <Button onClick={handleDeleteVideo} autoFocus>
                Ano
            </Button>
        </DialogActions>
    </Dialog>

}
export default DeleteVideoDialog