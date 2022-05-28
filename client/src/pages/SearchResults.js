import Box from "@mui/material/Box/Box"
import { useState, useEffect } from "react";
import Grid from "@mui/material/Grid/Grid";
import Card from "@mui/material/Card/Card";
import CardContent from "@mui/material/CardContent/CardContent";
import Typography from "@mui/material/Typography/Typography";
import CardMedia from "@mui/material/CardMedia/CardMedia";
import Rating from "@mui/material/Rating/Rating";
import CardActionArea from "@mui/material/CardActionArea/CardActionArea";
import { useNavigate, useSearchParams } from "react-router-dom";


const SearchResults = () => {
    const navigate = useNavigate();
    const [videos, setVideos] = useState([]);
    const [searchParams] = useSearchParams();

    const query = searchParams.get('query');
    const isTag = searchParams.get('isTag');
    useEffect(
        () => {
            fetchVideos()
            // eslint-disable-next-line
        }, [searchParams]
    )

    const fetchVideos = async () => {
        let result;
        if (isTag === '1') {
            result = await fetch(`http://localhost:5000/video/?tag=${query}`);
        } else {
            result = await fetch(`http://localhost:5000/video/?fulltext=${query}`);
        }
        const finalData = await result.json();

        if (result.status === 200) {
            setVideos(finalData);
        } else {
            setVideos([])
        }
    }


    const routeChange = (videoId, chapterId, subchapterId) => {
        let path = `/chapter/${chapterId}/${subchapterId}/video/${videoId}`;
        navigate(path);
    }

    return <Box>
        <Typography paddingBottom={3} variant="h4">{`Výsledky vyhledávání - "${isTag === '1' ? "#" : ""}${query}"`}</Typography>
        {videos.length === 0 ? <Typography paddingBottom={3} variant="h5">Nic nebylo nalezeno</Typography> : <Box />}
        <Grid container spacing={2}>
            {
                videos.map((video) => {
                    return <Grid item xs={3} key={video.id}>
                        <Card elevation={4}>
                            <CardActionArea onClick={() => routeChange(video.id, video.chapterSchema.chapterOrderNumber, video.chapterSchema.subchapterOrderNumber)}>
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
        </Grid>
    </Box>
};

export default SearchResults