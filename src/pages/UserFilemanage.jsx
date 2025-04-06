import React, { useState, useEffect } from 'react';

const BASE_URL = 'http://localhost:8000';

const UserFileManager = () => {
  const [selectedFile, setSelectedFile] = useState(null);
  const [files, setFiles] = useState([]);
  const [uploadMessage, setUploadMessage] = useState('');
  const [deleteMessage, setDeleteMessage] = useState('');
  const [expandedIndex, setExpandedIndex] = useState(null);

  const handleFileChange = (e) => {
    setSelectedFile(e.target.files[0]);
  };

  const handleUpload = async (e) => {
    e.preventDefault();
    if (!selectedFile) {
      alert('파일을 선택하세요!');
      return;
    }
    const formData = new FormData();
    formData.append('file', selectedFile);
    try {
      const response = await fetch(`${BASE_URL}/upload-file`, {
        method: 'POST',
        body: formData,
        credentials: 'include',
      });
      const data = await response.json();
      if (!response.ok) {
        setUploadMessage(`업로드 실패: ${data.detail}`);
      } else {
        setUploadMessage('파일 업로드 성공!');
        fetchFiles();
      }
    } catch (err) {
      setUploadMessage('네트워크 오류 발생');
    }
  };

  const fetchFiles = async () => {
    try {
      const response = await fetch(`${BASE_URL}/user-files`, {
        method: 'GET',
        credentials: 'include',
      });
      const data = await response.json();
      if (!response.ok) {
        console.error(data.detail);
      } else {
        setFiles(data.files);
      }
    } catch (err) {
      console.error('네트워크 오류 발생');
    }
  };

  const handleDelete = async (fileName) => {
    if (!window.confirm(`"${fileName}" 파일을 삭제하시겠습니까?`)) return;
    try {
      const response = await fetch(
        `${BASE_URL}/user-files?file=${encodeURIComponent(fileName)}`,
        {
          method: 'DELETE',
          credentials: 'include',
        }
      );
      const data = await response.json();
      if (!response.ok) {
        setDeleteMessage(`삭제 실패: ${data.detail}`);
      } else {
        setDeleteMessage('파일 삭제 성공!');
        fetchFiles();
      }
    } catch (err) {
      setDeleteMessage('네트워크 오류 발생');
    }
  };

  const handleDownload = async (fileName) => {
    try {
      const response = await fetch(
        `${BASE_URL}/download-file?file_name=${encodeURIComponent(fileName)}`,
        {
          method: 'GET',
          credentials: 'include',
        }
      );
      if (!response.ok) {
        throw new Error('다운로드 실패');
      }
      const blob = await response.blob();
      const link = document.createElement('a');
      link.href = window.URL.createObjectURL(blob);
      link.download = fileName;
      link.click();
    } catch (err) {
      alert('파일 다운로드 중 오류 발생');
    }
  };

  const toggleExpand = (index) => {
    setExpandedIndex(expandedIndex === index ? null : index);
  };

  useEffect(() => {
    fetchFiles();
  }, []);

  return (
    <div style={{ padding: '20px', maxWidth: '700px', margin: '0 auto' }}>
      <h1>사용자 파일 관리</h1>

      <section>
        <h2>파일 업로드</h2>
        <form onSubmit={handleUpload}>
          <input type="file" onChange={handleFileChange} />
          <button type="submit">업로드</button>
        </form>
        {uploadMessage && <p>{uploadMessage}</p>}
      </section>

      <section>
        <h2>업로드된 파일 목록</h2>
        <button onClick={fetchFiles}>파일 목록 새로고침</button>
        {files.length === 0 ? (
          <p>업로드된 파일이 없습니다.</p>
        ) : (
          <ul>
            {files.map((file, index) => (
              <li key={index} style={{ marginBottom: '10px' }}>
                <strong>{file.file_name}</strong>{' '}
                <button onClick={() => handleDownload(file.file_name)}>
                  다운로드
                </button>{' '}
                <button onClick={() => handleDelete(file.file_name)}>
                  삭제
                </button>{' '}
                <button onClick={() => toggleExpand(index)}>
                  {expandedIndex === index ? '접기' : '펼치기'}
                </button>
                {expandedIndex === index && (
                  <div
                    style={{
                      marginTop: '5px',
                      marginLeft: '20px',
                      fontSize: '0.9em',
                    }}
                  >
                    <p>📄 타입: {file.file_type}</p>
                    {file.duration && (
                      <p>⏱ 길이: {file.duration.toFixed(2)}초</p>
                    )}
                    <p>
                      🔗 URL:{' '}
                      <a
                        href={file.file_url}
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        {file.file_url}
                      </a>
                    </p>
                  </div>
                )}
              </li>
            ))}
          </ul>
        )}
        {deleteMessage && <p>{deleteMessage}</p>}
      </section>
    </div>
  );
};

export default UserFileManager;
