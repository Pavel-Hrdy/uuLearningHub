import * as React from 'react';
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';

const AddVideoDialog = ({ open, handleClose }) => {
    return (
        <div>
            <Dialog open={open} onClose={handleClose} fullWidth>
                <DialogTitle>Přidání videa</DialogTitle>
                <DialogContent>
                    <TextField
                        autoFocus
                        margin="dense"
                        id="video-name"
                        label="Název videa"
                        fullWidth
                        variant="standard"
                    />
                    <TextField
                        autoFocus
                        margin="dense"
                        id="video-url"
                        label="URL"
                        fullWidth
                        variant="standard"
                    />
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleClose}>Zrušit</Button>
                    <Button onClick={handleClose}>Přidat</Button>
                </DialogActions>
            </Dialog>
        </div>
    );
}

export default AddVideoDialog
