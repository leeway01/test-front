import React from 'react';
import { Link } from 'react-router-dom';

function Header() {
  return (
    <header style={{ padding: '10px', backgroundColor: '#eee' }}>
      <nav>
        <Link to="/">홈</Link> | <Link to="/signup">회원가입</Link> |{' '}
        <Link to="/upload">파일 업로드</Link> | <Link to="/stt">대본 추출</Link>{' '}
        | <Link to="/generated">tts 제작</Link> |{' '}
        <Link to="/createvoice">음성 모델 제작</Link> |{' '}
        <Link to="/audio">Audio</Link> | <Link to="/translate">번역</Link> |{' '}
        <Link to="/filelist">파일 관리</Link> |{' '}
        <Link to="/project">프로젝트</Link> |{' '}
        <Link to="/userfilemanage">유저파일관리</Link>
      </nav>
    </header>
  );
}

export default Header;
