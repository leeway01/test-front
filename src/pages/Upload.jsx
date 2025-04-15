import React, { useState, useEffect } from 'react';

// 서버 URL을 BASE_URL 변수에 저장
const BASE_URL =
  'http://ec2-3-35-22-41.ap-northeast-2.compute.amazonaws.com:8000';

function VideoUpload() {
  const [videoFile, setVideoFile] = useState(null);
  const [sourceLanguage, setSourceLanguage] = useState('ko-KR');
  const [targetLanguage, setTargetLanguage] = useState('en-US');
  const [projectId, setProjectId] = useState(''); // 현재 선택된 프로젝트 ID
  const [responseMessage, setResponseMessage] = useState('');
  const [videoData, setVideoData] = useState(null); // 서버에서 반환된 JSON 데이터 저장

  useEffect(() => {
    const storedProjectId = localStorage.getItem('currentProjectId');
    if (storedProjectId) {
      setProjectId(storedProjectId);
    }
  }, []);

  const handleFileChange = (e) => {
    setVideoFile(e.target.files[0]);
  };

  const handleUpload = async (e) => {
    e.preventDefault();
    if (!videoFile) {
      alert('파일을 선택하세요!');
      return;
    }
    if (!projectId) {
      alert('현재 사용중인 프로젝트가 없습니다.');
      return;
    }

    const formData = new FormData();
    formData.append('file', videoFile);
    formData.append('source_language', sourceLanguage);
    formData.append('target_language', targetLanguage);
    formData.append('project_id', projectId); // 프로젝트 ID를 함께 전송

    try {
      // BASE_URL을 사용하여 업로드 엔드포인트 호출
      const uploadResponse = await fetch(`${BASE_URL}/upload-video`, {
        method: 'POST',
        body: formData,
        credentials: 'include', // HttpOnly 쿠키 전송
      });

      if (!uploadResponse.ok) {
        const errorData = await uploadResponse.json();
        setResponseMessage(`업로드 실패: ${errorData.detail}`);
        return;
      }

      const uploadResult = await uploadResponse.json();
      setResponseMessage('업로드 성공!');
      setVideoData(uploadResult); // 서버에서 반환된 JSON 저장
    } catch (error) {
      console.error('Error:', error);
      setResponseMessage('오류가 발생했습니다.');
    }
  };

  return (
    <div>
      <h1>동영상 업로드 및 JSON 데이터 보기</h1>
      <form onSubmit={handleUpload}>
        <div>
          <label>동영상 파일: </label>
          <input type="file" accept="video/*" onChange={handleFileChange} />
        </div>
        <div>
          <label>Source Language Code: </label>
          <input
            type="text"
            value={sourceLanguage}
            onChange={(e) => setSourceLanguage(e.target.value)}
          />
        </div>
        <div>
          <label>Target Language Code: </label>
          <input
            type="text"
            value={targetLanguage}
            onChange={(e) => setTargetLanguage(e.target.value)}
          />
        </div>
        <div>
          <strong>현재 사용중인 프로젝트 ID:</strong>{' '}
          {projectId || '선택된 프로젝트 없음'}
        </div>
        <button type="submit">업로드</button>
      </form>
      {responseMessage && <p>{responseMessage}</p>}

      {videoData && (
        <div>
          {videoData.timings && (
            <div>
              <h2>⏱️ 처리 시간</h2>
              <p>
                <strong>총 처리 시간:</strong>{' '}
                {(videoData.timings.overall_time ?? 0).toFixed(2)} 초
              </p>
              <h3>각 단계별 처리 시간</h3>
              <ul>
                <li>
                  <strong>업로드 시간:</strong>{' '}
                  {(videoData.timings.upload_time ?? 0).toFixed(2)} 초
                </li>
                <li>
                  <strong>오디오 추출 시간:</strong>{' '}
                  {(videoData.timings.audio_extraction_time ?? 0).toFixed(2)} 초
                </li>
                <li>
                  <strong>Spleeter 분리 시간:</strong>{' '}
                  {(videoData.timings.spleeter_time ?? 0).toFixed(2)} 초
                </li>
                <li>
                  <strong>DB 저장 시간:</strong>{' '}
                  {(videoData.timings.db_time ?? 0).toFixed(2)} 초
                </li>
                <li>
                  <strong>STT 처리 시간:</strong>{' '}
                  {(videoData.timings.stt_time ?? 0).toFixed(2)} 초
                </li>
                <li>
                  <strong>번역 처리 시간:</strong>{' '}
                  {(videoData.timings.translation_time ?? 0).toFixed(2)} 초
                </li>
                <li>
                  <strong>TTS 생성 시간:</strong>{' '}
                  {(videoData.timings.tts_time ?? 0).toFixed(2)} 초
                </li>
                <li>
                  <strong>최종 결과 조회 시간:</strong>{' '}
                  {(videoData.timings.get_time ?? 0).toFixed(2)} 초
                </li>
              </ul>
            </div>
          )}

          <h2>📌 비디오 정보</h2>
          <p>
            <strong>파일명:</strong> {videoData.video.file_name}
          </p>
          <p>
            <strong>파일 경로:</strong> {videoData.video.file_path}
          </p>
          <p>
            <strong>길이:</strong> {videoData.video.duration}초
          </p>

          <video controls width="600">
            <source
              src={`${BASE_URL}/videos/${videoData.video.file_name}`}
              type="video/mp4"
            />
            브라우저가 비디오 태그를 지원하지 않습니다.
          </video>

          <h2>🎼 배경음 정보</h2>
          {videoData.background_music.file_path ? (
            <>
              <p>
                <strong>파일 경로:</strong>{' '}
                {videoData.background_music.file_path}
              </p>
              <p>
                <strong>볼륨:</strong> {videoData.background_music.volume}
              </p>
              <audio controls>
                <source
                  src={`${BASE_URL}/extracted_audio/${videoData.background_music.file_path
                    .replace(/^extracted_audio[\\/]/, '')
                    .replace(/\\/g, '/')}`}
                  type="audio/mp3"
                />
              </audio>
            </>
          ) : (
            <p>배경음 없음</p>
          )}

          <h2>🎙️ TTS 트랙</h2>
          {videoData.tts_tracks.length > 0 ? (
            <ul>
              {videoData.tts_tracks.map((tts) => (
                <li key={tts.tts_id}>
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
                    <strong>번역 텍스트:</strong> {tts.translated_text}
                  </p>
                  <p>
                    <strong>원본 텍스트:</strong> {tts.original_text}
                  </p>
                  <p>
                    <strong>화자:</strong> {tts.speaker}
                  </p>
                  <audio controls>
                    <source
                      src={`${BASE_URL}/extracted_audio/${tts.file_path
                        .replace(/^extracted_audio[\\/]/, '')
                        .replace(/\\/g, '/')}`}
                      type="audio/mp3"
                    />
                  </audio>
                </li>
              ))}
            </ul>
          ) : (
            <p>TTS 트랙 없음</p>
          )}
        </div>
      )}
    </div>
  );
}

export default VideoUpload;
