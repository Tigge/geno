import React, { useState } from "react";
import { Link } from "react-router-dom";
import { gql } from 'apollo-boost';
import { useQuery } from '@apollo/react-hooks';
import styled, { createGlobalStyle } from 'styled-components'
import { useTranslation } from 'react-i18next';

import {useDocumentTitle} from "../utils/hooks";

import PersonLink from "../components/PersonLink";
import Event from "../components/Event";
import Tags from "../components/Tags";
import AncestorGraph from "../components/AncestorGraph";

const Wrapper = styled.div`
  display: grid;
  grid-gap: 20px;
  grid-template-columns: 65fr 35fr;
  grid-template-areas: "content sidebar";
`;

const Sidebar =  styled.div`
  grid-area: sidebar;
  background-color: white;
  padding: 20px;
`;

const SidebarItem = styled.div`
  padding-bottom: 15px;
`;

const SidebarTitle = styled.div`
  font-size: 14px;
  color: #666;
  font-weight: 600;
`;

const SidebarSubTitle = styled.div`
  font-size: 11px;
  color: #666;
  font-weight: 600;
`;

const SidebarValue = styled.div`
`;

const Content =  styled.div`
  grid-area: content;
  overflow-x: auto;
`;


const Tabs = styled.div`
`;

const Tab = styled.button`
  display: inline-block;
  padding: 10px;
  border: none;
  cursor: pointer;
  font-weight: 600;
  background-color: ${props => props.active ? '#fff' : 'initial'}
`;

const findFirstImageOfType = (person, type) => {
  return person.mediarefs.find(ref => {
    return ref.media.attributes.find(attr => {
      return (attr.type === 'Image Type' && attr.value === type);
    })
  })
}

const Person = ({id}) => {
  const query = useQuery(gql`
  {
    person(handle: "${id}") {
      handle
      gender
      name
      birthrefindex
      deathrefindex
      parentFamilies {
        handle
        father {
          handle
          grampsId
          gender
          name
          birthrefindex
          deathrefindex
        }
        mother {
          handle
          grampsId
          gender
          name
          birthrefindex
          deathrefindex
        }
        childrefs {
          child {
            handle
          }
          motherRel
          fatherRel
        }
        type
      }
      families {
        handle
        father {
          handle
          grampsId
          gender
          name
          birthrefindex
          deathrefindex
        }
        mother {
          handle
          grampsId
          gender
          name
          birthrefindex
          deathrefindex
        }
        childrefs {
          child {
            handle
            name
          }
          motherRel
          fatherRel
        }
        type
      }
      mediarefs {
        private
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
      eventrefs {
        id
        private
        notes
        attributes
        event {
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
          }
          attributes {
            type
            value
          }
          references {
            persons {
              handle
              name
            }
            families {
              handle
            }
          }
        }
      }
      tags {
        handle
        name
        color
        priority
      }
    }
  }`);

  const {t, i18n} = useTranslation();
  const [tab, setTab] = useState('events')

  if (query.loading) {
    return null;
  }

  const person = query.data.person

  useDocumentTitle(person.name)

  // return <pre>{JSON.stringify(person.data, null, 2)}</pre>

  const portrait = findFirstImageOfType(person, 'portrait')
  const signature = findFirstImageOfType(person, 'signature')


  const birth = person.birthrefindex !== null ? person.eventrefs[person.birthrefindex] : null
  const death = person.deathrefindex !== null ? person.eventrefs[person.deathrefindex] : null

  return (
    <>
      <div>Hem &gt; Personer &gt; </div>
      <h1>{person.name}</h1>
      <Wrapper>
        <Sidebar>
          {portrait &&
            <SidebarItem>
              <SidebarTitle>{person.name}</SidebarTitle>
              <SidebarValue><img src={`/res/${portrait.media.path}`} style={{width: '100%', display: 'block'}}/></SidebarValue>
            </SidebarItem>
          }
          {signature &&
            <SidebarItem>
              <SidebarTitle>Namnteckning</SidebarTitle>
              <SidebarValue><img src={`/res/${signature.media.path}`} style={{width: '100%', display: 'block'}}/></SidebarValue>
            </SidebarItem>
          }
          {birth &&
            <SidebarItem>
              <SidebarTitle>Född</SidebarTitle>
              <SidebarValue>{birth.event.date}</SidebarValue>
              <SidebarValue>{birth.event.place && birth.event.place.name}</SidebarValue>
            </SidebarItem>
          }
          {death &&
            <SidebarItem>
              <SidebarTitle>Död</SidebarTitle>
              <SidebarValue>{death.event.date}</SidebarValue>
              <SidebarValue>{death.event.place && death.event.place.name}</SidebarValue>
            </SidebarItem>
          }
          {person.parentFamilies.map((f, i) => {

            const cr = f.childrefs.find((ref) => ref.child.handle === person.handle)

            return (
              <SidebarItem key={f.handle}>
                <SidebarTitle>Föräldrar {i + 1}, {t(`family.type.${f.type}`)}</SidebarTitle>
                <SidebarValue><PersonLink person={f.father} /> {cr && t(`family.childref.type.${cr.fatherRel}`)}</SidebarValue>
                <SidebarValue><PersonLink person={f.mother} /> {cr && t(`family.childref.type.${cr.motherRel}`)}</SidebarValue>
              </SidebarItem>
            )
          })}
          {person.families.map((f, i) => {

            return (
              <SidebarItem key={f.handle}>
                <SidebarTitle>Familj {i + 1}, {t(`family.type.${f.type}`)}</SidebarTitle>
                <SidebarSubTitle>Föräldrar</SidebarSubTitle>
                <SidebarValue><PersonLink person={f.father} /></SidebarValue>
                <SidebarValue><PersonLink person={f.mother} /></SidebarValue>
                <SidebarSubTitle>Barn</SidebarSubTitle>
                <SidebarValue>{
                  f.childrefs.map(childref => {
                    return <div key={childref.child.handle}><PersonLink person={childref.child} /></div>
                  })
                }</SidebarValue>
              </SidebarItem>
            )
          })}
          {person.tags.length > 0 &&
            <SidebarItem>
              <SidebarTitle>Taggar</SidebarTitle>
              <SidebarValue><Tags tags={person.tags} /></SidebarValue>
            </SidebarItem>
          }

        </Sidebar>
        <Content>
          <Tabs>
            <Tab active={tab === 'events'} onClick={() => setTab('events')}>Händelser</Tab>
            <Tab active={tab === 'graph'} onClick={() => setTab('graph')}>Träd</Tab>
          </Tabs>
          <div>
            {tab === 'graph'
              && <AncestorGraph handle={person.handle} />}
            {tab === 'events'
              && person.eventrefs.map((ref) => (
                <Event key={ref.event.handle} id={ref.event.handle} />)
              )}
          </div>
          {/*<pre>{JSON.stringify(person, null, 2)}</pre>*/}
        </Content>
      </Wrapper>
    </>
  )


}

export default Person
