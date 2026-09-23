import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useMutation } from "@tanstack/react-query";
import * as S from "./style";
import ChangeInfoFrame from "../joincomponents/ChangeInfoFrame";
import NicknameChange from "../joincomponents/NicknameChange";
import PasswordChange from "../joincomponents/PasswordChange";
import useAuthStore from "../../store/authStore";
import { API_BASE_URL } from "../../config/api";

const ProfilePopUp = ({ isOpen, onClose }) => {
  const [activeModal, setActiveModal] = useState(null);
  const { member, isAuthenticated, setIsAuthenticated, setMember } =
    useAuthStore();
  const navigate = useNavigate();

  const closeModal = () => setActiveModal(null);

  // 💡 회원 탈퇴 API 함수
  const withdrawMember = async (id) => {
    const response = await fetch(`${API_BASE_URL}/members/${id}`, {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
      },
      credentials: "include",
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.message || "회원 탈퇴 처리에 실패했습니다.");
    }

    return true;
  };

  // 💡 회원 탈퇴 Mutation
  const withdrawMutation = useMutation({
    mutationFn: withdrawMember,
    onSuccess: () => {
      alert("회원 탈퇴가 완료되었습니다. 이용해 주셔서 감사합니다.");
      setIsAuthenticated(false);
      setMember(null);
      onClose();
      navigate("/", { replace: true });
    },
    onError: (error) => {
      console.error("회원 탈퇴 오류:", error);
      alert(error.message || "회원 탈퇴 중 오류가 발생했습니다.");
    },
  });

  // 💡 회원 탈퇴 버튼 핸들러
  const handleWithdraw = () => {
    const memberId = member?.id;

    if (!memberId) {
      alert("로그인 정보를 찾을 수 없습니다. 다시 로그인해 주세요.");
      return;
    }

    const isConfirmed = window.confirm(
      "정말로 탈퇴하시겠습니까?\n탈퇴 시 작성한 모든 게시글 및 정보가 삭제되며 복구할 수 없습니다."
    );

    if (isConfirmed) {
      withdrawMutation.mutate(memberId);
    }
  };

  // socials 배열에서 LOCAL 여부 확인
  const hasLocalSocial = member?.socials?.some(
    (social) => social.memberProvider === "LOCAL"
  );

  const isLocalUser = hasLocalSocial || member?.memberProvider === "LOCAL";

  const getProfileImage = () => {
    const rawImg =
      member?.memberProfile ||
      member?.profileImg ||
      member?.profileImage ||
      member?.profileImageUrl ||
      "";

    if (!rawImg) return "";

    if (rawImg.startsWith("http://") || rawImg.startsWith("https://")) {
      return rawImg.replace("http://", "https://");
    }

    return rawImg;
  };

  const getProfileInitial = () => {
    const name = member?.memberNickname || member?.memberName || "사용자";
    return name.trim().charAt(0);
  };

  const profileImage = getProfileImage();

  const memberLevel = member?.memberLevel ?? 1;
  const memberXp = member?.memberXp ?? member?.currentXp ?? 0;
  const cookCount = member?.cookCount ?? 0;

  const earnedBadgesCount = Array.isArray(member?.badges)
    ? member.badges.filter(
        (badge) =>
          badge.isUnlocked || badge.isEarned || badge.status === "ACHIEVED"
      ).length
    : 0;

  const handleLogout = async () => {
    try {
      await fetch(`${API_BASE_URL}/auth/logout`, {
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
                <S.ProfileUserName>
                  {member?.memberName || "사용자"} 님
                </S.ProfileUserName>
                
                <S.ProfileUserLevel>
                  <img src="/assets/icons/star.svg" alt="별" />
                  LV.{memberLevel}
                </S.ProfileUserLevel>
                <S.ProfileUserXp>XP {memberXp}</S.ProfileUserXp>
                
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
              <p>총 인증: {cookCount}</p>
              <p>획득한 뱃지: {earnedBadgesCount}</p>
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
              <S.ChangeButton onClick={handleLogout}>로그아웃</S.ChangeButton>
            </S.ProfileContainer>

            <S.DangerZoneContainer>
              <S.DeleteAccountButton 
                onClick={handleWithdraw}
                disabled={withdrawMutation.isPending}
              >
                {withdrawMutation.isPending ? "탈퇴 처리 중..." : "회원탈퇴"}
              </S.DeleteAccountButton>
            </S.DangerZoneContainer>
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