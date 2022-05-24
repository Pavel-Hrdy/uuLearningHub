import Card from "@mui/material/Card/Card";
import CardContent from "@mui/material/CardContent/CardContent";
import Chip from "@mui/material/Chip/Chip";
import Grid from "@mui/material/Grid/Grid";
import Rating from "@mui/material/Rating/Rating";
import Typography from "@mui/material/Typography/Typography";
import React from "react";
import ReactPlayer from "react-player";

const { default: Box } = require("@mui/material/Box/Box");



const SubchapterDetail = () => {

    const [value, setValue] = React.useState(2);

    return <Box>
        <Typography variant="h4" paddingBottom={2}>
            JavaScript I.
        </Typography>

        <Card elevation={5}>
            <Box m={2}>
                <ReactPlayer url="https://www.youtube.com/watch?v=BwuLxPH8IDs"
                    width={1280}
                    height={720}
                    controls />
            </Box>

            <CardContent>
                <Grid container spacing={2}>
                    <Grid item xs={2}>
                        <Typography variant="h5" fontWeight="bold" paddingBottom={0.5}>Hodnocení:</Typography>
                        <Typography>4,5 (850 hodnocení)</Typography>
                    </Grid>
                    <Grid item xs={3}>
                        <Typography variant="h5" fontWeight="bold">Ohodnoťte video</Typography>
                        <Rating
                            name="simple-controlled"
                            value={value}
                            size="large"
                            onChange={(event, newValue) => {
                                setValue(newValue);
                            }}
                        />
                    </Grid>
                </Grid>
                <Typography variant="h5" fontWeight="bold" paddingTop={2} paddingBottom={1}>Tagy</Typography>
                <Grid container spacing={1}>
                    <Grid item >
                        <Chip label="Programování" color="primary" />
                    </Grid>
                    <Grid item>
                        <Chip label="Zábava" color="primary" />
                    </Grid>
                </Grid>

            </CardContent>
        </Card>


    </Box >
}

export default SubchapterDetail