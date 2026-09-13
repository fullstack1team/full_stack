import React from "react";
import * as S from "../../pages/levelandbadge/style";
import BadgeList from "./BadgeList";

const MyBadges = ({ badges = [] }) => {
  return (
    <S.MyBadgeWrap>
      <S.MyBadgeField>
        <S.MyLevelLegend>나의 뱃지</S.MyLevelLegend>
        <S.LevelLabel>특별한 업적을 달성하고 뱃지를 모아보세요</S.LevelLabel>
        <BadgeList badges={badges} />
      </S.MyBadgeField>
    </S.MyBadgeWrap>
  );
};

export default MyBadges;
