import React, { useState } from 'react';
import axios from 'axios';

function TranslateText() {
  const [sourceText, setSourceText] = useState('');
  const [sourceLanguage, setSourceLanguage] = useState('ko-KR');
  const [targetLanguage, setTargetLanguage] = useState('en-US');
  const [translatedText, setTranslatedText] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleTranslate = async () => {
    if (!sourceText.trim()) {
      setError('번역할 텍스트를 입력하세요.');
      return;
    }
    setLoading(true);
    setError('');
    setTranslatedText('');
    try {
      // 폼 데이터를 사용하여 번역 요청
      const formData = new FormData();
      formData.append('text', sourceText);
      formData.append('source_language', sourceLanguage);
      formData.append('target_language', targetLanguage);

      const response = await axios.post(
        'http://localhost:8000/translate-text',
        formData
      );

      setTranslatedText(response.data.translated_text);
    } catch (err) {
      console.error('번역 오류:', err);
      if (err.response) {
        setError(
          `서버 오류: ${err.response.status} - ${
            err.response.data.detail || '알 수 없는 오류'
          }`
        );
      } else {
        setError(`요청 오류: ${err.message}`);
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      style={{
        maxWidth: '500px',
        margin: '30px auto',
        textAlign: 'center',
        border: '1px solid #ccc',
        padding: '20px',
        borderRadius: '8px',
      }}
    >
      <h2>번역 생성기</h2>
      <textarea
        value={sourceText}
        onChange={(e) => setSourceText(e.target.value)}
        placeholder="번역할 텍스트를 입력하세요."
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
      <div style={{ marginBottom: '10px' }}>
        <label>원본 언어 코드: </label>
        <input
          type="text"
          value={sourceLanguage}
          onChange={(e) => setSourceLanguage(e.target.value)}
          style={{
            width: '100%',
            padding: '10px',
            borderRadius: '5px',
            border: '1px solid #ccc',
          }}
        />
      </div>
      <div style={{ marginBottom: '10px' }}>
        <label>대상 언어 코드: </label>
        <input
          type="text"
          value={targetLanguage}
          onChange={(e) => setTargetLanguage(e.target.value)}
          style={{
            width: '100%',
            padding: '10px',
            borderRadius: '5px',
            border: '1px solid #ccc',
          }}
        />
      </div>
      <button
        onClick={handleTranslate}
        style={{
          padding: '10px 20px',
          backgroundColor: '#007bff',
          color: '#fff',
          border: 'none',
          borderRadius: '5px',
          cursor: 'pointer',
        }}
        disabled={loading}
      >
        {loading ? '번역 중...' : '번역하기'}
      </button>
      {error && <p style={{ color: 'red', marginTop: '10px' }}>{error}</p>}
      {translatedText && (
        <div style={{ marginTop: '20px' }}>
          <h3>번역 결과</h3>
          <p>{translatedText}</p>
        </div>
      )}
    </div>
  );
}

export default TranslateText;
