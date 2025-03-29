import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';

const BASE_URL = 'http://localhost:8000';

function ProjectEditDataPage() {
  const { projectId } = useParams();
  const [videosData, setVideosData] = useState([]);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchEditData = async () => {
      try {
        // 반드시 "/videos/edit_data" 경로로 요청
        const response = await fetch(
          `${BASE_URL}/projects/${projectId}/videos/edit_data`,
          {
            credentials: 'include',
          }
        );
        if (!response.ok) {
          const data = await response.json();
          setError(data.detail || '데이터를 불러오는 중 오류가 발생했습니다.');
          return;
        }
        const data = await response.json();
        // "videos": [ { "video": {...}, "background_music": {...}, "tts_tracks": [...], "get_time": ... }, ... ]
        setVideosData(data.videos || []);
      } catch (err) {
        setError('네트워크 에러가 발생했습니다.');
      }
    };

    fetchEditData();
  }, [projectId]);

  if (error) {
    return <div>{error}</div>;
  }

  if (videosData.length === 0) {
    return <div>해당 프로젝트에 등록된 영상이 없습니다.</div>;
  }

  return (
    <div style={{ padding: '20px' }}>
      <h1>프로젝트 영상 정보</h1>
      {videosData.map((videoInfo, idx) => (
        <div
          key={idx}
          style={{
            border: '1px solid #ccc',
            padding: '10px',
            marginBottom: '10px',
          }}
        >
          <h2>📌 비디오 정보</h2>
          <p>
            <strong>파일명:</strong> {videoInfo.video.file_name}
          </p>
          <p>
            <strong>경로:</strong> {videoInfo.video.file_path}
          </p>
          <p>
            <strong>길이:</strong> {videoInfo.video.duration} 초
          </p>
          <video width="400" controls>
            <source
              src={`${BASE_URL}/videos/${videoInfo.video.file_name}`}
              type="video/mp4"
            />
          </video>

          <h3>배경음</h3>
          <p>
            <strong>파일 경로:</strong>{' '}
            {videoInfo.background_music.file_path || '없음'}
          </p>
          <p>
            <strong>볼륨:</strong> {videoInfo.background_music.volume}
          </p>

          <h3>TTS 트랙</h3>
          {videoInfo.tts_tracks.length > 0 ? (
            videoInfo.tts_tracks.map((tts) => (
              <div key={tts.tts_id} style={{ marginBottom: '10px' }}>
                <p>
                  <strong>파일 경로:</strong> {tts.file_path}
                </p>
                <p>
                  <strong>시작 시간:</strong> {tts.start_time}초
                </p>
                <p>
                  <strong>길이:</strong> {tts.duration}초
                </p>
                <p>
                  <strong>목소리:</strong> {tts.voice}
                </p>
                <p>
                  <strong>화자:</strong> {tts.speaker}
                </p>
                <p>
                  <strong>원본 텍스트:</strong> {tts.original_text}
                </p>
                <p>
                  <strong>번역 텍스트:</strong> {tts.translated_text}
                </p>
                <audio controls>
                  <source
                    src={`${BASE_URL}/extracted_audio/${tts.file_path.replace(
                      /^extracted_audio[\\/]/,
                      ''
                    )}`}
                    type="audio/mp3"
                  />
                </audio>
              </div>
            ))
          ) : (
            <p>TTS 트랙 없음</p>
          )}
          <hr />
          <p>
            <strong>데이터 조회 시간:</strong> {videoInfo.get_time.toFixed(2)}초
          </p>
        </div>
      ))}
    </div>
  );
}

export default ProjectEditDataPage;
