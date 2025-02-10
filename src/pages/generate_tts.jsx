import React, { useState } from 'react';
import axios from 'axios';

const TTSGenerator = () => {
  const [ttsId, setTtsId] = useState(''); // 기존 TTS ID (수정할 경우 입력)
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
      const requestData = {
        voice_id: voiceId,
        text: text,
      };

      // tts_id가 있으면 추가
      if (ttsId.trim() !== '') {
        requestData.tts_id = parseInt(ttsId, 10);
      }

      console.log('📤 요청 데이터:', requestData);

      const response = await axios.post(
        'http://localhost:8000/generate-tts',
        requestData
      );

      console.log('🔹 서버 응답:', response.data);

      if (response.data.file_url) {
        setAudioUrl(`http://localhost:8000${response.data.file_url}`);
      } else {
        setError('❌ TTS 생성에 실패했습니다. (파일 URL 없음)');
      }
    } catch (err) {
      console.error('🔴 서버 오류 발생:', err);

      if (err.response) {
        console.error('📌 응답 상태 코드:', err.response.status);
        console.error('📌 응답 데이터:', err.response.data);
        setError(
          `❌ 서버 오류: ${err.response.status} - ${
            err.response.data.detail || '알 수 없는 오류'
          }`
        );
      } else if (err.request) {
        console.error('📌 요청 정보:', err.request);
        setError('❌ 서버 응답이 없습니다. 백엔드가 실행 중인지 확인하세요.');
      } else {
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
        placeholder="(선택) 기존 TTS ID 입력"
        value={ttsId}
        onChange={(e) => setTtsId(e.target.value)}
        style={{
          width: '100%',
          padding: '10px',
          marginBottom: '10px',
          borderRadius: '5px',
          border: '1px solid #ccc',
        }}
      />

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
