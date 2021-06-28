import React from "react";
import styled, { createGlobalStyle } from 'styled-components'
import { Map as LeafletMap, Marker, Popup, TileLayer } from 'react-leaflet'

const Map = ({position, label}) => (
  <LeafletMap center={position} zoom={10}>
    <TileLayer
      url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      attribution="&copy; <a href=&quot;http://osm.org/copyright&quot;>OpenStreetMap</a> contributors"
    />
    <Marker position={position}>
      <Popup>{label}</Popup>
    </Marker>
  </LeafletMap>
)

export default Map
