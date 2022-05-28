import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogTitle from '@mui/material/DialogTitle';
import { useState, useEffect } from "react";
import Box from '@mui/material/Box/Box';
import Alert from '@mui/material/Alert/Alert';

const AddTagDialog = ({ open, handleClose, tag }) => {
    const [tagName, setTagName] = useState('');
    const [errorMessage, setErrorMessage] = useState('');

    const handleAdd = async () => {
        const result = await fetch('http://localhost:5000/tag/create', {
            method: 'POST',
            headers: {
                Accept: 'application/json',
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                name: tagName
            })
        });
        const finalData = await result.json();
        if (finalData["error"]) {
            setErrorMessage(finalData.error)
        } else {
            handleClose();
        }
    }

    const handleEdit = async () => {
        const result = await fetch('http://localhost:5000/tag/update', {
            method: 'POST',
            headers: {
                Accept: 'application/json',
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                id: tag.id,
                name: tagName
            })
        });
        const finalData = await result.json();
        if (finalData["error"]) {
            setErrorMessage(finalData.error)
        } else {
            handleClose();
        }
    }

    const setEditTagName = () => {
        if (tag) {
            setTagName(tag.name);
        }
    }

    useEffect(
        () => {
            setEditTagName();
            // eslint-disable-next-line
        }, [tag.id, tag.name]
    )

    return <Dialog open={open} onClose={handleClose}>
        <DialogTitle>{tag.name.length === 0 ? "Přidání tagu" : "Editace tagu"}</DialogTitle>
        <DialogContent>
            <Box width={300}>
                <TextField
                    autoFocus
                    margin="dense"
                    id="name"
                    label="Jméno tagu"
                    fullWidth
                    value={tagName}
                    onChange={(e) => {
                        setTagName(e.target.value);
                    }}
                    variant="standard"
                />
            </Box>
            {errorMessage === "" ? <Box /> : <Box paddingTop={2}><Alert severity="error">{errorMessage}</Alert></Box>}
        </DialogContent>
        <DialogActions>
            <Button onClick={handleClose}>Zrušit</Button>
            <Button onClick={tag.name.length === 0 ? handleAdd : handleEdit}> {tag.name.length === 0 ? "Přidat" : "Editovat"}</Button>
        </DialogActions>
    </Dialog>
}

export default AddTagDialog