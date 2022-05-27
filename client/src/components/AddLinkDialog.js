import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogTitle from '@mui/material/DialogTitle';
import { useState, useEffect } from "react";
import Box from '@mui/material/Box/Box';
import Alert from '@mui/material/Alert/Alert';

const AddLinkDialog = ({ open, handleClose, link }) => {
    const [linkObject, setLinkObject] = useState({
        "name": "",
        "link": ""
    });
    const [errorMessage, setErrorMessage] = useState('');

    const handleAdd = async () => {
        const result = await fetch('http://localhost:5000/link/create', {
            method: 'POST',
            headers: {
                Accept: 'application/json',
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                name: linkObject.name,
                link: linkObject.link
            })
        });
        const finalData = await result.json();
        if (finalData["error"]) {
            setErrorMessage(finalData.error)
        } else {
            handleClose();
        }
    }


    useEffect(
        () => {
            // eslint-disable-next-line
        }, [link]
    )

    return <Dialog open={open} onClose={handleClose}>
        <DialogTitle>{"Přidání linku"}</DialogTitle>
        <DialogContent>
            <TextField
                autoFocus
                margin="dense"
                id="name"
                label="Jméno linku"
                fullWidth
                value={linkObject.name}
                onChange={(e) => {
                    setLinkObject({
                        ...linkObject,
                        "name": e.target.value,
                    })
                }}
                variant="standard"
            />
            <TextField
                autoFocus
                margin="dense"
                id="name"
                label="URL"
                fullWidth
                value={linkObject.link}
                onChange={(e) => {
                    setLinkObject({
                        ...linkObject,
                        "link": e.target.value,
                    })
                }}
                variant="standard"
            />
            {errorMessage === "" ? <Box /> : <Box paddingTop={2}><Alert severity="error">{errorMessage}</Alert></Box>}
        </DialogContent>
        <DialogActions>
            <Button onClick={handleClose}>Zrušit</Button>
            <Button onClick={handleAdd}> {"Přidat"}</Button>
        </DialogActions>
    </Dialog>
}

export default AddLinkDialog