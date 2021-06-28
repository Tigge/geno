import React, { useState } from "react";
import styled from 'styled-components'

import Lightbox from 'react-image-lightbox'
import 'react-image-lightbox/style.css'

const Gallery = styled.div`
  display: grid;
  grid-template-columns: 50fr 50fr;
  grid-gap: 10px;
  margin: 10px 0;
`;

const GalleryItem = styled.div`
  background-color: #eee;
  padding: 10px;
  cursor: pointer;
`;

const Media = ({mediarefs}) => {

  const [show, setShow] = useState(null)

  if (!mediarefs || mediarefs.length === 0)  {
    return null
  }

  return (
    <Gallery>
    {mediarefs && mediarefs.map((mr) => {
      return (
        <GalleryItem key={mr.media.handle} onClick={() => setShow(mr.media.handle)}>
          <div><img src={`/res/${mr.media.path}`} style={{width: '100%'}}/></div>
          <div>{mr.media.desc}</div>
          {show === mr.media.handle && <Lightbox mainSrc={`/res/${mr.media.path}`} onCloseRequest={() => setShow(null)}/>}
        </GalleryItem>)
      })}
    </Gallery>
  )
}

export default Media
