import React, {useState} from 'react'
import {Marker, InfoWindow} from "react-google-maps"
import InfoWindowCard from './info_window_card';
import {db} from './../fire-config'
import { USERS_COLLECTION } from './../utils'

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

const MapInfoWindowComponent = ({
  city, 
  deletePlace, 
  moveToPlacesBeen, 
  shouldRenderUpdateButtons,
  userId,
  renderMapData,
}) => {
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

  const getPlaceDataFromDB = async () => {
    const userDataRef = db.collection(USERS_COLLECTION).doc(userId);
    const userDoc = await userDataRef.get();
    return userDoc.exists ? userDoc.data() : {errorMessage: `there was an error in fetching data for user ${userId}`}
  }

  const updatePlaceDataInDB = (placesBeen) => {
    db.collection(USERS_COLLECTION).doc(userId).update({
      placesBeen: placesBeen
    })
      .then(() => renderMapData()) // re-render map
  }

  const setPlaceRating = async (e, { rating }) => {
    // go into db & grab all the places
    let {placesBeen} = await getPlaceDataFromDB();
    // find the current place
    const placeToRateIndex = placesBeen.findIndex(place => place.name === city.name);
    // update the rating
    placesBeen[placeToRateIndex] = {...placesBeen[placeToRateIndex], rating: rating}
    // update the places array in the db
    updatePlaceDataInDB(placesBeen);
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
            setPlaceRating={setPlaceRating}
          />
        </InfoWindow>
      )}
    </Marker>
  )
};

export default MapInfoWindowComponent