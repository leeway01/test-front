import React, { useState } from 'react';

function VideoUpload() {
  const [videoFile, setVideoFile] = useState(null);
  const [responseMessage, setResponseMessage] = useState('');

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

    try {
      const response = await fetch('http://localhost:8000/upload-video', {
        method: 'POST',
        body: formData,
      });

      if (response.ok) {
        const result = await response.json();
        setResponseMessage(`업로드 성공: ${result.message}`);
      } else {
        const errorData = await response.json();
        setResponseMessage(`업로드 실패: ${errorData.detail}`);
      }
    } catch (error) {
      console.error('Error uploading video:', error);
      setResponseMessage('오류가 발생했습니다.');
    }
  };

  return (
    <div>
      <h1>동영상 업로드</h1>
      <form onSubmit={handleUpload}>
        <input type="file" accept="video/*" onChange={handleFileChange} />
        <button type="submit">업로드</button>
      </form>
      {responseMessage && <p>{responseMessage}</p>}
    </div>
  );
}

export default VideoUpload;
