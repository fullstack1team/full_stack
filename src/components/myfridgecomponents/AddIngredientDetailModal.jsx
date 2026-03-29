import React, { useState } from "react";
import S from "../../pages/myfridge/style";

const CATEGORY_ICONS = {
  채소: "🥕",
  육류: "🥩",
  해산물: "🐟",
  유제품: "🥛",
  가공품: "🥓",
  기타: "🥚",
};

const AddIngredientDetailModal = ({ onClose, onSubmit }) => {
  const [name, setName] = useState("");
  const [category, setCategory] = useState("채소");
  const [quantity, setQuantity] = useState("");
  const [expiredAt, setExpiredAt] = useState("");

  const handleSubmit = () => {
    if (!name) return alert("재료명을 입력해주세요");

    onSubmit([
      { name, category, quantity, expiredAt }
    ]);

    onClose();
  };

  return (
    <S.ModalOverlay>
      <S.ModalContent>
        <S.ModalBody>
          <h3>재료 추가</h3>

          <S.SelectedRow>
            <div>재료명</div>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
          </S.SelectedRow>

          <S.SelectedRow>
            <div>카테고리</div>
            <select
              value={category}
              onChange={(e) => setCategory(e.target.value)}
            >
              {Object.keys(CATEGORY_ICONS.map ? {} : CATEGORY_ICONS).map((cat) => (
                <option key={cat}>{cat}</option>
              ))}
            </select>
            <span style={{ fontSize: "20px" }}>
              {CATEGORY_ICONS[category]}
            </span>
          </S.SelectedRow>

          <S.SelectedRow>
            <div>수량</div>
            <input
              type="number"
              min="0"
              value={quantity}
              onChange={(e) => setQuantity(e.target.value)}
            />
          </S.SelectedRow>

          <S.SelectedRow>
            <div>유통기한</div>
            <input
              type="date"
              value={expiredAt}
              onChange={(e) => setExpiredAt(e.target.value)}
            />
          </S.SelectedRow>

          <S.ModalFooter>
            <S.AddButton onClick={handleSubmit}>
              재료 추가
            </S.AddButton>
          </S.ModalFooter>
        </S.ModalBody>
      </S.ModalContent>
    </S.ModalOverlay>
  );
};

export default AddIngredientDetailModal;