import React, { useState } from "react";
import axios from "axios";
import * as S from "./style";
import useAuthStore from "../../store/authStore";

const PasswordChange = ({ onSuccess }) => {
  const { member } = useAuthStore();
  const [form, setForm] = useState({
    currentPw: "",
    newPw: "",
    confirmPw: "",
  });
  const [errorMessage, setErrorMessage] = useState("");

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
    setErrorMessage(""); // 입력 시 기존 에러 메시지 초기화
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // 1. 비밀번호 일치 확인
    if (form.newPw !== form.confirmPw) {
      setErrorMessage("새 비밀번호가 일치하지 않습니다.");
      return;
    }

    // 터미널(브라우저 콘솔) 출력: 요청 시작
    console.log("🔒 [비밀번호 변경 요청 시작]", {
      memberId: member?.id,
      currentPwLength: form.currentPw.length,
      newPwLength: form.newPw.length,
    });

    try {
      const response = await axios.put(
        `http://localhost:10000/members/${member?.id}/password`,
        {
          currentPassword: form.currentPw,
          newPassword: form.newPw,
        },
        { withCredentials: true }
      );

      // 터미널(브라우저 콘솔) 출력: 성공 응답
      console.log("✅ [비밀번호 변경 성공 응답]:", response.data);

      alert("비밀번호가 성공적으로 변경되었습니다.");
      onSuccess(); // 팝업/모달 닫기
    } catch (error) {
      // 터미널(브라우저 콘솔) 출력: 실패 에러
      console.error("❌ [비밀번호 변경 실패]:", error.response || error);

      const msg =
        error.response?.data?.message ||
        "비밀번호 변경 중 오류가 발생했습니다.";
      setErrorMessage(Array.isArray(msg) ? msg[0] : msg);
    }
  };

  return (
    <S.ModalForm onSubmit={handleSubmit}>
      <S.ModalTitle>비밀번호 변경</S.ModalTitle>
      <S.ModalDescription>
        보안을 위해 정기적으로 비밀번호를 변경하는 것이 좋습니다.
      </S.ModalDescription>

      <S.ModalInput
        type="password"
        name="currentPw"
        placeholder="현재 비밀번호"
        value={form.currentPw}
        onChange={handleChange}
        required
      />
      <S.ModalInput
        type="password"
        name="newPw"
        placeholder="새 비밀번호"
        value={form.newPw}
        onChange={handleChange}
        required
      />
      <S.ModalInput
        type="password"
        name="confirmPw"
        placeholder="새 비밀번호 확인"
        value={form.confirmPw}
        onChange={handleChange}
        required
      />

      {errorMessage && <S.ErrorMessage>{errorMessage}</S.ErrorMessage>}

      <S.ModalButton type="submit">비밀번호 재설정</S.ModalButton>
    </S.ModalForm>
  );
};

export default PasswordChange;