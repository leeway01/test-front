import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Home from './pages/Home';
import SignUp from './pages/SignUp';
import Header from './components/Header';
import Upload from './pages/Upload';
import Stt from './pages/SttVideo';
import Generated from './pages/generate_tts';

function App() {
  return (
    <BrowserRouter>
      {/* 공통 레이아웃 예: Header */}
      <Header />

      {/* 라우트 설정 */}
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/signup" element={<SignUp />} />
        <Route path="/upload" element={<Upload />} />
        <Route path="/stt" element={<Stt />} />
        <Route path="/generated" element={<Generated />} />
        {/* 404 대응 */}
        <Route path="*" element={<h2>404 Not Found</h2>} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
