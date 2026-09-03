import React, { useState } from "react";
import axios from "axios";
import * as S from "./style";
import usePostStore from "../../store/postStore";

const NicknameChange = ({ onSuccess, member, setMember }) => {
  const { fetchPosts } = usePostStore();
  const [newNickname, setNewNickname] = useState(
    member?.memberName || ""
  );
  const [errorMessage, setErrorMessage] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();

    const nickname = newNickname.trim();

    if (!nickname) {
      setErrorMessage("닉네임을 입력해주세요.");
      return;
    }

    if (nickname.length < 2) {
      setErrorMessage("닉네임은 최소 2글자 이상이어야 합니다.");
      return;
    }

    try {
      const response = await axios.put(
        `http://localhost:10000/members/${member.id}/nickname`,
        {
          memberName: nickname,
        },
        {
          withCredentials: true,
        }
      );

      const updatedMemberData = response.data.data; // 백엔드에서 넘어온 회원 객체

    // Zustand 스토어 업데이트 
    setMember({
      ...member,
      ...updatedMemberData,
      memberName: updatedMemberData.memberName,
    });

    await fetchPosts();

      alert("닉네임이 성공적으로 변경되었습니다.");
      onSuccess();

    } catch (error) {
      console.error("닉네임 변경 실패:", error);

      if (error.response?.status === 409) {
        setErrorMessage("중복된 닉네임 입니다.");
        return;
      }

      setErrorMessage(
        error.response?.data?.message ||
        "닉네임 변경 중 오류가 발생했습니다."
      );
    }
  };

  return (
    <S.ModalForm onSubmit={handleSubmit}>
      <S.ModalTitle>닉네임 변경</S.ModalTitle>
      <S.ModalDescription>
        서비스에서 사용할 새로운 닉네임을 입력해주세요.
      </S.ModalDescription>

      <S.ModalInput
        type="text"
        placeholder="새 닉네임 입력"
        value={newNickname}
        onChange={(e) => {
          setNewNickname(e.target.value);
          setErrorMessage("");
        }}
      />

      {errorMessage && (
        <S.ErrorMessage>{errorMessage}</S.ErrorMessage>
      )}

      <S.ModalButton type="submit">
        변경 완료
      </S.ModalButton>
    </S.ModalForm>
  );
};

export default NicknameChange;