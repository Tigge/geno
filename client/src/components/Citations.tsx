import React, { useState } from "react";
import styled from 'styled-components'
import { useTranslation } from 'react-i18next';

import Notes from "./Notes";
import Media from "./Media";
import Attributes from "./Attributes";
import Rating from "./Rating";

import ArkivDigitalIcon from "../icons/ArkivDigital.svg"
import RiksarkivetIcon from "../icons/Riksarkivet.svg"
import CheckIcon from "../icons/Check.svg"
import WarningIcon from "../icons/Warning.svg"

const Sources = styled.div`
  font-size: 12px;
`;

const SourceHeader = styled.div`
  color: #666;
  font-weight: bolder;
`;

const SourceBody = styled.div`
  margin-left: 20px;
  margin-top: 10px;
`;

const SourceList = styled.ol`
  padding-left: 14px;
  margin: 0;
`;

const SourceItem = styled.li`
`;


const SourceExpander = styled.span`
  cursor: pointer;
`;

const Citations = ({citations}) => {

  const {t, i18n} = useTranslation();
  const [showSources, setShowSources] = useState(false)

  if (citations.length === 0) {
    return (
      <Sources>
        <SourceHeader>
          <WarningIcon height="14" style={{verticalAlign: "middle"}} />Inga källor
        </SourceHeader>
      </Sources>
    )
  }

  return (
    <Sources>
      <SourceHeader >
        <CheckIcon height="14" style={{verticalAlign: "middle"}} />Källa finns
        {' - '}<SourceExpander onClick={() => setShowSources(!showSources)}>{showSources ? 'dölj' : 'visa'}</SourceExpander>
      </SourceHeader>
      {showSources &&
        <SourceBody>
          <SourceList>
            {citations && citations.map((c) => {

              const rid = c.attributes.find(a => a.type === 'RID')
              const aid = c.attributes.find(a => a.type === 'AID')

              return (
                <SourceItem key={c.handle}>
                  {/*c.source.repositoryrefs.map(r => {
                    return (
                      <strong>{r.repository.name}{` (${r.repository.grampsId})`}</strong>
                    )
                  })*/}
                  <div>
                    <strong>
                      {c.source.title}{` (${c.source.grampsId})`}
                      {c.source.author ? ` - ${c.source.author}` : ''}
                      {c.source.pubinfo ? ` - ${c.source.pubinfo}` : ''}
                    </strong>
                    {c.page && `, ${c.page}`}
                  </div>
                  <div>
                    {(aid || rid) && 'Visa källa: '}
                    {aid &&
                      <a href={`https://app.arkivdigital.se/aid/${aid.value}`}>
                        <ArkivDigitalIcon  width="16" height="16" />
                      </a>
                    }
                    {rid &&
                      <a href={`https://sok.riksarkivet.se/bildvisning/${rid.value}`}>
                        <RiksarkivetIcon  width="16" height="16" />
                      </a>
                    }
                    Tillförlitlighet: {t(`citation.confidence.${c.confidence}`)} <Rating score={c.confidence} />
                    <Media mediarefs={c.mediarefs} />
                    <Notes notes={c.notes} />
                    <Attributes attributes={c.attributes} />
                  </div>
                </SourceItem>
              )
            })}
          </SourceList>
      </SourceBody>}
    </Sources>
  )
}

export default Citations
