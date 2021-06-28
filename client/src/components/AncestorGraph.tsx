import React, { useEffect, useState } from 'react';
import { useApolloClient } from '@apollo/react-hooks';
import styled from 'styled-components'
import gql from 'graphql-tag';

import Graph from './Graph'

const generate = async (handle, client) => {

  const query = gql`
  query {
    person(handle: "${handle}") {
      handle
      gender
      name
      parentFamilies {
        handle
        father {
          handle
          gender
          name
        }
        mother {
          handle
          gender
          name
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
    }
  }`;

  const res = await client.query({query})
  const person = res.data.person
  console.log(handle, person.name)
  let mother = null, father = null
  for (const f of person.parentFamilies) {
    const self = f.childrefs.find(c => c.child.handle == handle)
    if (self.fatherRel === 'Birth') {
      father = await generate(f.father.handle, client)
    }
    if (self.motherRel === 'Birth') {
      mother = await generate(f.mother.handle, client)
    }
  }

  const parents = []
  father && parents.push(father)
  mother && parents.push(mother)

  return {
    handle: handle,
    name: person.name,
    parents: parents
  }

}


const AncestorGraph = ({handle}) => {

  const [data, setData] = useState(null)
  const client = useApolloClient()

  useEffect(() => {
    generate(handle, client).then(result => {
      console.log(result)
      setData(result)
    })
  }, [handle, client])

  if (data === null) {
    return <div />
  }

  return (
    <Graph data={data} />
  )
}

export default AncestorGraph
