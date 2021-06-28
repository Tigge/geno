import React, { useState } from "react";
import { Link } from "react-router-dom";
import { gql } from 'apollo-boost';
import { useQuery } from '@apollo/react-hooks';
import styled from 'styled-components'
import { useTranslation } from 'react-i18next';

import Map from "./Map";
import Media from "./Media";
import Citations from "./Citations";
import PersonLink from "./PersonLink";

import DeathIcon from "../icons/Death.svg"
import ResidenceIcon from "../icons/Residence.svg"
import BirthIcon from "../icons/Birth.svg"


const icons = {
  Death: <DeathIcon  width="24" height="24" style={{verticalAlign: "middle", marginTop: "6px", marginRight: '6px'}} />,
  Residence: <ResidenceIcon  width="24" height="24" style={{verticalAlign: "middle", marginTop: "6px", marginRight: '6px'}} />,
  Birth: <BirthIcon width="24" height="24" style={{verticalAlign: "middle", marginTop: "6px", marginRight: '6px'}} />
}

const EventContainer = styled.div`
  margin-bottom: 20px;
  padding: 20px;
  background-color: white;
`;

const Sources = styled.div`
  background-color: #eee;
  padding: 10px;
  font-size: 12px;
`;

const SourceHeader = styled.div`
  color: #666;
  font-weight: bolder;
`;

const SourceList = styled.ol`
  padding-left: 14px;
  margin: 0;
`;

const SourceItem = styled.li`
`;


const Event = ({id}) => {

  const query = useQuery(gql`
  {
    event(handle: "${id}") {
      handle
      type
      date
      description
      place {
        handle
        name
        coordinates {
          lat
          lng
        }
      }
      citations {
        handle
        date
        page
        confidence
        attributes {
          type
          value
        }
        notes {
          handle
          text
          type
          tags {
            handle
            name
            color
            priority
          }
          private
        }
        mediarefs {
          private
          notes
          attributes {
            type
            value
          }
          media {
            handle
            path
            mime
            desc
            date
            attributes {
              type
              value
            }
          }
        }
        source {
          handle
          private
          grampsId
          title
          author
          pubinfo
          abbrev
          attributes {
            type
            value
          }
          repositoryrefs {
            repository {
              handle
              private
              grampsId
              name
              type
            }
            callNumber
            type
          }
        }
      }
      mediarefs {
        private
        notes
        attributes {
          type
          value
        }
        media {
          handle
          path
          mime
          desc
          date
          attributes {
            type
            value
          }
        }
      }
      attributes {
       type
       value
      }
      references {
        persons {
          handle
          name
          eventrefs {
            event {
              handle
            }
            type
            notes
            attributes
          }
        }
        families {
          handle
        }
      }
    }
  }`);


  const {t, i18n} = useTranslation();

  const [showSources, setShowSources] = useState(false)

  if (query.loading) {
    return null;
  }

  const event = query.data.event

  const getEventRef = (person, eventId) => {
    return person.eventrefs.find(ref => {
      if (ref.event.handle == eventId) {
        return true
      }
    })
  }


  return (
    <EventContainer>
      <div style={{fontSize: '18px', borderBottom: '2px solid gray', color: 'gray'}}>{event.date}</div>
      <div style={{display: 'flex'}}>
        {icons[event.type]}
        <div style={{fontSize: '22px', fontWeight: 'bolder'}}>{t(`event.type.${event.type}`)}</div>
      </div>
      <div>{event.place && event.place.name}</div>
      <div>{event.description}</div>
      {event.references.persons.map((p) => {
        const ref = getEventRef(p, event.handle)
        return (
          <div key={p.handle}><PersonLink person={p} /> ({t(`eventref.type.${ref.type}`)})</div>
        )
      })}
      {/*event.place && event.place.coordinates &&
        <div style={{width: '100%', height: '300px'}}>
          <Map position={[event.place.coordinates.lat, event.place.coordinates.lng]} label={event.place.name} />
        </div>
      */}
      <Media mediarefs={event.mediarefs} />
      <Citations citations={event.citations} />
    </EventContainer>
  )
}

export default Event
