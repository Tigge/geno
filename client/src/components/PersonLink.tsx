import React from "react";
import { Link } from "react-router-dom";

import styled, { createGlobalStyle } from 'styled-components'

const PersonLink = ({person}) => {
  return (
    <Link to={`/person/${person.handle}`}>{person.name}</Link>
  )
}

export default PersonLink
