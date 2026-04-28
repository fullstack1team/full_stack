// 변경점: 댓글 ⋮ 메뉴를 createPortal로 document.body에 띄워서
//          스크롤(overflow: auto) 영역에 잘리지 않게 처리

import React, {
  useEffect,
  useMemo,
  useState,
  useCallback,
  useRef,
} from "react";
import { createPortal } from "react-dom";
import * as S from "./CommunityPostModal.style";
import { getCommentsByPostId } from "../../api/comment";

const clamp = (n, min, max) => Math.max(min, Math.min(max, n));

const CommunityPostModal = ({
  open,
  onClose,
  post,
  onSubmitComment,
  meNickname, // "요리왕곰순"
  onEditComment, // (comment, nextText) => {}
  onDeleteComment, // (comment) => {}
  onToggleLike,
  requireLogin,
  isAuthenticated,
}) => {
  const [activeIndex, setActiveIndex] = useState(0);
  const [commentText, setCommentText] = useState("");
  const [isCommentComposeOpen, setIsCommentComposeOpen] = useState(false);

  // ✅ 인라인 수정 모드
  const [editingKey, setEditingKey] = useState(null);
  const [draftText, setDraftText] = useState("");

  const images = useMemo(() => post?.images ?? [], [post]);

  const hasImages = images.length > 0;
  const safeIndex = clamp(activeIndex, 0, Math.max(0, images.length - 1));
  const currentImage = hasImages ? images[safeIndex] : "";

  const [comments, setComments] = useState([]);

  const [isExpanded, setIsExpanded] = useState(false); // 게시글 문장 길이 자세히보기, 간단히
  const [canToggle, setCanToggle] = useState(false);
  const descRef = useRef(null);

  const [hoverKey, setHoverKey] = useState(null);

  // ✅ 🔥 포탈 메뉴 상태: { key, comment } / null
  const [openMenu, setOpenMenu] = useState(null);
  // ✅ 🔥 포탈 메뉴 위치: { top, left } / null
  const [menuPos, setMenuPos] = useState(null);

  // ✅ 최신 상태를 키다운 이벤트에서 쓰기 위해 ref로 보관
  const openMenuRef = useRef(openMenu);
  const editingKeyRef = useRef(editingKey);

  useEffect(() => {
    openMenuRef.current = openMenu;
  }, [openMenu]);

  useEffect(() => {
    editingKeyRef.current = editingKey;
  }, [editingKey]);

  const isMine = useCallback(
    (c) => {
      if (!meNickname) return false;
      return (
        String(c?.member?.memberName ?? "").trim() === String(meNickname).trim()
      );
    },
    [meNickname],
  );

  const handlePrev = useCallback(() => {
    if (!hasImages) return;
    setActiveIndex((prev) => (prev - 1 + images.length) % images.length);
  }, [hasImages, images.length]);

  const handleNext = useCallback(() => {
    if (!hasImages) return;
    setActiveIndex((prev) => (prev + 1) % images.length);
  }, [hasImages, images.length]);

  const resetComposer = useCallback(() => {
    setCommentText("");
    setIsCommentComposeOpen(false);
  }, []);

  // 댓글 생성
  const handleSend = useCallback(async () => {
    if (!isAuthenticated) {
      requireLogin?.(() => {});
      return;
    }

    const text = commentText.trim();
    if (!text || !post?.id) return;

    const optimisticComment = {
      id: `temp-${Date.now()}`,
      content: text,
      createdAt: new Date().toISOString(),
      member: {
        memberName: meNickname || "나",
      },
    };

    console.log("optimistic before", comments);

    setComments((prev) => [optimisticComment, ...prev]);

    console.log("sending text", text);

    setCommentText("");
    setIsCommentComposeOpen(false);

    try {
      await onSubmitComment?.(text);

      const data = await getCommentsByPostId(post.id);
      console.log("fresh comments", data);
      setComments(data);
    } catch (error) {
      console.error("댓글 생성 실패", error);

      setComments((prev) => prev.filter((c) => c.id !== optimisticComment.id));
      alert(error.message);
    }
  }, [
    commentText,
    onSubmitComment,
    isAuthenticated,
    requireLogin,
    post?.id,
    meNickname,
    comments,
  ]);

  const startEdit = useCallback((key, comment) => {
    setEditingKey(key);
    setDraftText(comment.content);
    setOpenMenu(null);
    setMenuPos(null);
  }, []);

  // ✅ 수정 취소
  const cancelEdit = useCallback(() => {
    setEditingKey(null);
    setDraftText("");
  }, []);

  // ✅ 수정 저장
  const saveEdit = useCallback(
    async (c) => {
      const next = draftText.trim();
      if (!next || !post?.id) return;

      const prevComments = comments;

      setComments((prev) =>
        prev.map((comment) =>
          comment.id === c.id
            ? { ...comment, content: next, updatedAt: new Date().toISOString() }
            : comment,
        ),
      );

      setEditingKey(null);
      setDraftText("");

      try {
        await onEditComment?.(c, next);

        const data = await getCommentsByPostId(post.id);
        setComments(data);
      } catch (err) {
        console.error("댓글 수정 실패", err);
        setComments(prevComments);
        alert(err.message);
      }
    },
    [draftText, onEditComment, post?.id, comments],
  );

  // ✅ open/post 바뀔 때 초기화
  useEffect(() => {
    if (!open) return;

    setActiveIndex(0);
    setCommentText("");
    setIsCommentComposeOpen(false);
    setOpenMenu(null);
    setMenuPos(null);
    setEditingKey(null);
    setDraftText("");
    setIsExpanded(false);
  }, [open, post?.id]);

  useEffect(() => {
    if (!open || !post?.id) return;

    const fetchComments = async () => {
      try {
        const data = await getCommentsByPostId(post.id);
        setComments(data);
      } catch (err) {
        console.error("댓글 조회 실패", err);
      }
    };

    fetchComments();
  }, [open, post?.id]);

  // ✅ 2) 키보드 이벤트만 담당 (초기화 절대 금지)
  useEffect(() => {
    if (!open) return;

    const onKeyDown = (e) => {
      if (e.key === "Escape") {
        if (editingKeyRef.current) {
          cancelEdit();
          return;
        }
        if (openMenuRef.current) {
          setOpenMenu(null);
          setMenuPos(null);
          return;
        }
        onClose?.();
      }
      if (e.key === "ArrowLeft") handlePrev();
      if (e.key === "ArrowRight") handleNext();
      if ((e.ctrlKey || e.metaKey) && e.key === "Enter") handleSend();
    };

    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [open, onClose, handlePrev, handleNext, handleSend, cancelEdit]);

  useEffect(() => {
    if (!open) return;
    if (isExpanded) return;

    const el = descRef.current;
    if (!el) return;

    const raf = requestAnimationFrame(() => {
      setCanToggle(el.scrollHeight > el.clientHeight + 1);
    });

    return () => cancelAnimationFrame(raf);
  }, [open, post?.id, post?.content, isExpanded]);

  // ✅ 포탈 메뉴 열려있을 때: 스크롤/리사이즈하면 위치 재계산이 어려우니 그냥 닫기(안전)
  useEffect(() => {
    if (!openMenu) return;

    const close = () => {
      setOpenMenu(null);
      setMenuPos(null);
    };

    window.addEventListener("scroll", close, true); // capture로 내부 스크롤도 잡힘
    window.addEventListener("resize", close);
    return () => {
      window.removeEventListener("scroll", close, true);
      window.removeEventListener("resize", close);
    };
  }, [openMenu]);

  if (!open) return null;

  console.log("🔥 모달 post 전체:", post);
  console.log("🔥 모달 postIngredientUsed:", post?.postIngredientUsed);
  console.log("🔥 모달 ingredients:", post?.ingredients);

  const count = commentText.length;

  const handleLikeClick = async () => {
    try {
      console.log("좋아요 클릭됨", post.id, post.liked);

      await onToggleLike?.(post.id, post.liked);

      console.log("좋아요 요청 완료");
    } catch (err) {
      console.error("좋아요 실패", err);
    }

    console.log("🔥 post 전체:", post);
    console.log("🔥 재료:", post.postIngredientUsed);
  };

  return (
    <S.Backdrop
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose?.();
      }}
    >
      <S.Modal
        onClick={(e) => e.stopPropagation()}
        role="dialog"
        aria-modal="true"
      >
        {/* 상단 이미지 영역 */}
        <S.Hero>
          <S.CloseButton type="button" onClick={onClose} aria-label="닫기">
            <S.CloseIcon
              src={`${process.env.PUBLIC_URL}/assets/icons/close.svg`}
              alt="닫기"
            />
          </S.CloseButton>

          {hasImages ? (
            <S.ImageWrapper>
              {/* ✅ 배경: 같은 이미지 cover  */}
              <S.HeroBg src={currentImage} alt="" aria-hidden="true" />
              <S.HeroBgDim aria-hidden="true" />

              {/* ✅ 중앙 메인 이미지: contain */}
              <S.HeroMain>
                <S.HeroMainBox>
                  <S.HeroMainImg src={currentImage} alt="요리 인증 이미지" />
                </S.HeroMainBox>
              </S.HeroMain>

              {images.length > 1 && (
                <S.NavControls>
                  <S.NavButtonLeft
                    disabled={images.length <= 1}
                    onClick={handlePrev}
                    type="button"
                  >
                    <S.NavIcon src="/assets/icons/left.svg" alt="이전" />
                  </S.NavButtonLeft>

                  <S.NavButtonRight
                    disabled={images.length <= 1}
                    onClick={handleNext}
                    type="button"
                  >
                    <S.NavIcon src="/assets/icons/right.svg" alt="다음" />
                  </S.NavButtonRight>
                </S.NavControls>
              )}

              {images.length > 1 && (
                <S.ImageIndex>
                  {safeIndex + 1} / {images.length}
                </S.ImageIndex>
              )}
            </S.ImageWrapper>
          ) : (
            <S.HeroPlaceholder>이미지가 없습니다.</S.HeroPlaceholder>
          )}
        </S.Hero>

        {/* 하단 컨텐츠 영역 */}
        <S.Body>
          {/* 왼쪽 정보 */}
          <S.Left>
            <S.TopRow>
              <S.Nickname>{post?.author?.nickname ?? "익명"}</S.Nickname>

              <S.MetaRight>
                <S.LevelBadge>
                  <S.LevelIcon
                    src={`${process.env.PUBLIC_URL}/assets/icons/star.svg`}
                    alt="레벨"
                  />
                  <span>Lv.{post?.author?.level ?? 1}</span>
                </S.LevelBadge>

                <S.LikeBadge onClick={handleLikeClick}>
                  <S.HeartIcon
                    src={
                      post?.liked
                        ? `${process.env.PUBLIC_URL}/assets/icons/full_heart.svg`
                        : `${process.env.PUBLIC_URL}/assets/icons/empty_heart.svg`
                    }
                    alt="좋아요"
                  />
                  <span>{post?.likes ?? 0}</span>
                </S.LikeBadge>
              </S.MetaRight>
            </S.TopRow>

            <S.DateText>{post?.createdAt ?? ""}</S.DateText>

            <S.Title>{post?.recipeTitle ?? "제목"}</S.Title>
            <S.Desc ref={descRef} $expanded={isExpanded}>
              {post?.content ?? ""}
            </S.Desc>

            {canToggle && (
              <S.DetailLink
                type="button"
                onClick={() => setIsExpanded((v) => !v)}
              >
                {isExpanded ? "간단히" : "자세히 보기"}
              </S.DetailLink>
            )}

            <S.SectionTitle>사용한 재료</S.SectionTitle>

            <S.ChipRow>
              {(post?.postIngredientUsed ?? []).length > 0 ? (
                post.postIngredientUsed.map((item) => (
                  <S.Chip key={item.id}>
                    {item.ingredient?.ingredientName}
                  </S.Chip>
                ))
              ) : (
                <span>사용한 재료를 불러오지 못했어요</span>
              )}
            </S.ChipRow>

            <S.XpBox>
              재료 소진 후 획득 XP : <b>+{post?.xp ?? 0} XP</b>
            </S.XpBox>
          </S.Left>

          {/* 오른쪽 댓글 */}
          <S.Right>
            <S.CommentCard>
              <S.CommentHeader>
                <S.CommentHeaderTop>
                  댓글 <b>{comments.length}</b>
                </S.CommentHeaderTop>
              </S.CommentHeader>

              <S.SectionDivider />

              {/* 댓글 리스트 */}
              <S.CommentScrollArea>
                {comments.length === 0 ? (
                  <S.EmptyComment>
                    아직 댓글이 없어요. 첫 댓글을 남겨보세요!
                  </S.EmptyComment>
                ) : (
                  comments.map((c, idx) => {
                    const mine = isMine(c);
                    const key = `${c.id}-${idx}`;
                    const isEditing = editingKey === key;

                    return (
                      <S.CommentItem key={key}>
                        {/* 닉네임 줄(오른쪽 끝에 메뉴) */}
                        <S.CommentTop>
                          <S.CommentLeft>
                            <S.CommentNickname>
                              {c.member?.memberName ?? "익명"}
                            </S.CommentNickname>

                            <S.CommentMeta>
                              <S.CommentTime>{c.createdAt}</S.CommentTime>
                              {mine && <S.MineTag>나</S.MineTag>}
                            </S.CommentMeta>
                          </S.CommentLeft>

                          {/* 내 댓글만 ⋮ */}
                          {mine && (
                            <S.CommentMenuWrap
                              onClick={(e) => e.stopPropagation()}
                              onMouseDown={(e) => e.stopPropagation()}
                            >
                              <S.KebabButton
                                type="button"
                                aria-label="댓글 옵션"
                                onClick={(e) => {
                                  e.stopPropagation();
                                  if (isEditing) return;

                                  const rect =
                                    e.currentTarget.getBoundingClientRect();

                                  const MENU_W = 110;
                                  const MENU_H = 92;
                                  const GAP = 8;

                                  let top = rect.top - MENU_H - GAP; // 위로
                                  let left = rect.right - MENU_W;

                                  const pad = 8;
                                  top = Math.max(pad, top);
                                  left = Math.max(
                                    pad,
                                    Math.min(
                                      left,
                                      window.innerWidth - MENU_W - pad,
                                    ),
                                  );

                                  setMenuPos({ top, left });

                                  setOpenMenu((prev) =>
                                    prev?.key === key
                                      ? null
                                      : { key, comment: c },
                                  );
                                }}
                              >
                                <S.KebabDots />
                              </S.KebabButton>
                            </S.CommentMenuWrap>
                          )}
                        </S.CommentTop>

                        {/* 텍스트(수정모드면 인라인 편집 + 밑줄 primary) */}
                        <S.CommentTextWrap $editing={isEditing}>
                          {isEditing ? (
                            <S.EditTextarea
                              value={draftText}
                              autoFocus
                              onChange={(e) => setDraftText(e.target.value)}
                              onKeyDown={(e) => {
                                if (e.key === "Enter" && !e.shiftKey) {
                                  e.preventDefault();
                                  saveEdit(c);
                                }
                                if (e.key === "Escape") {
                                  e.preventDefault();
                                  cancelEdit();
                                }
                              }}
                              onClick={(e) => e.stopPropagation()}
                            />
                          ) : (
                            <S.CommentText>{c.content}</S.CommentText>
                          )}
                        </S.CommentTextWrap>

                        {/* 수정중일 때 우측에 작은 저장/취소 */}
                        {isEditing && (
                          <S.EditActionRow>
                            <S.EditActionButton
                              type="button"
                              onClick={cancelEdit}
                            >
                              취소
                            </S.EditActionButton>
                            <S.EditActionButton
                              type="button"
                              $primary
                              onClick={() => saveEdit(c)}
                              disabled={!draftText.trim()}
                            >
                              저장
                            </S.EditActionButton>
                          </S.EditActionRow>
                        )}
                      </S.CommentItem>
                    );
                  })
                )}
              </S.CommentScrollArea>

              {/* 입력 영역 */}
              <S.CommentComposer>
                <S.Textarea
                  value={commentText}
                  onFocus={() => {
                    if (!isAuthenticated) {
                      requireLogin?.(() => {});
                      return;
                    }
                    setIsCommentComposeOpen(true);
                  }}
                  onChange={(e) => setCommentText(e.target.value.slice(0, 300))}
                  placeholder="댓글을 입력하세요(최대 300자)"
                />
                <S.SendButton
                  type="button"
                  onClick={handleSend}
                  aria-label="댓글 전송"
                  $disabled={count === 0}
                  disabled={count === 0}
                >
                  <S.SendIcon
                    src={`${process.env.PUBLIC_URL}/assets/icons/send.svg`}
                    alt="전송"
                  />
                </S.SendButton>
              </S.CommentComposer>

              <S.CounterRow>
                <S.CounterText>{count} / 300</S.CounterText>
              </S.CounterRow>

              {/* 입력 드랍다운 용 취소/저장 */}
              {isCommentComposeOpen && (
                <S.ActionRow>
                  <S.ActionButton
                    type="button"
                    $variant="ghost"
                    onClick={resetComposer}
                  >
                    취소
                  </S.ActionButton>
                  <S.ActionButton
                    type="button"
                    $variant="primary"
                    onClick={handleSend}
                    disabled={count === 0}
                    $disabled={count === 0}
                  >
                    저장
                  </S.ActionButton>
                </S.ActionRow>
              )}
            </S.CommentCard>
          </S.Right>
        </S.Body>
      </S.Modal>

      {/* ✅ 포탈: 스크롤 영역 밖(document.body)으로 메뉴를 빼서 절대 안 잘리게 */}
      {openMenu &&
        menuPos &&
        createPortal(
          <>
            <S.MenuOverlay
              onClick={() => {
                setOpenMenu(null);
                setMenuPos(null);
              }}
            />
            <S.MenuBoxFixed
              style={{ top: menuPos.top, left: menuPos.left }}
              onClick={(e) => e.stopPropagation()}
              onMouseDown={(e) => e.stopPropagation()}
            >
              <S.MenuItem
                type="button"
                $primary
                onMouseEnter={() => setHoverKey(openMenu.key + "-edit")}
                onMouseLeave={() => setHoverKey(null)}
                onClick={() => startEdit(openMenu.key, openMenu.comment)}
              >
                <S.MenuIcon
                  src={
                    hoverKey === openMenu.key + "-edit"
                      ? "/assets/icons/main_pencil.svg"
                      : "/assets/icons/default_pencil.svg"
                  }
                  alt="수정"
                />
                수정
              </S.MenuItem>

              <S.MenuItem
                type="button"
                $danger
                onMouseEnter={() => setHoverKey(openMenu.key + "-del")}
                onMouseLeave={() => setHoverKey(null)}
                onClick={async () => {
                  const c = openMenu.comment;

                  setOpenMenu(null);
                  setMenuPos(null);

                  const ok = window.confirm("댓글을 삭제할까요?");
                  if (!ok || !c?.id || !post?.id) return;

                  const prevComments = comments;

                  // 🔥 즉시 삭제
                  setComments((prev) =>
                    prev.filter((comment) => comment.id !== c.id),
                  );

                  try {
                    await onDeleteComment?.(c);

                    const data = await getCommentsByPostId(post.id);
                    setComments(data);
                  } catch (error) {
                    console.error("댓글 삭제 실패", error);

                    // 롤백
                    setComments(prevComments);
                    alert(error.message);
                  }
                }}
              >
                <S.MenuIcon
                  src={
                    hoverKey === openMenu.key + "-del"
                      ? "/assets/icons/main_trash.svg"
                      : "/assets/icons/default_trash.svg"
                  }
                  alt="삭제"
                />
                삭제
              </S.MenuItem>
            </S.MenuBoxFixed>
          </>,
          document.body,
        )}
    </S.Backdrop>
  );
};

export default CommunityPostModal;
