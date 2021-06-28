import React from "react";
import styled from 'styled-components'

const TagContainer = styled.div`
`;

const Tag = styled.span`
  display: inline-block;
  padding: 0 10px;
  background-color: ${props => props.color};
  border-radius: 10px;
  margin-right: 5px;
  margin-top: 5px;
`;

const Tags = ({tags}) => {

  return (
    <TagContainer>
      {tags.map((tag) => {
        return (
          <Tag key={tag.handle} color={tag.color}>{tag.name}</Tag>
        )
      })}
    </TagContainer>
  )
}

export default Tags
