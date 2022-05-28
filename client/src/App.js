import Box from '@mui/material/Box/Box';
import CssBaseline from '@mui/material/CssBaseline/CssBaseline';
import Toolbar from '@mui/material/Toolbar/Toolbar';
import CustomAppBar from 'components/CustomAppBar';
import SubchapterDetail from 'pages/SubchapterDetail';
import VideoDetail from 'pages/VideoDetail';
import Home from 'pages/Home';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import './App.css';
import CustomDrawer from './components/CustomDrawer';
import { GlobalProvider } from "./context/GlobalContext";
import SearchResults from 'pages/SearchResults';

const App = () =>

  <Box sx={{ display: 'flex' }}>
    <GlobalProvider>
      <BrowserRouter>
        <CssBaseline />
        <CustomAppBar />
        <CustomDrawer />
        <Box component="main" sx={{ flexGrow: 1, p: 3 }}>
          <Toolbar />
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/chapter/:chapterId/:subchapterId" element={<SubchapterDetail />} />
            <Route path="/chapter/:chapterId/:subchapterId/video/:videoId" element={<VideoDetail />} />
            <Route path="/search/" element={<SearchResults />} />
          </Routes>
        </Box>
      </BrowserRouter >
    </GlobalProvider>
  </Box>


export default App;
