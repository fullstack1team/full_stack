import React from "react";
import * as S from '../../pages/levelandbadge/style';
import LevelComponent from "./LevelComponent";

const MyLevelComponent1 = ({ userData }) => {
  return (
    <S.MyLevelWrap>
      <S.MyLevelField>
        <S.MyLevelLegend>나의 레벨</S.MyLevelLegend>
        <LevelComponent userData={userData} />
      </S.MyLevelField>
    </S.MyLevelWrap>
  );
};

export default MyLevelComponent1;