import React, { useState } from 'react';
import axios from 'axios';

const CreateVoiceModel = () => {
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [file, setFile] = useState(null);
  const [voiceId, setVoiceId] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleFileChange = (event) => {
    setFile(event.target.files[0]);
  };

  const handleCreateModel = async () => {
    if (!name || !description || !file) {
      setError('모든 필드를 입력하세요.');
      return;
    }

    setLoading(true);
    setError('');

    const formData = new FormData();
    formData.append('name', name);
    formData.append('description', description);
    formData.append('file', file);

    try {
      const response = await axios.post(
        'http://localhost:8001/create-voice-model',
        formData,
        {
          headers: { 'Content-Type': 'multipart/form-data' },
        }
      );

      console.log('✅ 서버 응답:', response.data);
      setVoiceId(response.data.voice_id);
    } catch (err) {
      console.error('❌ 서버 오류 발생:', err);

      if (err.response) {
        console.error('📌 응답 상태 코드:', err.response.status);
        console.error('📌 응답 데이터:', err.response.data);
        setError(`서버 오류: ${err.response.data.detail || '알 수 없는 오류'}`);
      } else {
        setError('서버 응답이 없습니다. 백엔드가 실행 중인지 확인하세요.');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <h2>🎙️ 보이스 모델 생성</h2>
      <input
        type="text"
        placeholder="모델 이름"
        value={name}
        onChange={(e) => setName(e.target.value)}
      />
      <input
        type="text"
        placeholder="설명"
        value={description}
        onChange={(e) => setDescription(e.target.value)}
      />
      <input type="file" onChange={handleFileChange} />
      <button onClick={handleCreateModel} disabled={loading}>
        {loading ? '생성 중...' : '모델 생성'}
      </button>
      {error && <p style={{ color: 'red' }}>{error}</p>}
      {voiceId && <p>✅ 생성된 Voice ID: {voiceId}</p>}
    </div>
  );
};

export default CreateVoiceModel;
