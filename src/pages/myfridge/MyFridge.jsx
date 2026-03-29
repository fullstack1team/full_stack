import React, { useMemo, useState } from "react";
import { Link } from "react-router-dom";
import AddIngredientModal from "../../components/myfridgecomponents/AddIngredientModal";
import IngredientList from "../../components/myfridgecomponents/IngredientList";
import AddIngredientDetailModal from "../../components/myfridgecomponents/AddIngredientDetailModal";
import S from "./style";

/* ✅ 카테고리 → 아이콘 매핑 */
const CATEGORY_ICONS = {
  채소: "🥕",
  육류: "🥩",
  해산물: "🐟",
  유제품: "🥛",
  가공품: "🥓",
  기타: "🥚",
};

const CATEGORIES = [
  "전체",
  "채소",
  "육류",
  "해산물",
  "유제품",
  "가공품",
  "기타",
];

const MyFridge = () => {
  const [ingredients, setIngredients] = useState([]);
  const [isAddOpen, setIsAddOpen] = useState(false);

  const [activeCategory, setActiveCategory] = useState("전체");
  const [sortType, setSortType] = useState("default");

  const [isDeleteMode, setIsDeleteMode] = useState(false);
  const [selectedIds, setSelectedIds] = useState([]);

  const [editItem, setEditItem] = useState(null);
  const [isEditMode, setIsEditMode] = useState(false);

  const toggleSelected = (fridgeId) => {
    setSelectedIds((prev) =>
      prev.includes(fridgeId)
        ? prev.filter((v) => v !== fridgeId)
        : [...prev, fridgeId],
    );
  };

  /* ✅ 재료 추가 (아이콘 자동 포함) */
  const handleAddIngredients = (newItems) => {
    const now = new Date();

    const completed = newItems.map((x) => ({
      fridgeId: Date.now() + Math.random(),
      name: x.name,
      category: x.category,
      icon: CATEGORY_ICONS[x.category] || "📦",
      quantity: x.quantity === "" ? 0 : Number(x.quantity),
      expiredAt: x.expiredAt || "",
      createdAt: now.toISOString(),
    }));

    setIngredients((prev) => [...prev, ...completed]);
  };

  const filteredIngredients = useMemo(() => {
    if (activeCategory === "전체") return ingredients;
    return ingredients.filter((item) => item.category === activeCategory);
  }, [ingredients, activeCategory]);

  const visibleIngredients = useMemo(() => {
    const arr = [...filteredIngredients];
    if (sortType === "latest") {
      arr.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
    }
    return arr;
  }, [filteredIngredients, sortType]);

  const confirmDelete = () => {
    setIngredients((prev) =>
      prev.filter((item) => !selectedIds.includes(item.fridgeId)),
    );
    setSelectedIds([]);
    setIsDeleteMode(false);
  };

  return (
    <>
      <S.FridgeHeaderSection>
        <S.FridgeHeaderInner>
          <S.TopFixedSection>
            <S.FridgeHeader>
              <S.FridgeTitle>나의 냉장고</S.FridgeTitle>
            </S.FridgeHeader>

            <S.CategoryRow>
              {CATEGORIES.map((cat) => (
                <S.LayoutCategoryTab
                  key={cat}
                  active={activeCategory === cat}
                  onClick={() => setActiveCategory(cat)}
                >
                  {cat}
                </S.LayoutCategoryTab>
              ))}
            </S.CategoryRow>

            <S.FridgeButtonGroup>
              <S.LayoutAddButton onClick={() => setIsAddOpen(true)}>
                재료 추가
              </S.LayoutAddButton>

              <S.LayoutAddButton
                onClick={() => {
                  setIsDeleteMode((prev) => !prev);
                  setSelectedIds([]);
                }}
              >
                재료 삭제
              </S.LayoutAddButton>

              {isDeleteMode && (
                <S.LayoutAddButton onClick={confirmDelete}>
                  삭제 확인
                </S.LayoutAddButton>
              )}

              <S.LayoutAddButton
                onClick={() => {
                  setIsEditMode((prev) => !prev);
                  setIsDeleteMode(false);
                  setSelectedIds([]);
                }}
              >
                재료 수정
              </S.LayoutAddButton>
            </S.FridgeButtonGroup>
          </S.TopFixedSection>
        </S.FridgeHeaderInner>
      </S.FridgeHeaderSection>

      <S.MyFridgeContainer>
        {ingredients.length > 0 && (
          <S.RecommendBanner>
            <S.BannerBackground>
              <S.BannerOverlay>
                <Link to="/foodrecommendation">
                  <S.BannerButton>추천 요리 확인</S.BannerButton>
                </Link>
              </S.BannerOverlay>
            </S.BannerBackground>
          </S.RecommendBanner>
        )}

        {ingredients.length === 0 && !isAddOpen && (
          <S.EmptyWrapper>
            <AddIngredientModal onNext={() => setIsAddOpen(true)} />
          </S.EmptyWrapper>
        )}

        {visibleIngredients.length > 0 && (
          <IngredientList
            items={visibleIngredients}
            deleteMode={isDeleteMode}
            editMode={isEditMode}
            selectedIds={selectedIds}
            onToggle={toggleSelected}
            onEdit={setEditItem}
          />
        )}

        {isAddOpen && (
          <AddIngredientDetailModal
            onClose={() => setIsAddOpen(false)}
            onSubmit={handleAddIngredients}
          />
        )}

        {editItem && (
          <S.ModalOverlay>
            <S.ModalContent>
              <S.ModalBody>
                <h3>재료 수정</h3>

                <S.SelectedRow>
                  <div>수량</div>
                  <input
                    type="number"
                    min="0"
                    value={editItem.quantity}
                    onChange={(e) => {
                      const value = Number(e.target.value);
                      setEditItem({
                        ...editItem,
                        quantity: value < 0 ? 0 : value,
                      });
                    }}
                  />
                </S.SelectedRow>

                <S.SelectedRow>
                  <div>유통기한</div>
                  <input
                    type="date"
                    value={editItem.expiredAt}
                    onChange={(e) =>
                      setEditItem({
                        ...editItem,
                        expiredAt: e.target.value,
                      })
                    }
                  />
                </S.SelectedRow>

                <S.ModalFooter>
                  <S.AddButton
                    onClick={() => {
                      setIngredients((prev) =>
                        prev.map((v) =>
                          v.fridgeId === editItem.fridgeId ? editItem : v,
                        ),
                      );
                      setEditItem(null);
                    }}
                  >
                    수정 완료
                  </S.AddButton>
                </S.ModalFooter>
              </S.ModalBody>
            </S.ModalContent>
          </S.ModalOverlay>
        )}
      </S.MyFridgeContainer>
    </>
  );
};

export default MyFridge;