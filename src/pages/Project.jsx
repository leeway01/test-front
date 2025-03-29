import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const ProjectManagementPage = () => {
  const [projects, setProjects] = useState([]);
  const [error, setError] = useState('');
  const [showAddForm, setShowAddForm] = useState(false);
  const [newProjectName, setNewProjectName] = useState('');
  const [newDescription, setNewDescription] = useState('');
  const navigate = useNavigate();

  // 프로젝트 목록 불러오기
  const fetchProjects = async () => {
    try {
      const response = await fetch('http://localhost:8000/projects', {
        method: 'GET',
        credentials: 'include',
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
  };

  useEffect(() => {
    fetchProjects();
  }, []);

  // 프로젝트 추가 요청
  const handleAddProject = async (e) => {
    e.preventDefault();
    try {
      const formData = new FormData();
      formData.append('project_name', newProjectName);
      formData.append('description', newDescription);
      const response = await fetch('http://localhost:8000/projects/add', {
        method: 'POST',
        credentials: 'include',
        body: formData,
      });
      if (!response.ok) {
        const data = await response.json();
        setError(data.detail || '프로젝트 추가 실패');
        return;
      }
      // 프로젝트 추가 성공 후 목록 새로고침
      setNewProjectName('');
      setNewDescription('');
      setShowAddForm(false);
      fetchProjects();
    } catch (err) {
      setError('네트워크 에러가 발생했습니다.');
    }
  };

  // 프로젝트 클릭 시, 선택한 프로젝트 ID를 localStorage에 저장하고 편집기 페이지로 이동
  const handleProjectClick = (projectId) => {
    localStorage.setItem('currentProjectId', projectId);
    navigate(`/editor/${projectId}`);
  };

  // 프로젝트 삭제 요청
  const handleDeleteProject = async (projectId) => {
    if (!window.confirm('정말 삭제하시겠습니까?')) return;
    try {
      const response = await fetch(
        `http://localhost:8000/projects/${projectId}`,
        {
          method: 'DELETE',
          credentials: 'include',
        }
      );
      if (!response.ok) {
        const data = await response.json();
        setError(data.detail || '프로젝트 삭제 실패');
        return;
      }
      // 삭제 성공 후 목록 새로고침
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
