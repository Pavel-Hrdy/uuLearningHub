import Box from "@mui/material/Box/Box"
import { useParams } from 'react-router';
import { useState, useEffect } from "react";
import Grid from "@mui/material/Grid/Grid";
import Card from "@mui/material/Card/Card";
import CardContent from "@mui/material/CardContent/CardContent";
import Typography from "@mui/material/Typography/Typography";
import CardMedia from "@mui/material/CardMedia/CardMedia";
import Rating from "@mui/material/Rating/Rating";
import CardActionArea from "@mui/material/CardActionArea/CardActionArea";
import { useNavigate } from "react-router-dom";

const SubchapterDetail = () => {
    const { chapterId, subchapterId } = useParams();
    const [videos, setVideos] = useState([]);
    let navigate = useNavigate();
    const routeChange = (videoId) => {
        let path = `/video/${videoId}`;
        navigate(path);
    }

    useEffect(
        () => {
            const getDetails = async () => {
                const data = await fetch("http://localhost:5000/video/?chapter=" + chapterId + '-' + subchapterId);
                const finalData = await data.json();
                setVideos(finalData);
            }
            getDetails();
        }, [chapterId, subchapterId]
    )

    return <Grid container spacing={2}>
        {
            videos.map((video) => {
                return <Grid item xs={3} key={video.id}>
                    <Card elevation={4}>
                        <CardActionArea onClick={() => routeChange(video.id)}>
                            <CardMedia
                                component="img"
                                height="140"
                                image={`http://img.youtube.com/vi/${video.id}/0.jpg`}
                                alt="green iguana"
                            />
                            <CardContent>
                                <Typography gutterBottom variant="h5" component="div">
                                    {video.name}
                                </Typography>
                                <Box display="flex">
                                    <Rating readOnly
                                        name="read-only"
                                        value={video.rating}
                                        size="small"
                                    />
                                    {(
                                        <Box sx={{ ml: 1 }}>
                                            <Typography variant="body2">
                                                {video.numberOfRatings + ' hodnocení'}
                                            </Typography>
                                        </Box>
                                    )}
                                </Box>
                            </CardContent>
                        </CardActionArea>
                    </Card>
                </Grid>
            })
        }
    </Grid>;
}

export default SubchapterDetail