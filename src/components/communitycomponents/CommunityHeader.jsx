import React, { useEffect, useRef, useState } from "react";
import * as S from "../../pages/community/style";

// 기본 옵션(커뮤니티에서 사용)
const DEFAULT_SORT_OPTIONS = [
  { key: "latest", label: "최신순" },
  { key: "popular", label: "인기순" },
];

export const CommunityHeader = ({
  title = "요리 인증 커뮤니티",
  placeholder = "요리명, 코멘트, 재료로 검색...",
  showSort = true,
  sortOptions = DEFAULT_SORT_OPTIONS,
  defaultSortKey,
  onSearch, // ({ keyword, sort }) => void
  onSortChange, // (option) => void
}) => {
  const dropdownRef = useRef(null);

  const initialSort =
    sortOptions.find((o) => o.key === defaultSortKey) || sortOptions[0];

  const [isOpen, setIsOpen] = useState(false);
  const [sort, setSort] = useState(initialSort);

  // 바깥 클릭하면 닫기
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (!dropdownRef.current) return;
      if (!dropdownRef.current.contains(e.target)) setIsOpen(false);
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleSelect = (option) => {
    setSort(option);
    setIsOpen(false);
    onSortChange?.(option);
  };

  const [keyword, setKeyword] = useState("");
  const [isError, setIsError] = useState(false);
  const [triedSubmit, setTriedSubmit] = useState(false); // 검색 시도 여부


  const handleSubmit = (e) => {
    e.preventDefault();

    setTriedSubmit(true); // “검색 시도했다” 기록

    const searchKeyword = keyword.trim();

    // ❌ 빈 검색어
    if (!searchKeyword) {
      setIsError(true);
      // 흔들림 다시 트리거용 (같은 에러 연속 입력 대응)
      setTimeout(() => setIsError(false), 400);
      return;
    }

    setIsError(false);
    onSearch?.({ keyword: searchKeyword, sort: sort.key });
  };

  const showError = triedSubmit && isError;

  return (
    <S.HeaderSection>
      <S.Title>{title}</S.Title>

      <S.SearchRow>
        <S.SearchWrap as="form" onSubmit={handleSubmit} $error={showError}>
          <S.SearchInput
            value={keyword}
            onChange={(e) => {
              setKeyword(e.target.value);
              if (triedSubmit) setIsError(false);
            }}
            placeholder={placeholder}
          />
          <S.SearchButton as="button" type="submit" aria-label="검색">
            <S.SearchIcon src="/assets/icons/search.svg" alt="검색 아이콘" />
          </S.SearchButton>
        </S.SearchWrap>

        {showSort && (
          <S.DropdownWrap ref={dropdownRef}>
            <S.FilterButton
              type="button"
              onClick={() => setIsOpen((prev) => !prev)}
            >
              <S.FilterIcon src="/assets/icons/filter.svg" alt="정렬 아이콘" />
              {sort.label}
            </S.FilterButton>

            {isOpen && (
              <S.DropdownMenu>
                {sortOptions.map((opt) => (
                  <S.DropdownItem
                    key={opt.key}
                    type="button"
                    $active={opt.key === sort.key}
                    onClick={() => handleSelect(opt)}
                  >
                    {opt.label}
                  </S.DropdownItem>
                ))}
              </S.DropdownMenu>
            )}
          </S.DropdownWrap>
        )}
      </S.SearchRow>
    </S.HeaderSection>
  );
};
