import React from "react";
import styled from 'styled-components'

const AttributesContainer = styled.div`
  margin: 10px 0;
`;

const Attributes = ({attributes}) => {

  if (!attributes || attributes.length === 0) {
    return null;
  }

  return (
    <AttributesContainer>
      <table>
        <thead>
          <tr><th>Typ</th><th>Värde</th></tr>
        </thead>
        <tbody>
          {attributes.map((attr) => (
            <tr key={attr.type}><td>{attr.type}</td><td>{attr.value}</td></tr>
          ))}
        </tbody>
      </table>
    </AttributesContainer>
  )
}

export default Attributes
