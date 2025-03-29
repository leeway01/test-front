import React, { useState } from 'react';

function CreateVoiceCloneForm() {
  // 폼 상태값
  const [name, setName] = useState('');
  const [files, setFiles] = useState([]);
  const [removeBackgroundNoise, setRemoveBackgroundNoise] = useState(false);
  const [description, setDescription] = useState('');
  const [labels, setLabels] = useState('');
  const [message, setMessage] = useState('');

  // 파일 변경 핸들러
  const handleFileChange = (e) => {
    setFiles(e.target.files);
  };

  // 폼 제출 핸들러
  const handleSubmit = async (e) => {
    e.preventDefault();

    // multipart/form-data 생성
    const formData = new FormData();
    formData.append('name', name);

    // 여러 파일 업로드
    for (let i = 0; i < files.length; i++) {
      formData.append('files', files[i]);
    }

    // boolean은 문자열로 전송 가능 (서버에서 bool로 처리)
    formData.append('remove_background_noise', removeBackgroundNoise);

    if (description) {
      formData.append('description', description);
    }

    if (labels) {
      formData.append('labels', labels);
    }

    try {
      // 서버에 전송 (예: http://localhost:8000/create-voice-clone)
      const response = await fetch('/create-voice-clone', {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) {
        throw new Error(`Server responded with status: ${response.status}`);
      }

      const result = await response.json();
      setMessage(
        `Voice clone created! voice_id: ${result.voice_id}, requires_verification: ${result.requires_verification}`
      );
    } catch (error) {
      console.error(error);
      setMessage(`Error: ${error.message}`);
    }
  };

  return (
    <div style={{ maxWidth: '600px', margin: '0 auto' }}>
      <h2>Create Voice Clone</h2>
      <form onSubmit={handleSubmit}>
        {/* name (string, Required) */}
        <div style={{ marginBottom: '10px' }}>
          <label>name (Required):</label>
          <br />
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
            style={{ width: '100%' }}
          />
        </div>

        {/* files (multiple) */}
        <div style={{ marginBottom: '10px' }}>
          <label>Upload Voice Samples (Required):</label>
          <br />
          <input
            type="file"
            accept="audio/*"
            multiple
            onChange={handleFileChange}
          />
        </div>

        {/* remove_background_noise (boolean) */}
        <div style={{ marginBottom: '10px' }}>
          <label>remove_background_noise:</label>
          <br />
          <input
            type="checkbox"
            checked={removeBackgroundNoise}
            onChange={(e) => setRemoveBackgroundNoise(e.target.checked)}
          />
          <span style={{ marginLeft: '5px' }}>
            {removeBackgroundNoise ? 'true' : 'false'}
          </span>
        </div>

        {/* description (string, Optional) */}
        <div style={{ marginBottom: '10px' }}>
          <label>description (Optional):</label>
          <br />
          <textarea
            rows={3}
            style={{ width: '100%' }}
            value={description}
            onChange={(e) => setDescription(e.target.value)}
          />
        </div>

        {/* labels (string, Optional) */}
        <div style={{ marginBottom: '10px' }}>
          <label>labels (Optional):</label>
          <br />
          <textarea
            rows={2}
            style={{ width: '100%' }}
            value={labels}
            onChange={(e) => setLabels(e.target.value)}
            placeholder='{"key":"value"} 형태의 직렬화된 JSON 등'
          />
        </div>

        <button type="submit" style={{ marginTop: '10px' }}>
          Create Voice Clone
        </button>
      </form>

      {message && (
        <div style={{ marginTop: '20px', color: 'blue' }}>
          <strong>{message}</strong>
        </div>
      )}
    </div>
  );
}

export default CreateVoiceCloneForm;
