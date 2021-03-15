import React, {useState} from 'react'
import {Marker, InfoWindow} from "react-google-maps"
import InfoWindowCard from './info_window_card';

const PIN_URLS = {
  'Been To': 'http://maps.google.com/mapfiles/ms/icons/green-dot.png',
  'Want To Go': 'http://maps.google.com/mapfiles/ms/icons/blue-dot.png',
  'Lived': 'http://maps.google.com/mapfiles/ms/icons/yellow-dot.png',
  'Family': 'http://maps.google.com/mapfiles/ms/icons/pink-dot.png',
  'Friends': 'http://maps.google.com/mapfiles/ms/icons/purple-dot.png',
  'Born': '',
}

const splitCity = fullName => {
  const namePieces = fullName.split(', ')
  if (namePieces.length > 1) {
    return [namePieces[0], namePieces[namePieces.length - 1]]
  }
  return [fullName, '']
}

const MapInfoWindowComponent = ({city, deletePlace, shouldRenderPlacesBeen, shouldRenderPlacesToGo, moveToPlacesBeen, shouldRenderUpdateButtons}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [cityName, country] = splitCity(city.name);
  const [locationImageUrl, setLocationImageUrl] = useState('');

  const findPlaceImage = (service, placeId) => {
    service.getDetails({
      placeId: placeId,
    }, (place, status) => {
      if (status === window.google.maps.places.PlacesServiceStatus.OK) {
        if (place.photos) {
          setLocationImageUrl(place.photos[0].getUrl())
        }
      }
    })
  }

  const getPlaceData = () => {
    setIsOpen(true);
    const map = new window.google.maps.Map(document.getElementById("map"), {
      center: city.location
    });
    const service = new window.google.maps.places.PlacesService(map);
    let placeId = city.placeId;
    if (!city.placeId) {
      const request = {
        query: cityName,
        fields: ['name', 'place_id'],
      };
      service.findPlaceFromQuery(request, (results, status) => {
        if (status === window.google.maps.places.PlacesServiceStatus.OK) {
          placeId = results[0] ? results[0].place_id : '';
          findPlaceImage(service, placeId);
        }
      })
    }
    if (placeId) {
      findPlaceImage(service, placeId);
    }
  }

  return (
    <Marker
      position={city.location}
      onClick={getPlaceData}
      icon={PIN_URLS[city.label]}
    >
      {isOpen && (
        <InfoWindow onCloseClick={() => {setIsOpen(false)}}>
          <InfoWindowCard
            city={cityName}
            country={country}
            deletePlace={deletePlace}
            cityObj={city}
            imgUrl={locationImageUrl}
            isPlaceToGo={city.label === 'Want To Go'}
            isPlaceBeen={city.label === 'Been To'}
            moveToPlacesBeen={moveToPlacesBeen}
            setIsOpen={setIsOpen}
            shouldRenderUpdateButtons={shouldRenderUpdateButtons}
          />
        </InfoWindow>
      )}
    </Marker>
  )
};

export default MapInfoWindowComponent