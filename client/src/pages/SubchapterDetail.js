// @ts-nocheck
import Box from "@mui/material/Box/Box"
import { useParams } from 'react-router';
import { useState, useEffect, useContext } from "react";
import Grid from "@mui/material/Grid/Grid";
import { useNavigate } from "react-router-dom";
import Fab from "@mui/material/Fab/Fab";
import AddIcon from '@mui/icons-material/Add';
import { GlobalContext } from "context/GlobalContext";
import AddVideoDialog from "components/AddVideoDialog";
import VideoTile from "components/VideoTile";

const SubchapterDetail = () => {
    const { chapterId, subchapterId } = useParams();
    const [videos, setVideos] = useState([]);
    const [openAddVideoDailog, setOpenAddVideoDialog] = useState(false);
    const [reloadVideos, setReloadVideos] = useState(false);
    const context = useContext(GlobalContext);

    const handleClickOpenAddVideoDialog = () => {
        setOpenAddVideoDialog(true);
    };

    const handleCloseAddVideoDialog = () => {
        setOpenAddVideoDialog(false);
    };
    let navigate = useNavigate();
    const routeChange = (videoId) => {
        let path = `video/${videoId}`;
        navigate(path);
    }

    const reloadVideosCallback = () => {
        setReloadVideos(!reloadVideos);
    }

    useEffect(
        () => {
            const getDetails = async () => {
                const data = await fetch("http://localhost:5000/video/?chapter=" + chapterId + '-' + subchapterId);
                const finalData = await data.json();
                setVideos(finalData);
            }
            getDetails();
        }, [chapterId, subchapterId, reloadVideos]
    )

    const fabStyle = {
        right: 20,
        bottom: 20,
        position: 'fixed'
    };


    return <Box><Grid container spacing={2}>
        {
            videos.map((video) => {
                return <VideoTile video={video} onClick={() => routeChange(video.id)} />
            })
        }
    </Grid>
        {context.adminMode ? <Fab color="primary" aria-label="add" style={fabStyle} onClick={handleClickOpenAddVideoDialog}>
            <AddIcon />
        </Fab> : <Box />}
        <AddVideoDialog reloadVideosCallback={reloadVideosCallback} chapterId={chapterId} subchapterId={subchapterId} open={openAddVideoDailog} handleClose={() => handleCloseAddVideoDialog()} />
    </Box>;
}



export default SubchapterDetail