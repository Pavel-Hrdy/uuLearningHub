import Box from "@mui/material/Box/Box"
import { useState, useEffect } from "react";
import Grid from "@mui/material/Grid/Grid";
import Typography from "@mui/material/Typography/Typography";
import { useNavigate, useSearchParams } from "react-router-dom";
import VideoTile from "components/VideoTile";


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
                    return <VideoTile video={video} onClick={() => routeChange(video.id, video.chapterSchema.chapterOrderNumber, video.chapterSchema.subchapterOrderNumber)} />
                })
            }
        </Grid>
    </Box>
};

export default SearchResults