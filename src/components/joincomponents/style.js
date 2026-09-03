import styled from "styled-components";

export const ForChangeBackdrop = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  width: 100vw;
  height: 100vh;
  background-color: rgba(0, 0, 0, 0.6);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 9999; /* 모든 요소보다 위에 배치 */
`;

export const ForChangeModalContent = styled.div`
  background-color: white;
  width: 400px;
  padding: 30px;
  border-radius: 15px;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.3);
  position: relative;
  /* position: fixed를 쓰지 않아도 부모인 Backdrop이 flex이므로 중앙 정렬됩니다 */
`;

export const ForChangeCloseButton = styled.button`
  position: absolute;
  top: 15px;
  right: 15px;
  background: none;
  border: none;
  font-size: 20px;
  cursor: pointer;
`;

// ---------------------------------------------------------
// 팝업 내부 제목
export const ModalTitle = styled.h2`
  font-size: 1.5rem;
  font-weight: bold;
  color: #333;
  margin-bottom: 10px;
`;

// 팝업 내부 설명 텍스트
export const ModalDescription = styled.p`
  font-size: 0.9rem;
  color: #666;
  margin-bottom: 20px;
  line-height: 1.5;
`;

// 공통 입력창
export const ModalInput = styled.input`
  width: 100%;
  padding: 12px 15px;
  margin-bottom: 12px;
  border: 1px solid #ddd;
  border-radius: 8px;
  font-size: 1rem;
  outline: none;
  &:focus {
    border-color: #007bff;
  }
`;

// 공통 제출 버튼
export const ModalButton = styled.button`
  width: 100%;
  padding: 14px;
  background-color: #007bff;
  color: white;
  border: none;
  border-radius: 8px;
  font-weight: bold;
  cursor: pointer;
  transition: background 0.2s;

  &:hover {
    background-color: #0056b3;
  }
`;

// 폼 레이아웃 (간격 조절)
export const ModalForm = styled.form`
  display: flex;
  flex-direction: column;
  width: 100%;
`;

// 에러 메세지 
export const ErrorMessage = styled.p`
  color: #ff4d4f;
  font-size: 14px;
  margin-top: 8px;
  margin-bottom: 0;
  text-align: center;
`;