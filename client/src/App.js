import Box from '@mui/material/Box/Box';
import CssBaseline from '@mui/material/CssBaseline/CssBaseline';
import Toolbar from '@mui/material/Toolbar/Toolbar';
import ChapterDetail from 'pages/ChapterDetail';
import CustomAppBar from 'components/CustomAppBar';
import SubchapterDetail from 'pages/SubchapterDetail';
import VideoDetail from 'pages/VideoDetail';
import Home from 'pages/Home';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import './App.css';
import CustomDrawer from './components/CustomDrawer';

const App = () =>

  <Box sx={{ display: 'flex' }}>
    <BrowserRouter>
      <CssBaseline />
      <CustomAppBar />
      <CustomDrawer />
      <Box component="main" sx={{ flexGrow: 1, p: 3 }}>
        <Toolbar />
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/chapter/:chapterId" element={<ChapterDetail />} />
          <Route path="/chapter/:chapterId/:subchapterId" element={<SubchapterDetail />} />
          <Route path="/chapter/:chapterId/:subchapterId/video/:videoId" element={<VideoDetail />} />
        </Routes>
      </Box>
    </BrowserRouter >
  </Box>


export default App;
