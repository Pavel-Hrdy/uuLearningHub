// @ts-nocheck
import Card from "@mui/material/Card/Card";
import CardContent from "@mui/material/CardContent/CardContent";
import Chip from "@mui/material/Chip/Chip";
import Grid from "@mui/material/Grid/Grid";
import Rating from "@mui/material/Rating/Rating";
import Typography from "@mui/material/Typography/Typography";
import React from "react";
import ReactPlayer from "react-player";
import { useParams } from 'react-router';
import { useState, useEffect, useContext } from "react";
import Box from "@mui/material/Box/Box";
import OpenInNewIcon from '@mui/icons-material/OpenInNew';
import IconButton from '@mui/material/IconButton';
import DeleteIcon from '@mui/icons-material/Delete';
import DeleteVideoDialog from "components/DeleteVideoDialog";
import EditIcon from '@mui/icons-material/Edit';
import AddVideoDialog from "components/AddVideoDialog";
import { GlobalContext } from "context/GlobalContext";
const VideoDetail = () => {

    const [rating, setRating] = useState(3);
    const [tags, setTags] = useState([]);
    const [links, setLinks] = useState([]);
    const [videoDetail, setVideoDetail] = useState({ "tags": [] });
    const { videoId } = useParams();
    const [isDeleteDialogActive, showDeleteDialog] = useState(false);
    const [isEditVideoDialogActive, showEditVideoDialog] = useState(false);
    const [refresh, setRefresh] = useState(false);
    const context = useContext(GlobalContext);

    const postRating = async (rating) => {
        await fetch('http://localhost:5000/video/rate', {
            method: 'POST',
            headers: {
                Accept: 'application/json',
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                id: videoDetail.id,
                rating: rating
            })
        });
        getVideoDetail();
    };

    const refreshCallback = () => {
        setRefresh(!refresh);
    }

    const getTagsAndLinks = async (videoData) => {
        const tags = videoData.tags;
        const links = videoData.links;

        const tagData = await fetch('http://localhost:5000/tag/list', {
            method: 'POST',
            headers: {
                Accept: 'application/json',
                'Content-Type': 'application/json'
            },
        });

        const linkData = await fetch('http://localhost:5000/link');

        const finalLinkData = await linkData.json();
        const finalTagData = await tagData.json();

        let returnTags = [];
        let returnLinks = [];

        tags.forEach(tag => {
            returnTags.push(
                finalTagData.find(
                    (element) => element["id"] === tag
                )
            )
        });

        links.forEach(link => {
            returnLinks.push(
                finalLinkData.find((element) => element["name"] === link)
            )
        });

        setLinks(returnLinks);
        setTags(returnTags);
    }

    const getVideoDetail = async () => {
        const data = await fetch(`http://localhost:5000/video/${videoId}`);
        const finalData = await data.json();
        setVideoDetail(finalData);

        getTagsAndLinks(finalData);
    }

    useEffect(
        () => {
            getVideoDetail();
            // eslint-disable-next-line
        }, [videoId, refresh]
    )

    const handleLinkClick = (url) => {
        window.open(url, "_blank")
    }


    return <Box>
        <Box display="flex">
            <Typography variant="h4" paddingBottom={2}>
                {videoDetail.name}
            </Typography>
            {context.adminMode ? <Box marginLeft="auto">
                <IconButton aria-label="edit" color="primary" onClick={() => showEditVideoDialog(true)}>
                    <EditIcon />
                </IconButton>
                <IconButton aria-label="delete" color="error" onClick={() => showDeleteDialog(true)}>
                    <DeleteIcon />
                </IconButton>
            </Box> : <Box />}
        </Box >
        <Card elevation={5}>
            <Box m={2}>
                <Grid item key="video-grid-item">
                    <ReactPlayer url={videoDetail.link}
                        width={1280}
                        height={720}
                        controls />
                </Grid>
                <Grid container spacing={1} maxWidth={1280} paddingTop={1}>
                    {
                        tags.map((tag, index) => {
                            return <Grid item key={tag["name"] + index}>
                                <Chip label={`#${tag["name"]}`} color="primary" />
                            </Grid>
                        })
                    }
                    {
                        links.map((link, index) => {
                            return <Grid item key={link["name"] + index}>
                                <Chip label={`${link["name"]}`} icon={<OpenInNewIcon />} onClick={() => handleLinkClick(link["link"])} color="success" />
                            </Grid>
                        })
                    }
                </Grid>
            </Box>
            <CardContent>
                <Typography variant="h5" fontWeight="bold" paddingBottom={1}>Popis</Typography>
                <Typography variant="body1" paddingBottom={4}>{videoDetail.description}</Typography>
                <Grid container spacing={2}>
                    <Grid item xs={2} key="video-detail-rating-title">
                        <Typography variant="h5" fontWeight="bold" paddingBottom={0.5}>Hodnocení</Typography>
                        <Typography>{`${parseFloat(videoDetail.rating).toFixed(2)} (${videoDetail.numberOfRatings} hodnocení)`}</Typography>
                    </Grid>
                    <Grid item xs={3} key="video-detail-rating">
                        <Typography variant="h5" fontWeight="bold">Ohodnoťte video</Typography>
                        <Rating
                            name="simple-controlled"
                            value={rating}
                            size="large"
                            onChange={(event, newValue) => {
                                postRating(newValue);
                                setRating(newValue);
                            }}
                        />
                    </Grid>
                </Grid>
            </CardContent>
        </Card>
        <DeleteVideoDialog videoId={videoId} open={isDeleteDialogActive} handleClose={() => {
            showDeleteDialog(false);
        }} />
        <AddVideoDialog reloadVideosCallback={refreshCallback} open={isEditVideoDialogActive} handleClose={() => showEditVideoDialog(false)} editedVideoDetail={{
            ...videoDetail,
            tags: tags,
            links: links
        }} />
    </Box >
}
export default VideoDetail