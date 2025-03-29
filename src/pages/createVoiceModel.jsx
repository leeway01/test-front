import React, { useState, useCallback } from 'react';
import { useDropzone } from 'react-dropzone';

function CreateVoiceCloneForm() {
  const [name, setName] = useState('');
  const [files, setFiles] = useState([]);
  const [description, setDescription] = useState('');
  const [message, setMessage] = useState('');

  // react-dropzone 파일 핸들러
  const onDrop = useCallback((acceptedFiles) => {
    // 기존 파일 배열에 추가 (여러 파일 선택 가능)
    setFiles((prev) => [...prev, ...acceptedFiles]);
  }, []);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: 'audio/*',
  });

  const handleSubmit = async (e) => {
    e.preventDefault();

    const formData = new FormData();
    formData.append('name', name);

    // 여러 파일 추가
    files.forEach((file) => {
      formData.append('files', file);
    });

    // remove_background_noise를 항상 true로 설정 (서버가 지원하는 경우)
    // 만약 서버 코드에 이 필드가 필요 없다면 제거해도 됩니다.
    formData.append('remove_background_noise', true);

    if (description) {
      formData.append('description', description);
    }

    try {
      const response = await fetch(
        'http://ec2-3-26-190-145.ap-southeast-2.compute.amazonaws.com:8001/create-voice-model',
        {
          method: 'POST',
          body: formData,
        }
      );

      if (!response.ok) {
        throw new Error(`Server responded with status: ${response.status}`);
      }

      const result = await response.json();
      // 서버 응답에 voice_id, db_id 등이 포함되어 있다고 가정
      setMessage(
        `Voice model created! voice_id: ${result.voice_id}, db_id: ${result.db_id}`
      );
    } catch (error) {
      console.error(error);
      setMessage(`Error: ${error.message}`);
    }
  };

  return (
    <div style={{ maxWidth: '600px', margin: '0 auto' }}>
      <h2>Create Voice Model</h2>
      <form onSubmit={handleSubmit}>
        {/* name (Required) */}
        <div style={{ marginBottom: '10px' }}>
          <label>Name (Required):</label>
          <br />
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
            style={{ width: '100%' }}
          />
        </div>

        {/* Drag & Drop 파일 입력 */}
        <div style={{ marginBottom: '10px' }}>
          <label>Upload Voice Samples (Required):</label>
          <div
            {...getRootProps()}
            style={{
              border: '2px dashed #ccc',
              padding: '20px',
              textAlign: 'center',
              cursor: 'pointer',
              backgroundColor: isDragActive ? '#e6f7ff' : '#fafafa',
            }}
          >
            <input {...getInputProps()} />
            {isDragActive ? (
              <p>Drop the files here ...</p>
            ) : (
              <p>Drag & drop some files here, or click to select files</p>
            )}
          </div>
          {files.length > 0 && (
            <div style={{ marginTop: '10px' }}>
              <strong>Selected files:</strong>
              <ul>
                {files.map((file, index) => (
                  <li key={index}>{file.name}</li>
                ))}
              </ul>
            </div>
          )}
        </div>

        {/* description (Optional) */}
        <div style={{ marginBottom: '10px' }}>
          <label>Description (Optional):</label>
          <br />
          <textarea
            rows={3}
            style={{ width: '100%' }}
            value={description}
            onChange={(e) => setDescription(e.target.value)}
          />
        </div>

        <button type="submit" style={{ marginTop: '10px' }}>
          Create Voice Model
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
