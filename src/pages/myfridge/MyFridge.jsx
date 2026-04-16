import { useEffect, useState, useMemo } from "react";
import { Link } from "react-router-dom";
import AddIngredientModal from "../../components/myfridgecomponents/AddIngredientModal";
import IngredientList from "../../components/myfridgecomponents/IngredientList";
import AddIngredientDetailModal from "../../components/myfridgecomponents/AddIngredientDetailModal";
import S from "./style";

/* 카테고리 → 아이콘 */
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

  /* ------------------ 서버에서 데이터 가져오기 ------------------ */
  const fetchFridge = async () => {
    try {
      console.log("현재 페이지 origin:", window.location.origin);

      const res = await fetch("http://localhost:10000/fridge", {
        credentials: "include",
      });
      const data = await res.json();
      console.log("응답 데이터:", data);

      if (!Array.isArray(data)) {
        console.error("서버 에러:", data);
        return;
      }

      const mapped = data.flatMap((item) =>
        item.items.map((sub) => ({
          fridgeId: sub.id,
          name: item.ingredientName,
          category: item.category,
          icon: CATEGORY_ICONS[item.category] || "📦",
          quantity: sub.quantity,
          expiredAt: sub.expireDate ? sub.expireDate.split("T")[0] : "",
          createdAt: sub.expireDate,
        })),
      );

      setIngredients(mapped);
    } catch (e) {
      console.error("🔥 fetchFridge 실패:", e);
    }
  };
  // const fetchFridge = async () => {

  //   const res = await fetch("http://localhost:10000/fridge");

  //   // 🔴 JWT 구현 시 주석해제
  //   // const res = await fetch("http://localhost:10000/fridge", {
  //   //   credentials: "include",
  //   // });
  //   const data = await res.json();

  //   if (!Array.isArray(data)) {
  //     console.error("서버 에러:", data);
  //     return;
  //   }
  //   console.log("응답 데이터:", data);

  //   // 백엔드 group 구조 → 프론트 구조로 변환
  //   const mapped = data.flatMap((item) =>
  //     item.items.map((sub) => ({
  //       fridgeId: sub.id,
  //       name: item.ingredientName,
  //       category: item.category,
  //       icon: CATEGORY_ICONS[item.category] || "📦",
  //       quantity: sub.quantity,
  //       expiredAt: sub.expireDate ? sub.expireDate.split("T")[0] : "",
  //       createdAt: sub.expireDate,
  //     })),
  //   );

  //   setIngredients(mapped);
  // };

  useEffect(() => {
    fetchFridge();
  }, []);

  /* ------------------ 선택 토글 ------------------ */
  const toggleSelected = (fridgeId) => {
    setSelectedIds((prev) =>
      prev.includes(fridgeId)
        ? prev.filter((v) => v !== fridgeId)
        : [...prev, fridgeId],
    );
  };

  /* ------------------ 추가 ------------------ */
  const addIngredient = async (items) => {
    const item = items[0];

    await fetch("http://localhost:10000/fridge", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      credentials: "include",
      body: JSON.stringify({
        ingredientName: item.name,
        category: item.category,
        quantity: Number(item.quantity),
        unit: "ea",
        expireDate: item.expiredAt,
      }),
    });

    fetchFridge();
  };

  /* ------------------ 🔥 삭제 ------------------ */
  const deleteItem = async (id) => {
    await fetch(`http://localhost:10000/fridge/${id}`, {
      method: "DELETE",
      credentials: "include",
    });
  };

  const confirmDelete = async () => {
    await Promise.all(selectedIds.map((id) => deleteItem(id)));

    setSelectedIds([]);
    setIsDeleteMode(false);
    fetchFridge();
  };

  /* ------------------ 수정 ------------------ */
  const updateItem = async (item) => {
    try {
      console.log("수정 요청:", item);

      const body = {
        quantity: Number(item.quantity),
        unit: "ea",
      };

      if (item.expiredAt) {
        body.expireDate = item.expiredAt;
      }

      await fetch(`http://localhost:10000/fridge/${item.fridgeId}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
        body: JSON.stringify(body),
      });

      fetchFridge();
    } catch (e) {
      console.error("수정 에러:", e);
    }
  };

  /* ------------------ 필터 ------------------ */
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
                  $active={activeCategory === cat}
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
            onSubmit={addIngredient}
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
                    onChange={(e) =>
                      setEditItem({
                        ...editItem,
                        quantity: Number(e.target.value),
                      })
                    }
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
                      updateItem(editItem);
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
