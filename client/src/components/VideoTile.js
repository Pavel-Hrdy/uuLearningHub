import Box from "@mui/material/Box/Box"
import Card from "@mui/material/Card/Card"
import CardActionArea from "@mui/material/CardActionArea/CardActionArea"
import CardContent from "@mui/material/CardContent/CardContent"
import CardMedia from "@mui/material/CardMedia/CardMedia"
import Grid from "@mui/material/Grid/Grid"
import Rating from "@mui/material/Rating/Rating"
import Typography from "@mui/material/Typography/Typography"
import { useContext } from "react";
import { GlobalContext } from "context/GlobalContext";


const VideoTile = ({ video, onClick }) => {
    const context = useContext(GlobalContext);

    return video.state === "active" || context.adminMode ?
        <Grid item xs={3} key={video.id}>
            <Card elevation={4}>
                <CardActionArea onClick={onClick}>
                    <CardMedia
                        component="img"
                        height="140"
                        image={`http://img.youtube.com/vi/${video.id}/0.jpg`}
                        alt="green iguana"
                    />
                    <CardContent style={{ backgroundColor: video.state === "active" ? "white" : "lightGrey" }}>
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
        </Grid> : null
}

export default VideoTile