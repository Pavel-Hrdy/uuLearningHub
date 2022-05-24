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
import { useState, useEffect } from "react";
import Box from "@mui/material/Box/Box";




const VideoDetail = () => {
    const [rating, setRating] = useState(3);
    const [videoDetail, setVideoDetail] = useState({ "tags": [] });
    const { videoId } = useParams();

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
    const getVideoDetail = async () => {
        const data = await fetch(`http://localhost:5000/video/${videoId}`);
        const finalData = await data.json();
        setVideoDetail(finalData);
    }

    useEffect(
        () => {
            getVideoDetail();
            // eslint-disable-next-line
        }, [videoId]
    )

    return <Box>
        <Typography variant="h4" paddingBottom={2}>
            {videoDetail.name}
        </Typography>
        <Card elevation={5}>
            <Box m={2}>
                <ReactPlayer url={videoDetail.link}
                    width={1280}
                    height={720}
                    controls />
            </Box>
            <CardContent>
                <Typography variant="h5" fontWeight="bold" paddingBottom={1}>Popis</Typography>
                <Typography variant="body1" paddingBottom={4}>{videoDetail.description}</Typography>
                <Grid container spacing={2}>
                    <Grid item xs={2}>
                        <Typography variant="h5" fontWeight="bold" paddingBottom={0.5}>Hodnocení</Typography>
                        <Typography>{`${parseFloat(videoDetail.rating).toFixed(2)} (${videoDetail.numberOfRatings} hodnocení)`}</Typography>
                    </Grid>
                    <Grid item xs={3}>
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
                <Typography variant="h5" fontWeight="bold" paddingTop={2} paddingBottom={1}>Tagy</Typography>
                <Grid container spacing={1}>
                    {
                        videoDetail.tags.map((tag) => {
                            return <Grid item >
                                <Chip label={tag} color="primary" />
                            </Grid>
                        })
                    }

                </Grid>

            </CardContent>
        </Card>


    </Box >
}

export default VideoDetail