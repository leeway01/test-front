import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';

const baseUrl = 'http://localhost';

function FileList() {
  const [fileList, setFileList] = useState(null);
  const [error, setError] = useState(null);

  const fetchFileList = async () => {
    try {
      const response = await axios.get(`${baseUrl}:8000/list-file`);
      setFileList(response.data);
    } catch (err) {
      setError(err.message);
    }
  };

  useEffect(() => {
    fetchFileList();
  }, []);

  // 영상 파일 삭제 함수 (기존)
  const handleDeleteVideo = async (fileName) => {
    if (
      !window.confirm(
        `${fileName} 파일을 삭제하시겠습니까? 이 작업은 되돌릴 수 없습니다.`
      )
    ) {
      return;
    }
    try {
      await axios.delete(`${baseUrl}:8000/delete-video`, {
        params: { filename: fileName },
      });
      alert('영상 및 관련 파일이 삭제되었습니다.');
      fetchFileList();
    } catch (err) {
      alert('영상 삭제에 실패했습니다.');
    }
  };

  // custom_tts, sound_effects 폴더에 있는 개별 오디오 파일 삭제 함수
  const handleDeleteAudio = async (folder, fileName) => {
    if (
      !window.confirm(`${folder} 폴더의 ${fileName} 파일을 삭제하시겠습니까?`)
    ) {
      return;
    }
    try {
      await axios.delete(`${baseUrl}:8000/delete-audio-file`, {
        params: { file: fileName, folder },
      });
      alert('오디오 파일이 삭제되었습니다.');
      fetchFileList();
    } catch (err) {
      alert('오디오 파일 삭제에 실패했습니다.');
    }
  };

  return (
    <div style={{ maxWidth: '800px', margin: '0 auto', padding: '20px' }}>
      <h1>서버 파일 목록</h1>
      {error && <p style={{ color: 'red' }}>{error}</p>}
      {fileList ? (
        <>
          <h2>Uploaded Videos</h2>
          {fileList.uploaded_videos.length > 0 ? (
            <ul>
              {fileList.uploaded_videos.map((file, index) => (
                <li key={index}>
                  <Link
                    to={`/file-details?filename=${encodeURIComponent(file)}`}
                  >
                    {file}
                  </Link>
                  <button
                    onClick={() => handleDeleteVideo(file)}
                    style={{ marginLeft: '10px' }}
                  >
                    삭제
                  </button>
                </li>
              ))}
            </ul>
          ) : (
            <p>업로드된 동영상 파일이 없습니다.</p>
          )}
          <h2>Extracted Audio</h2>
          {Object.keys(fileList.extracted_audio).map((folder, index) => (
            <div key={index}>
              <h3>{folder}</h3>
              {fileList.extracted_audio[folder] &&
              fileList.extracted_audio[folder].length > 0 ? (
                <ul>
                  {fileList.extracted_audio[folder].map((file, idx) => {
                    // custom_tts와 sound_effects 폴더는 삭제 버튼 추가
                    const fileUrl =
                      folder === 'sound_effects' || folder === 'custom_tts'
                        ? `${baseUrl}:8000/extracted_audio/${folder}/${file}`
                        : `${baseUrl}:8000/extracted_audio/${file}`;
                    return (
                      <li key={idx}>
                        <p>{file}</p>
                        <audio controls style={{ width: '100%' }}>
                          <source src={fileUrl} type="audio/mp3" />
                          Your browser does not support the audio element.
                        </audio>
                        {(folder === 'sound_effects' ||
                          folder === 'custom_tts') && (
                          <button
                            onClick={() => handleDeleteAudio(folder, file)}
                            style={{ marginTop: '5px' }}
                          >
                            삭제
                          </button>
                        )}
                      </li>
                    );
                  })}
                </ul>
              ) : (
                <p>파일이 없습니다.</p>
              )}
            </div>
          ))}
        </>
      ) : (
        <p>불러오는 중...</p>
      )}
    </div>
  );
}

export default FileList;
