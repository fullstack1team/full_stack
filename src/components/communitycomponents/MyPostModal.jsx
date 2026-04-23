// 변경점: "댓글 ⋮ 메뉴"만 createPortal로 document.body에 띄워서
//          CommentScrollArea(overflow: auto)에 안 잘리게 처리!
// 게시글 ⋮(TopRow), 댓글관리 ⋮(헤더) 메뉴는 기존 MenuBox 그대로 유지

import React, {
  useEffect,
  useMemo,
  useState,
  useCallback,
  useRef,
} from "react";
import { createPortal } from "react-dom";
import * as S from "./MyPostModal.style";
import { getCommentsByPostId } from "../../api/comment";

const clamp = (n, min, max) => Math.max(min, Math.min(max, n));

const SELECT_ICON_OFF = "/assets/icons/empty_check_dot.svg";
const SELECT_ICON_ON = "/assets/icons/check_dot_filled.svg";

const MyPostModal = ({
  open,
  onClose,
  post,
  onSubmitComment,
  meNickname,

  onEditComment, // (comment, nextText) => {}
  onDeleteComment, // (comment) => {}

  // 내 게시글/댓글 관리용 (부모에서 연결)
  onEditPost, // (postId, patch) => {}
  onDeletePost, // (postId) => {}
  onEditPostImage, // (postId, index, fileOrUrl) => {}
  onDeleteSelectedComments, // (postId, selectedKeysOrIndexes) => {}
}) => {
  // 이미지/댓글
  const [activeIndex, setActiveIndex] = useState(0);
  const images = useMemo(() => post?.images ?? [], [post]);
  const [comments, setComments] = useState([]);
  const hasImages = images.length > 0;
  const safeIndex = clamp(activeIndex, 0, Math.max(0, images.length - 1));
  const currentImage = hasImages ? images[safeIndex] : "";

  // 댓글 작성
  const [commentText, setCommentText] = useState("");
  const [isCommentComposeOpen, setIsCommentComposeOpen] = useState(false);

  // 댓글 인라인 편집
  const [editingKey, setEditingKey] = useState(null);
  const [draftText, setDraftText] = useState("");
  const [hoverKey, setHoverKey] = useState(null);

  // ✅ 댓글 ⋮ 메뉴(포탈) 상태/위치
  const [openCommentMenu, setOpenCommentMenu] = useState(null); // { key, comment } | null
  const [commentMenuPos, setCommentMenuPos] = useState(null); // { top, left } | null

  // 게시글(TopRow) ⋮ 메뉴 + 게시글 편집 모드
  const [openPostMenu, setOpenPostMenu] = useState(false);
  const [isPostEditing, setIsPostEditing] = useState(false);
  const [postDraftTitle, setPostDraftTitle] = useState("");
  const [postDraftContent, setPostDraftContent] = useState("");
  const [postDraftIngredients, setPostDraftIngredients] = useState("");

  // 댓글 관리 메뉴(헤더) + 선택삭제/댓글수정(관리자 수정)
  const [openCommentAdminMenu, setOpenCommentAdminMenu] = useState(false);
  const [selectMode, setSelectMode] = useState(false);
  const [selectedKeys, setSelectedKeys] = useState(() => new Set());

  // 본문 펼치기/접기
  const [isExpanded, setIsExpanded] = useState(false);
  const [canToggle, setCanToggle] = useState(false);
  const descRef = useRef(null);

  // “내 글인지” 판별
  const isPostMine = useMemo(() => {
    const authorNick = String(post?.author?.nickname ?? "").trim();
    const me = String(meNickname ?? "").trim();
    return !!authorNick && !!me && authorNick === me;
  }, [post?.author?.nickname, meNickname]);

  const isMine = useCallback(
    (c) => {
      if (!meNickname) return false;
      return (
        String(c?.member?.memberName ?? "").trim() === String(meNickname).trim()
      );
    },
    [meNickname],
  );

  // ===== 이미지 슬라이드 =====
  const handlePrev = useCallback(() => {
    if (!hasImages) return;
    setActiveIndex((prev) => (prev - 1 + images.length) % images.length);
  }, [hasImages, images.length]);

  const handleNext = useCallback(() => {
    if (!hasImages) return;
    setActiveIndex((prev) => (prev + 1) % images.length);
  }, [hasImages, images.length]);

  // ===== 댓글 전송 =====
  const resetComposer = useCallback(() => {
    setCommentText("");
    setIsCommentComposeOpen(false);
  }, []);

  const handleSend = useCallback(async () => {
    const text = commentText.trim();
    if (!text || !post?.id) return;

    //  낙관적 UI
    const optimistic = {
      id: Date.now(),
      content: text,
      createdAt: new Date().toISOString(),
      nickname: meNickname || "나",
    };

    setComments((prev) => [optimistic, ...prev]);

    setCommentText("");
    setIsCommentComposeOpen(false);

    try {
      await onSubmitComment?.(text);

      //  서버에서 최신 데이터 다시 가져오기
      const data = await getCommentsByPostId(post.id);
      setComments(data);
    } catch (err) {
      console.error(err);
      alert("댓글 생성 실패");

      // 롤백
      setComments((prev) => prev.filter((c) => c.id !== optimistic.id));
    }
  }, [commentText, post?.id, onSubmitComment, meNickname]);

  // ===== 댓글 편집 =====
  const startEdit = useCallback((key, c) => {
    setEditingKey(key);
    setDraftText(c?.content ?? "");
    setOpenCommentMenu(null);
    setCommentMenuPos(null);
  }, []);

  const cancelEdit = useCallback(() => {
    setEditingKey(null);
    setDraftText("");
  }, []);

  const saveEdit = useCallback(
    (c) => {
      const next = draftText.trim();
      if (!next) return;
      onEditComment?.(c, next);
      setEditingKey(null);
      setDraftText("");
    },
    [draftText, onEditComment],
  );

  // ✅ 댓글 key 목록 (select all 계산용)
  const allCommentKeys = useMemo(() => {
    return comments.map((c, idx) => `${c.id}-${idx}`);
  }, [comments]);

  const allSelected = useMemo(() => {
    return (
      allCommentKeys.length > 0 && selectedKeys.size === allCommentKeys.length
    );
  }, [allCommentKeys.length, selectedKeys.size]);

  // ===== 선택 토글 (1개) =====
  const toggleSelect = useCallback((key) => {
    setSelectedKeys((prev) => {
      const next = new Set(prev);
      if (next.has(key)) next.delete(key);
      else next.add(key);
      return next;
    });
  }, []);

  // ===== 전체 선택 토글 =====
  const toggleSelectAll = useCallback(() => {
    setSelectedKeys((prev) => {
      // 이미 전체 선택이면 -> 전체 해제
      if (allCommentKeys.length > 0 && prev.size === allCommentKeys.length) {
        return new Set();
      }
      // 아니면 -> 전체 선택
      return new Set(allCommentKeys);
    });
  }, [allCommentKeys]);

  // ===== 선택 삭제 실행 =====
  const handleDeleteSelected = useCallback(() => {
    if (!post?.id) return;
    if (selectedKeys.size === 0) return;

    const ok = window.confirm("선택한 댓글을 삭제할까요?");
    if (!ok) return;

    onDeleteSelectedComments?.(post.id, Array.from(selectedKeys));
    setSelectedKeys(new Set());
    setSelectMode(false);
  }, [post?.id, selectedKeys, onDeleteSelectedComments]);

  // ===== selectMode 종료 =====
  const exitSelectMode = useCallback(() => {
    setSelectMode(false);
    setSelectedKeys(new Set());
  }, []);

  // ===== 게시글 편집 draft 초기화 =====
  // 터미널 에러 (경고니까 그냥 무시) eslint-disable-next-line react-hooks/exhaustive-deps 
  useEffect(() => {
    if (!open) return;

    setActiveIndex(0);
    setCommentText("");
    setIsCommentComposeOpen(false);

    setEditingKey(null);
    setDraftText("");
    setHoverKey(null);

    setOpenCommentMenu(null);
    setCommentMenuPos(null);

    setOpenPostMenu(false);
    setIsPostEditing(false);

    setOpenCommentAdminMenu(false);
    setSelectMode(false);
    setSelectedKeys(new Set());

    setIsExpanded(false);

    setPostDraftTitle(post?.recipeTitle ?? "");
    setPostDraftContent(post?.content ?? "");
    setPostDraftIngredients((post?.ingredients ?? []).join(", "));
  }, [open, post?.id]);

  // ===== 게시글 이미지 수정(file input) =====
  const fileRef = useRef(null);

  const handleClickImageEdit = useCallback(() => {
    fileRef.current?.click();
  }, []);

  const handlePickImage = useCallback(
    (e) => {
      const file = e.target.files?.[0];
      if (!file) return;

      onEditPostImage?.(post?.id, safeIndex, file);
      e.target.value = "";
    },
    [onEditPostImage, post?.id, safeIndex],
  );

  // ===== 게시글 수정 저장/취소 =====
  const cancelPostEdit = useCallback(() => {
    setIsPostEditing(false);
    setPostDraftTitle(post?.recipeTitle ?? "");
    setPostDraftContent(post?.content ?? "");
    setPostDraftIngredients((post?.ingredients ?? []).join(", "));
  }, [post?.recipeTitle, post?.content, post?.ingredients]);

  const savePostEdit = useCallback(() => {
    const patch = {
      recipeTitle: postDraftTitle.trim(),
      content: postDraftContent.trim(),
      ingredients: postDraftIngredients
        .split(",")
        .map((s) => s.trim())
        .filter(Boolean),
    };

    onEditPost?.(post?.id, patch);
    setIsPostEditing(false);
  }, [
    post?.id,
    postDraftTitle,
    postDraftContent,
    postDraftIngredients,
    onEditPost,
  ]);

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

  // ===== 자세히 보기/간단히 토글 가능 여부 =====
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

  // ===== ESC/좌우/전송 =====
  const openCommentMenuRef = useRef(openCommentMenu);
  const editingKeyRef = useRef(editingKey);

  useEffect(() => {
    openCommentMenuRef.current = openCommentMenu;
  }, [openCommentMenu]);

  useEffect(() => {
    editingKeyRef.current = editingKey;
  }, [editingKey]);

  useEffect(() => {
    if (!open) return;

    const onKeyDown = (e) => {
      if (e.key === "Escape") {
        if (editingKeyRef.current) {
          cancelEdit();
          return;
        }
        if (openCommentMenuRef.current) {
          setOpenCommentMenu(null);
          setCommentMenuPos(null);
          return;
        }
        if (selectMode) {
          exitSelectMode();
          return;
        }
        if (openPostMenu) setOpenPostMenu(false);
        if (openCommentAdminMenu) setOpenCommentAdminMenu(false);
        onClose?.();
      }
      if (e.key === "ArrowLeft") handlePrev();
      if (e.key === "ArrowRight") handleNext();
      if ((e.ctrlKey || e.metaKey) && e.key === "Enter") handleSend();
    };

    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [
    open,
    onClose,
    handlePrev,
    handleNext,
    handleSend,
    cancelEdit,
    openPostMenu,
    openCommentAdminMenu,
    selectMode,
    exitSelectMode,
  ]);

  // ✅ 포탈 댓글 메뉴 열려있을 때: 스크롤/리사이즈 시 닫기
  useEffect(() => {
    if (!openCommentMenu) return;

    const close = () => {
      setOpenCommentMenu(null);
      setCommentMenuPos(null);
    };

    window.addEventListener("scroll", close, true);
    window.addEventListener("resize", close);
    return () => {
      window.removeEventListener("scroll", close, true);
      window.removeEventListener("resize", close);
    };
  }, [openCommentMenu]);

  // ===== 메뉴 바깥 클릭 닫기 (게시글 ⋮ / 댓글관리 ⋮) =====
  useEffect(() => {
    if (!open) return;

    const handleWindowClick = () => {
      setOpenPostMenu(false);
      setOpenCommentAdminMenu(false);
    };

    window.addEventListener("click", handleWindowClick);
    return () => window.removeEventListener("click", handleWindowClick);
  }, [open]);

  if (!open) return null;

  const count = commentText.length;

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
        {/* 이미지 업로드 input */}
        <input
          ref={fileRef}
          type="file"
          accept="image/*"
          style={{ display: "none" }}
          onChange={handlePickImage}
        />

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
              <S.HeroBg src={currentImage} alt="" aria-hidden="true" />
              <S.HeroBgDim aria-hidden="true" />

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

        {/* 하단 */}
        <S.Body>
          {/* LEFT */}
          <S.Left>
            <S.TopRow>
              <S.TopLeft>
                <S.Nickname>{post?.author?.nickname ?? "익명"}</S.Nickname>

                <S.MetaRight>
                  <S.LevelBadge>
                    <S.LevelIcon
                      src={`${process.env.PUBLIC_URL}/assets/icons/star.svg`}
                      alt="레벨"
                    />
                    <span>Lv.{post?.author?.level ?? 1}</span>
                  </S.LevelBadge>

                  <S.LikeBadge>
                    <S.HeartIcon
                      src={`${process.env.PUBLIC_URL}/assets/icons/heart.svg`}
                      alt="좋아요"
                    />
                    <span>{post?.likes ?? 0}</span>
                  </S.LikeBadge>
                </S.MetaRight>
              </S.TopLeft>

              {/* 내 게시글이면 게시글 관리 ⋮ */}
              {isPostMine && (
                <S.PostMenuWrap
                  onClick={(e) => e.stopPropagation()}
                  onMouseDown={(e) => e.stopPropagation()}
                >
                  <S.KebabButton
                    type="button"
                    aria-label="게시글 옵션"
                    onClick={(e) => {
                      e.stopPropagation();
                      setOpenPostMenu((v) => !v);
                    }}
                  >
                    <S.KebabDots />
                  </S.KebabButton>

                  {openPostMenu && (
                    <S.MenuBox
                      $direction="down"
                      $w={120}
                      onClick={(e) => e.stopPropagation()}
                      onMouseDown={(e) => e.stopPropagation()}
                    >
                      <S.MenuItem
                        type="button"
                        onMouseEnter={() => setHoverKey("post-edit-img")}
                        onMouseLeave={() => setHoverKey(null)}
                        onClick={() => {
                          setOpenPostMenu(false);
                          handleClickImageEdit();
                        }}
                      >
                        <S.MenuIcon
                          src={
                            hoverKey === "post-edit-img"
                              ? "/assets/icons/hover_edit_img.svg"
                              : "/assets/icons/default_edit_img.svg"
                          }
                          alt="이미지 수정"
                        />
                        이미지 수정
                      </S.MenuItem>

                      <S.MenuItem
                        type="button"
                        $primary
                        onMouseEnter={() => setHoverKey("post-edit")}
                        onMouseLeave={() => setHoverKey(null)}
                        onClick={() => {
                          setOpenPostMenu(false);
                          setIsPostEditing(true);
                        }}
                      >
                        <S.MenuIcon
                          src={
                            hoverKey === "post-edit"
                              ? "/assets/icons/main_pencil.svg"
                              : "/assets/icons/default_pencil.svg"
                          }
                          alt="게시글 수정"
                        />
                        게시글 수정
                      </S.MenuItem>

                      <S.MenuItem
                        type="button"
                        $danger
                        onMouseEnter={() => setHoverKey("post-del")}
                        onMouseLeave={() => setHoverKey(null)}
                        onClick={() => {
                          setOpenPostMenu(false);
                          const ok = window.confirm("게시글을 삭제할까요?");
                          if (ok) onDeletePost?.(post?.id);
                        }}
                      >
                        <S.MenuIcon
                          src={
                            hoverKey === "post-del"
                              ? "/assets/icons/main_trash.svg"
                              : "/assets/icons/default_trash.svg"
                          }
                          alt="게시글 삭제"
                        />
                        게시글 삭제
                      </S.MenuItem>
                    </S.MenuBox>
                  )}
                </S.PostMenuWrap>
              )}
            </S.TopRow>

            <S.DateText>{post?.createdAt ?? ""}</S.DateText>

            {/* 게시글 수정 모드 */}
            {isPostEditing ? (
              <>
                <S.EditTitleInput
                  value={postDraftTitle}
                  onChange={(e) => setPostDraftTitle(e.target.value)}
                  placeholder="제목"
                />

                <S.EditPostTextarea
                  value={postDraftContent}
                  onChange={(e) => setPostDraftContent(e.target.value)}
                  placeholder="내용"
                />

                <S.EditIngredientsInput
                  value={postDraftIngredients}
                  onChange={(e) => setPostDraftIngredients(e.target.value)}
                  placeholder="재료를 콤마로 구분 (예: 밀가루, 생크림)"
                />

                <S.PostEditActionRow>
                  <S.PostEditButton type="button" onClick={cancelPostEdit}>
                    취소
                  </S.PostEditButton>
                  <S.PostEditButton
                    type="button"
                    $primary
                    onClick={savePostEdit}
                  >
                    저장
                  </S.PostEditButton>
                </S.PostEditActionRow>
              </>
            ) : (
              <>
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
                  {(post?.ingredients ?? []).map((ing) => (
                    <S.Chip key={ing}>{ing}</S.Chip>
                  ))}
                </S.ChipRow>

                <S.XpBox>
                  재료 소진 후 획득 XP : <b>+{post?.xp ?? 0} XP</b>
                </S.XpBox>
              </>
            )}
          </S.Left>

          {/* RIGHT */}
          <S.Right>
            <S.CommentCard>
              {/* 댓글 헤더 */}
              {/* 댓글 헤더 */}
              <S.CommentHeader>
                {/* 1) 왼쪽: 댓글 수 */}
                <S.CommentHeaderTop>
                  댓글 <b>{comments.length}</b>
                </S.CommentHeaderTop>

                {/* 2) 가운데: 전체선택 (selectMode일 때만) */}
                {isPostMine && selectMode && (
                  <S.CommentHeaderCenter>
                    <S.SelectAllButton type="button" onClick={toggleSelectAll}>
                      <S.SelectAllText>전체 선택</S.SelectAllText>
                      <S.SelectAllIcon
                        src={allSelected ? SELECT_ICON_ON : SELECT_ICON_OFF}
                        alt="전체 선택"
                      />
                    </S.SelectAllButton>
                  </S.CommentHeaderCenter>
                )}

                {/* 3) 오른쪽: selectMode면 취소/삭제, 아니면 ⋮ */}
                <S.CommentHeaderRight>
                  {isPostMine && selectMode ? (
                    <S.SelectActionBar>
                      <S.PostEditButton type="button" onClick={exitSelectMode}>
                        취소
                      </S.PostEditButton>
                      <S.PostEditButton
                        type="button"
                        $danger
                        disabled={selectedKeys.size === 0}
                        onClick={handleDeleteSelected}
                      >
                        삭제
                      </S.PostEditButton>
                    </S.SelectActionBar>
                  ) : (
                    <>
                      {isPostMine && (
                        <S.CommentHeaderMenuWrap
                          onClick={(e) => e.stopPropagation()}
                          onMouseDown={(e) => e.stopPropagation()}
                        >
                          <S.KebabButton
                            type="button"
                            aria-label="댓글 관리"
                            onClick={(e) => {
                              e.stopPropagation();
                              setOpenCommentAdminMenu((v) => !v);
                            }}
                          >
                            <S.KebabDots />
                          </S.KebabButton>

                          {openCommentAdminMenu && (
                            <S.MenuBox
                              $direction="down"
                              $w={120}
                              onClick={(e) => e.stopPropagation()}
                              onMouseDown={(e) => e.stopPropagation()}
                            >
                              <S.MenuItem
                                type="button"
                                $danger
                                onMouseEnter={() =>
                                  setHoverKey("admin-del-all")
                                }
                                onMouseLeave={() => setHoverKey(null)}
                                onClick={() => {
                                  setOpenCommentAdminMenu(false);
                                  setSelectMode(true);
                                  setSelectedKeys(new Set(allCommentKeys));
                                }}
                              >
                                <S.MenuIcon
                                  src={
                                    hoverKey === "admin-del-all"
                                      ? "/assets/icons/main_trash.svg"
                                      : "/assets/icons/default_trash.svg"
                                  }
                                  alt="전체 선택"
                                />
                                전체 삭제
                              </S.MenuItem>

                              <S.MenuItem
                                type="button"
                                onMouseEnter={() =>
                                  setHoverKey("admin-del-select")
                                }
                                onMouseLeave={() => setHoverKey(null)}
                                onClick={() => {
                                  setOpenCommentAdminMenu(false);
                                  setSelectMode(true);
                                  setSelectedKeys(new Set());
                                }}
                              >
                                <S.MenuIcon
                                  src={
                                    hoverKey === "admin-del-select"
                                      ? "/assets/icons/hover_check_circle_broken.svg"
                                      : "/assets/icons/default_check_circle_broken.svg"
                                  }
                                  alt="선택 삭제"
                                />
                                선택 삭제
                              </S.MenuItem>
                            </S.MenuBox>
                          )}
                        </S.CommentHeaderMenuWrap>
                      )}
                    </>
                  )}
                </S.CommentHeaderRight>
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

                    // ✅ selectMode에서는 케밥 숨김(우측에 선택 아이콘이 있어야 하니까)
                    const canShowKebab = !selectMode && mine;
                    const isSelected = selectedKeys.has(key);

                    return (
                      <S.CommentItem key={key}>
                        <S.CommentTop>
                          <S.CommentLeft>
                            <S.CommentNickname>{c.member?.memberName ?? "익명"}</S.CommentNickname>

                            <S.CommentMeta>
                              <S.CommentTime>{c.createdAt}</S.CommentTime>
                              {mine && <S.MineTag>나</S.MineTag>}
                            </S.CommentMeta>
                          </S.CommentLeft>

                          {/* ✅ selectMode면 우측 선택 아이콘 */}
                          {isPostMine && selectMode && (
                            <S.SelectRowButton
                              type="button"
                              onClick={(e) => {
                                e.stopPropagation();
                                toggleSelect(key);
                              }}
                              aria-label="댓글 선택"
                            >
                              <S.SelectRowIcon
                                src={
                                  isSelected ? SELECT_ICON_ON : SELECT_ICON_OFF
                                }
                                alt={isSelected ? "선택됨" : "선택 안 됨"}
                              />
                            </S.SelectRowButton>
                          )}

                          {/* ✅ 댓글 ⋮ (포탈로 띄움) */}
                          {canShowKebab && (
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

                                  let top = rect.top - MENU_H - GAP;
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

                                  setCommentMenuPos({ top, left });
                                  setOpenCommentMenu((prev) =>
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
                  onFocus={() => setIsCommentComposeOpen(true)}
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

        {/* ✅ 포탈: 댓글 ⋮ 메뉴 */}
        {openCommentMenu &&
          commentMenuPos &&
          createPortal(
            <>
              <S.MenuOverlay
                onClick={() => {
                  setOpenCommentMenu(null);
                  setCommentMenuPos(null);
                }}
              />
              <S.MenuBoxFixed
                style={{ top: commentMenuPos.top, left: commentMenuPos.left }}
                onClick={(e) => e.stopPropagation()}
                onMouseDown={(e) => e.stopPropagation()}
              >
                <S.MenuItem
                  type="button"
                  $primary
                  onMouseEnter={() =>
                    setHoverKey(openCommentMenu.key + "-edit")
                  }
                  onMouseLeave={() => setHoverKey(null)}
                  onClick={() =>
                    startEdit(openCommentMenu.key, openCommentMenu.comment)
                  }
                >
                  <S.MenuIcon
                    src={
                      hoverKey === openCommentMenu.key + "-edit"
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
                  onMouseEnter={() => setHoverKey(openCommentMenu.key + "-del")}
                  onMouseLeave={() => setHoverKey(null)}
                  onClick={() => {
                    const c = openCommentMenu.comment;
                    setOpenCommentMenu(null);
                    setCommentMenuPos(null);
                    onDeleteComment?.(c);
                  }}
                >
                  <S.MenuIcon
                    src={
                      hoverKey === openCommentMenu.key + "-del"
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
      </S.Modal>
    </S.Backdrop>
  );
};

export default MyPostModal;
