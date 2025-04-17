import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';

const ProjectManagementPage = () => {
  const [projects, setProjects] = useState([]);
  const [error, setError] = useState('');
  const [showAddForm, setShowAddForm] = useState(false);
  const [newProjectName, setNewProjectName] = useState('');
  const [newDescription, setNewDescription] = useState('');
  const navigate = useNavigate();

  const API_BASE =
    'http://ec2-43-200-163-229.ap-northeast-2.compute.amazonaws.com:8000';
  const token = localStorage.getItem('authToken'); // 토큰 저장 위치는 로그인 성공 시 localStorage.setItem('token', token)

  // 🔁 useCallback으로 감싼 fetchProjects 함수
  const fetchProjects = useCallback(async () => {
    try {
      const response = await fetch(`${API_BASE}/projects`, {
        method: 'GET',
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      if (!response.ok) {
        const data = await response.json();
        setError(data.detail || '프로젝트 조회에 실패했습니다.');
        return;
      }
      const data = await response.json();
      setProjects(data.projects);
    } catch (err) {
      setError('네트워크 에러가 발생했습니다.');
    }
  }, [token]); // <- 토큰이 바뀌면 재생성

  // 🔁 useEffect에서 fetchProjects를 의존성에 추가
  useEffect(() => {
    fetchProjects();
  }, [fetchProjects]);

  const handleAddProject = async (e) => {
    e.preventDefault();
    try {
      const formData = new FormData();
      formData.append('project_name', newProjectName);
      formData.append('description', newDescription);
      const response = await fetch(`${API_BASE}/projects/add`, {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${token}`,
        },
        body: formData,
      });
      if (!response.ok) {
        const data = await response.json();
        setError(data.detail || '프로젝트 추가 실패');
        return;
      }
      setNewProjectName('');
      setNewDescription('');
      setShowAddForm(false);
      fetchProjects();
    } catch (err) {
      setError('네트워크 에러가 발생했습니다.');
    }
  };

  const handleProjectClick = (projectId) => {
    localStorage.setItem('currentProjectId', projectId);
    navigate(`/editor/${projectId}`);
  };

  const handleDeleteProject = async (projectId) => {
    if (!window.confirm('정말 삭제하시겠습니까?')) return;
    try {
      const response = await fetch(`${API_BASE}/projects/${projectId}`, {
        method: 'DELETE',
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      if (!response.ok) {
        const data = await response.json();
        setError(data.detail || '프로젝트 삭제 실패');
        return;
      }
      fetchProjects();
    } catch (err) {
      setError('네트워크 에러가 발생했습니다.');
    }
  };

  return (
    <div style={{ padding: '20px', maxWidth: '800px', margin: '0 auto' }}>
      <h1>프로젝트 관리</h1>
      {error && <p style={{ color: 'red' }}>{error}</p>}
      <button onClick={() => setShowAddForm(!showAddForm)}>
        {showAddForm ? '취소' : '프로젝트 추가'}
      </button>
      {showAddForm && (
        <form onSubmit={handleAddProject} style={{ marginTop: '20px' }}>
          <div style={{ marginBottom: '10px' }}>
            <label>프로젝트 이름:</label>
            <input
              type="text"
              value={newProjectName}
              onChange={(e) => setNewProjectName(e.target.value)}
              required
              style={{ width: '100%', padding: '8px' }}
            />
          </div>
          <div style={{ marginBottom: '10px' }}>
            <label>설명:</label>
            <textarea
              value={newDescription}
              onChange={(e) => setNewDescription(e.target.value)}
              style={{ width: '100%', padding: '8px' }}
            />
          </div>
          <button type="submit" style={{ padding: '10px 20px' }}>
            추가
          </button>
        </form>
      )}
      <hr style={{ margin: '20px 0' }} />
      {projects.length === 0 ? (
        <p>등록된 프로젝트가 없습니다.</p>
      ) : (
        <ul style={{ listStyle: 'none', padding: 0 }}>
          {projects.map((project) => (
            <li
              key={project.project_id}
              style={{
                border: '1px solid #ccc',
                padding: '10px',
                marginBottom: '10px',
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
              }}
            >
              <div
                style={{ cursor: 'pointer' }}
                onClick={() => handleProjectClick(project.project_id)}
              >
                <h2>{project.project_name}</h2>
                <p>{project.description}</p>
                <small>
                  생성일: {new Date(project.created_at).toLocaleString()}
                </small>
              </div>
              <button
                onClick={() => handleDeleteProject(project.project_id)}
                style={{
                  backgroundColor: 'red',
                  color: 'white',
                  border: 'none',
                  padding: '5px 10px',
                  cursor: 'pointer',
                }}
              >
                삭제
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default ProjectManagementPage;
