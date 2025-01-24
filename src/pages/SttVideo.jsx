import React, { useState } from 'react';

function VideoTranscription() {
  const [videoFile, setVideoFile] = useState(null);
  const [transcription, setTranscription] = useState('');
  const [translation, setTranslation] = useState('');
  const [loading, setLoading] = useState(false);

  const handleFileChange = (e) => {
    setVideoFile(e.target.files[0]);
  };

  const handleUpload = async (e) => {
    e.preventDefault();
    if (!videoFile) {
      alert('파일을 선택하세요!');
      return;
    }

    const formData = new FormData();
    formData.append('file', videoFile);

    setLoading(true);
    try {
      const response = await fetch('http://localhost:8000/stt-video', {
        method: 'POST',
        body: formData,
      });

      if (response.ok) {
        const result = await response.json();
        setTranscription(result.transcription); // 한글 대본
        setTranslation(result.translation); // 영어 번역 대본
      } else {
        const errorData = await response.json();
        alert(`업로드 실패: ${errorData.detail}`);
      }
    } catch (error) {
      console.error('Error uploading video:', error);
      alert('오류가 발생했습니다.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <h1>동영상 대본 추출</h1>
      <form onSubmit={handleUpload}>
        <input type="file" accept="video/*" onChange={handleFileChange} />
        <button type="submit" disabled={loading}>
          {loading ? '추출 중...' : '업로드 및 대본 추출'}
        </button>
      </form>
      {transcription && (
        <div>
          <h2>한글 대본 결과:</h2>
          <pre>{transcription}</pre>
        </div>
      )}
      {translation && (
        <div>
          <h2>영어 번역 결과:</h2>
          <pre>{translation}</pre>
        </div>
      )}
    </div>
  );
}

export default VideoTranscription;
