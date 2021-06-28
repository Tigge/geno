import React from "react";
import styled from 'styled-components'
import { useTranslation } from 'react-i18next';

import StarFilledIcon from "../icons/StarFilled.svg"
import StarEmptyIcon from "../icons/StarEmpty.svg"

const RatingContainer = styled.div`
`;

const Rating = ({score}) => {

  const {t, i18n} = useTranslation();

  return (
    <RatingContainer title={t(`citation.confidence_description.${score}`)}>
      {[0, 1, 2, 3, 4].map(n => {
        return score >= n ? <StarFilledIcon key={n} /> : <StarEmptyIcon key={n} />
      })}
    </RatingContainer>
  )
}

export default Rating
