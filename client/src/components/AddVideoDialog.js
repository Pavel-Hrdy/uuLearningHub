import * as React from 'react';
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogTitle from '@mui/material/DialogTitle';
import { useState, useEffect } from "react";
import Autocomplete from '@mui/material/Autocomplete/Autocomplete';
import Box from '@mui/material/Box/Box';
import OpenInNewIcon from '@mui/icons-material/OpenInNew';
import Chip from '@mui/material/Chip/Chip';
import Alert from '@mui/material/Alert/Alert';

const AddVideoDialog = ({ open, handleClose, chapterId, subchapterId, reloadVideosCallback }) => {
    const [videoInfo, setVideoInfo] = useState({
        "name": "",
        "url": "",
        "description": "",
        "tags": [],
        "links": [],
    });

    const [subchapterName, setSubchapterName] = useState("");
    const [tags, setTags] = useState([])
    const [links, setLinks] = useState([])
    const [errorMessage, setErrorMessage] = useState("")

    const addTags = async () => {
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

    const fetchSubchapterName = async () => {
        const linkData = await fetch(`http://localhost:5000/chapter/${chapterId}-${subchapterId}`);
        const finalData = await linkData.json();
        setSubchapterName(finalData.name);
    }

    const handleAddingVideo = async () => {
        const result = await fetch('http://localhost:5000/video/create', {
            method: 'POST',
            headers: {
                Accept: 'application/json',
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                name: videoInfo["name"],
                link: videoInfo["url"],
                description: videoInfo["description"],
                tags: videoInfo["tags"].map((tag) => tag.id),
                links: videoInfo["links"].map((link) => link.name),
                chapterSchema: {
                    chapterOrderNumber: chapterId,
                    subchapterOrderNumber: subchapterId
                },
                state: "active"
            })
        });
        const finalData = await result.json();
        if (finalData["error"]) {
            setErrorMessage(finalData.error)
        } else {
            handleClose();
            reloadVideosCallback();
        }
    }

    const addLinks = async () => {
        const linkData = await fetch('http://localhost:5000/link');
        const finalData = await linkData.json();
        setLinks(finalData);
    }

    useEffect(
        () => {
            addTags();
            addLinks();
            fetchSubchapterName();
            setErrorMessage("");
            // eslint-disable-next-line
        }, [open]
    )

    const handleValueChange = (propName, value) => {
        setVideoInfo(
            {
                ...videoInfo,
                [propName]: value
            }
        )

    }

    const handleAddingTag = (tags) => {
        setVideoInfo({
            ...videoInfo,
            "tags": tags
        })
    }

    const handleAddingLink = (links) => {
        setVideoInfo({
            ...videoInfo,
            "links": links
        })
    }

    return (
        <div>
            <Dialog open={open} onClose={handleClose} fullWidth>
                <DialogTitle>{`Přidání videa do podkapitoly "${subchapterName}"`}</DialogTitle>
                <DialogContent>
                    <TextField
                        autoFocus
                        margin="dense"
                        id="video-name"
                        label="Název videa"
                        fullWidth
                        variant="standard"
                        onChange={(e) => handleValueChange("name", e.target.value)}
                    />

                    <TextField
                        autoFocus
                        margin="dense"
                        id="video-url"
                        label="URL"
                        fullWidth
                        variant="standard"
                        onChange={(e) => handleValueChange("url", e.target.value)}
                    />
                    <TextField
                        id="video-description"
                        label="Popis"
                        multiline
                        rows={3}
                        margin="dense"
                        fullWidth
                        variant="standard"
                        onChange={(e) => handleValueChange("description", e.target.value)}
                    />
                    <Box paddingTop={2} paddingBottom={2}>
                        <Autocomplete
                            multiple
                            id="combo-box-tags"
                            options={tags}
                            defaultValue={[]}
                            getOptionLabel={(option) => option.name}
                            filterSelectedOptions
                            onChange={(e, newValue) => handleAddingTag(newValue)}
                            renderInput={(params) => (
                                <TextField
                                    {...params}
                                    label="Tagy"

                                />
                            )}
                            noOptionsText="Žádné výsledky"
                            renderTags={(tagValue, getTagProps) => {
                                return tagValue.map((option, index) => (
                                    <Chip {...getTagProps({ index })} label={`#${option.name}`} color="primary" />
                                ));
                            }}
                        />
                    </Box>
                    <Autocomplete
                        multiple
                        id="combo-box-links"
                        options={links}
                        getOptionLabel={(option) => option.name}
                        defaultValue={[]}
                        onChange={(e, newValue) => handleAddingLink(newValue)}
                        noOptionsText="Žádné výsledky"
                        filterSelectedOptions
                        renderTags={(tagValue, getTagProps) => {
                            return tagValue.map((option, index) => (
                                <Chip {...getTagProps({ index })} label={`${option.name}`} color="success" icon={<OpenInNewIcon />} />
                            ));
                        }}
                        renderInput={(params) => (
                            <TextField
                                {...params}
                                label="Linky"

                            />
                        )}
                    />
                    {errorMessage === "" ? <Box /> : <Box paddingTop={2}><Alert severity="error">{errorMessage}</Alert></Box>}
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleClose}>Zrušit</Button>
                    <Button onClick={handleAddingVideo}>Přidat</Button>
                </DialogActions>
            </Dialog>
        </div>
    );
}

export default AddVideoDialog
