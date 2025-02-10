import React, { useState } from 'react';
import axios from 'axios';

const TTSGenerator = () => {
  const [voiceId, setVoiceId] = useState('');
  const [text, setText] = useState('');
  const [audioUrl, setAudioUrl] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleGenerateTTS = async () => {
    if (!voiceId || !text) {
      setError('⚠️ Voice ID와 텍스트를 입력해주세요.');
      return;
    }

    setLoading(true);
    setError(null);
    setAudioUrl(null);

    try {
      const response = await axios.post('http://localhost:8000/generate-tts', {
        voice_id: voiceId,
        text: text,
      });

      console.log('🔹 서버 응답:', response.data); // 서버 응답 로그 출력

      if (response.data.file_url) {
        setAudioUrl(`http://localhost:8000${response.data.file_url}`);
      } else {
        setError('❌ TTS 생성에 실패했습니다. (파일 URL 없음)');
      }
    } catch (err) {
      console.error('🔴 서버 오류 발생:', err); // 전체 오류 콘솔 출력

      if (err.response) {
        // 서버가 응답한 경우 (에러 코드 포함)
        console.error('📌 응답 상태 코드:', err.response.status);
        console.error('📌 응답 데이터:', err.response.data);
        setError(
          `❌ 서버 오류: ${err.response.status} - ${
            err.response.data.detail || '알 수 없는 오류'
          }`
        );
      } else if (err.request) {
        // 요청이 전송되었지만 응답이 없는 경우
        console.error('📌 요청 정보:', err.request);
        setError('❌ 서버 응답이 없습니다. 백엔드가 실행 중인지 확인하세요.');
      } else {
        // 기타 요청 설정 중 오류 발생
        console.error('📌 오류 메시지:', err.message);
        setError(`❌ 요청 중 오류 발생: ${err.message}`);
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ maxWidth: '500px', margin: 'auto', textAlign: 'center' }}>
      <h2>🎙️ TTS Generator</h2>
      <input
        type="text"
        placeholder="Voice ID 입력"
        value={voiceId}
        onChange={(e) => setVoiceId(e.target.value)}
        style={{
          width: '100%',
          padding: '10px',
          marginBottom: '10px',
          borderRadius: '5px',
          border: '1px solid #ccc',
        }}
      />
      <textarea
        placeholder="텍스트 입력"
        value={text}
        onChange={(e) => setText(e.target.value)}
        rows="4"
        style={{
          width: '100%',
          padding: '10px',
          marginBottom: '10px',
          borderRadius: '5px',
          border: '1px solid #ccc',
          resize: 'none',
        }}
      />
      <button
        onClick={handleGenerateTTS}
        style={{
          backgroundColor: '#007bff',
          color: '#fff',
          padding: '10px 20px',
          borderRadius: '5px',
          border: 'none',
          cursor: 'pointer',
        }}
        disabled={loading}
      >
        {loading ? '생성 중...' : 'TTS 생성'}
      </button>

      {error && <p style={{ color: 'red', marginTop: '10px' }}>{error}</p>}

      {audioUrl && (
        <div style={{ marginTop: '20px' }}>
          <h3>🎵 생성된 음성</h3>
          <audio controls src={audioUrl} style={{ width: '100%' }} />
        </div>
      )}
    </div>
  );
};

export default TTSGenerator;
