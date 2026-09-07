import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import * as S from "./style";
import ChangeInfoFrame from "../joincomponents/ChangeInfoFrame";
import NicknameChange from "../joincomponents/NicknameChange";
import PasswordChange from "../joincomponents/PasswordChange";
import useAuthStore from "../../store/authStore"; // Zustand 스토어 임포트

const ProfilePopUp = ({ isOpen, onClose }) => {
  const [activeModal, setActiveModal] = useState(null);
  const { member, isAuthenticated, setIsAuthenticated, setMember } =
    useAuthStore();
  const navigate = useNavigate();

  const closeModal = () => setActiveModal(null);

  // socials 배열에서 LOCAL 여부 확인
const hasLocalSocial = member?.socials?.some(
  (social) => social.memberProvider === "LOCAL"
);

  // LOCAL(일반 가입) 유저인지 확인하는 변수 추가
  const isLocalUser = hasLocalSocial || member?.memberProvider === "LOCAL";

  const getProfileImage = () => {
    return (
      member?.memberProfile ||
      member?.profileImage ||
      member?.profileImageUrl ||
      ""
    );
  };

  const getProfileInitial = () => {
    const name = member?.memberName || "사용자";
    return name.trim().charAt(0);
  };

  const profileImage = getProfileImage();

  const handleLogout = async () => {
    try {
      await fetch("http://localhost:10000/auth/logout", {
        method: "POST",
        credentials: "include",
      });
      setIsAuthenticated(false);
      setMember(null);
      onClose();
      navigate("/");
    } catch (error) {
      console.error("로그아웃 실패", error);
    }
  };

  return (
    <div>
      <S.Backdrop $isOpen={isOpen} onClick={onClose} />

      <S.SidebarContainer $isOpen={isOpen}>
        <S.ProfileImgWrap>
          {/* 실제 유저 프로필 이미지 연동 */}
          {profileImage ? (
            <img src={profileImage} alt="프로필 이미지" />
          ) : (
            <S.ProfileInitialAvatar>
              {getProfileInitial()}
            </S.ProfileInitialAvatar>
          )}

          <S.CloseButton onClick={onClose}>
            <img src="/assets/icons/close.svg" alt="닫기 버튼" />
          </S.CloseButton>
        </S.ProfileImgWrap>

        {isAuthenticated && member ? (
          <>
            <S.ProfileContainer>
              <S.ProfileUserInfoContainer>
                {/* 닉네임 연동 */}
                <S.ProfileUserName>
                  {member?.memberName || "사용자"} 님
                </S.ProfileUserName>
                <S.ProfileUserLevel>
                  <img src="/assets/icons/star.svg" alt="별" />
                  LV.1
                </S.ProfileUserLevel>
                <S.ProfileUserXp>XP 0</S.ProfileUserXp>
                <S.ProfileUserCreateAt>
                  가입일 :{" "}
                  {member?.memberCreateAt
                    ? member.memberCreateAt.split("T")[0]
                    : "날짜 없음"}
                </S.ProfileUserCreateAt>
              </S.ProfileUserInfoContainer>
            </S.ProfileContainer>

            <S.ProfileContainer>
              <S.ProfileTitles>활동 요약</S.ProfileTitles>
              <p>총 인증: 0</p>
              <p>획득한 뱃지: 0</p>
            </S.ProfileContainer>

            <S.ProfileContainer>
              <S.ProfileTitles>내 활동</S.ProfileTitles>
              <Link to={"/myrecipe"} onClick={onClose}>
                저장한 레시피
              </Link>
              <Link to={"/levelandbadge"} onClick={onClose}>
                획득한 뱃지
              </Link>
              <Link to={"/communitymain"} onClick={onClose}>
                커뮤니티 게시물
              </Link>
            </S.ProfileContainer>

            <S.ProfileContainer>
              <S.ProfileTitles>설정</S.ProfileTitles>
              <S.ChangeButton onClick={() => setActiveModal("nickname")}>
                닉네임 변경
              </S.ChangeButton>
              {isLocalUser && (
                <S.ChangeButton onClick={() => setActiveModal("password")}>
                  비밀번호 변경
                </S.ChangeButton>
              )}
              {/* 로그아웃을 S.ChangeButton 스타일로 통일 */}
              <S.ChangeButton onClick={handleLogout}>로그아웃</S.ChangeButton>
            </S.ProfileContainer>
            <div>회원탈퇴</div>
          </>
        ) : (
          <S.ProfileContainer>
            <p>로그인이 필요한 서비스입니다.</p>
            <S.ChangeButton
              onClick={() => {
                navigate("/login");
                onClose();
              }}
            >
              로그인 하러 가기
            </S.ChangeButton>
          </S.ProfileContainer>
        )}

        {activeModal && (
          <ChangeInfoFrame onClose={closeModal}>
            {activeModal === "nickname" && (
              <NicknameChange
                member={member}
                setMember={setMember}
                onSuccess={closeModal}
              />
            )}
            {activeModal === "password" && isLocalUser && (
              <PasswordChange 
                member={member} 
                onSuccess={closeModal}
                />
            )}
          </ChangeInfoFrame>
        )}
      </S.SidebarContainer>
    </div>
  );
};

export default ProfilePopUp;
