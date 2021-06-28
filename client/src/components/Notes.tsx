import React from "react";
import styled from 'styled-components'
import { useTranslation } from 'react-i18next';

import Tags from "./Tags";

const NoteContainer = styled.div`
  margin: 10px 0;
`;

const Note = styled.div`
  background-color: #eee;
  padding: 10px;
`;

const NoteHeader = styled.div`
  font-weight: bold;
`

const NoteBody = styled.div`
  white-space: pre-wrap;
`

const Notes = ({notes}) => {

  const {t, i18n} = useTranslation();

  return (
    <NoteContainer>
      {notes.map(note => {
        return (
          <Note key={note.handle}>
            <NoteHeader>{t(`note.type.${note.type}`)}</NoteHeader>
            <NoteBody style={{}}>{note.text}</NoteBody>
            <Tags tags={note.tags} />
          </Note>
        )
      })}
    </NoteContainer>
  )
}

export default Notes
