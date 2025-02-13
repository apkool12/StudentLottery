import React, { useState, useEffect } from 'react';
import './BinaryStudentLottery.css';
import * as xlsx from 'xlsx';

const BinaryStudentLottery = () => {
  /* ==================== 상태 관리 ==================== */
  const [students, setStudents] = useState([]);
  const [selectedStudent, setSelectedStudent] = useState(null);
  const [animation, setAnimation] = useState(false);
  const [binaryText, setBinaryText] = useState('');
  const [fileName, setFileName] = useState("");

  /* ==================== 이펙트 설정 ==================== */
  useEffect(() => {
    const interval = setInterval(() => {
      const binary = Array(32).fill(0).map(() => 
        Math.random() > 0.5 ? '1' : '0'
      ).join('');
      setBinaryText(binary);
    }, 300);
    
    return () => clearInterval(interval);
  }, []);

  /* ==================== 엑셀 파일 업로드 처리 ==================== */
  const handleFileUpload = (e) => {
    const file = e.target.files[0];
    if (!file) return;
  
    setFileName(file.name);
  
    const reader = new FileReader();
    reader.onload = (evt) => {
      const bstr = evt.target.result;
      const wb = xlsx.read(bstr, { type: "binary" });
      const wsname = wb.SheetNames[0];
      const ws = wb.Sheets[wsname];
      const data = xlsx.utils.sheet_to_json(ws);
      const names = data.map((row) => row.성명);
      setStudents(names);
    };
  
    reader.readAsBinaryString(file);
  };

  /* ==================== 랜덤 선택  ==================== */
  const pickRandomStudent = () => {
    if (students.length === 0) return;
    
    setAnimation(true);
    
    let count = 0;
    const intervalId = setInterval(() => {
      const randomIndex = Math.floor(Math.random() * students.length);
      setSelectedStudent(students[randomIndex]);
      count++;
      
      if (count > 20) {
        clearInterval(intervalId);
        setAnimation(false);
      }
    }, 100);
  };

  return (
    <div className="lottery-wrapper">
      {/* ==================== 배경 효과 ==================== */}
      <div className="cyber-smoke left"></div>
      <div className="cyber-smoke right"></div>
      <div className="binary-rain"></div>
      
      <div className="lottery-container">
        {/* ==================== 헤더  ==================== */}
        <header className="header">
          <div className="logo-section">
            <div className="cyber-frame">
              <div className="generation-number">41st</div>
            </div>
            <h1 className="binary-title">BINARY</h1>
            <p className="slogan">Infinite possibilities to design the future!</p>
            <div className="cyber-line"></div>
          </div>
          <div className="matrix-effect">{binaryText}</div>
        </header>

        {/* ==================== 메인 ==================== */}
        <main className="main-content">
          <div className="cyber-card">
            <div className="card-corner top-left"></div>
            <div className="card-corner top-right"></div>
            <div className="card-corner bottom-left"></div>
            <div className="card-corner bottom-right"></div>
            
            <h2>이름 뽑기</h2>
            
            {/* ==================== 파일 업로드 섹션 ==================== */}
            <div className="upload-section">
              <label className="file-upload">
                {fileName ? (
                  <span className="uploaded-file">📂 {fileName}</span> // 파일 업로드 시 파일명 표시
                ) : (
                  <span>엑셀 파일을 업로드하세요</span> 
                )}
                <input type="file" accept=".xlsx, .xls" onChange={handleFileUpload} />
              </label>
                
              {students.length > 0 && (
                <div className="upload-info">
                  <div className="sub-text">
                    <span className="highlight-number">{students.length}</span>명의 학생 데이터 로드 완료
                  </div>
                </div>
              )}
            </div>
            
            {/* ==================== 랜덤 버튼 ==================== */}
            <button
              onClick={pickRandomStudent}
              disabled={students.length === 0 || animation}
              className={`cyber-button ${students.length === 0 ? 'disabled' : ''}`}
            >
              <span className="button-glitch"></span>
              <span className="button-text">RANDOM SELECT</span>
            </button>
            
            {/* ==================== 선택 학생 결과  ==================== */}
            {selectedStudent && (
              <div className={`result-section ${animation ? 'animating' : ''}`}>
                <div className="cyber-scanline"></div>
                <div className="result-header">SELECTED STUDENT</div>
                <div className="selected-name">{selectedStudent}</div>
                <div className="binary-name">
                  {selectedStudent.split('').map(char => 
                    char.charCodeAt(0).toString(2).padStart(8, '0')
                  ).join(' ')}
                </div>
              </div>
            )}
          </div>
        </main>
      </div>
    </div>
  );
};

export default BinaryStudentLottery;
