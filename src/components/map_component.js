import React from 'react';
import { withScriptjs, withGoogleMap, GoogleMap} from "react-google-maps"
import MapInfoWindowComponent from './map_info_window_component'

const MyMapComponent = withScriptjs(withGoogleMap((props) =>
  <div
    id='map'
    style={{
        flexGrow: 1,
        height: '100%'
    }}
  >
    <GoogleMap
      defaultZoom={8}
      center={props.mapCenter}
      options={{
        fullscreenControl: false,
        clickableIcons: false,
        disableDefaultUI: false,
        mapTypeControl: false,
        streetViewControl: false,
        zoomControl: false,
      }}
    >
      { props.listOfCities.map((city) => (
        <MapInfoWindowComponent
          city={city}
          deletePlace={props.deletePlace}
          moveToPlacesBeen={props.moveToPlacesBeen}
          shouldRenderUpdateButtons={props.shouldRenderUpdateButtons}
          userId={props.userId}
          renderMapData={props.renderMapData}
        />
        )) }
    </GoogleMap>
  </div>
));

export default MyMapComponent;