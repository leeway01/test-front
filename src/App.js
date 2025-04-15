import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Home from './pages/Home';
import SignUp from './pages/SignUp';
import Header from './components/Header';
import Upload from './pages/Upload';
import Stt from './pages/SttVideo';
import Generated from './pages/generate_tts';
import CreateVoice from './pages/createVoiceModel';
import Audio from './pages/audio';
import Translate from './pages/translate';
import FileList from './pages/FileList';
import FileDetails from './pages/FileDetails';
import Project from './pages/Project';
import ProjectInfor from './pages/ProjectInfor'; // 수정된 상세 페이지 컴포넌트
import UserFileManage from './pages/UserFilemanage';
import App2 from './pages/App';

function App() {
  return (
    <BrowserRouter>
      <Header />
      <Routes>
        <Route path="/home" element={<Home />} />
        <Route path="/signup" element={<SignUp />} />
        <Route path="/upload" element={<Upload />} />
        <Route path="/stt" element={<Stt />} />
        <Route path="/generated" element={<Generated />} />
        <Route path="/createvoice" element={<CreateVoice />} />
        <Route path="/audio" element={<Audio />} />
        <Route path="/translate" element={<Translate />} />
        <Route path="/filelist" element={<FileList />} />
        <Route path="/file-details" element={<FileDetails />} />
        <Route path="/project" element={<Project />} />
        {/* 프로젝트 카드를 클릭하면 /editor/:projectId 경로로 이동하도록 */}
        <Route path="/editor/:projectId" element={<ProjectInfor />} />
        <Route path="/userfilemanage" element={<UserFileManage />} />
        <Route path="/" element={<App2 />} />
        <Route path="*" element={<h2>404 Not Found</h2>} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
