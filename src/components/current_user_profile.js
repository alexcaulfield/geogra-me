import React, {Component} from 'react';
import {db} from './../fire-config'
import { USERS_COLLECTION, SITE_URL } from './../utils'
import {geocodeByAddress, getLatLng} from 'react-places-autocomplete'
import * as firebase from 'firebase'
import FluidMapProfile from './fluid_map_profile';

class CurrentUserProfile extends Component {
  state = {
    locationToAdd: '',
    searchQuery: '',
    placesBeen: [],
    placesToGo: [],
    countriesBeen: 0,
    // pull user data from db based on email
    userDocIdentifier: this.props.userObject.email,
    beenToButtonClicked: true,
    wantToGoButtonClicked: false,
    shouldRenderPlacesBeen: true,
    shouldRenderPlacesToGo: false,
    userProfileLink: '',
    username: '',
    publicProfile: this.props.userObject.publicProfile,
    mapCenter: { // default to Boston
      lat: 42.3601,
      lng: -71.0589
    },
    pinLabel: '',
    addPinModalOpen: false,
    monthVisited: '',
    yearVisited: null,
    pinComment: '',
    displayDateVisited: false,
    pinFilters: [],
  };

  componentDidMount() {
    this.renderMapData()
  }

  renderMapData = () => {
    db.collection(USERS_COLLECTION).doc(this.state.userDocIdentifier).get().then(doc => {
      if (doc.exists) {
        const data = doc.data();
        this.setState({
          placesBeen: data.placesBeen,
          placesToGo: data.placesToGo,
          countriesBeen: data.countriesBeen.length,
          userProfileLink: `${SITE_URL}/profile/${data.username}`,
          username: data.username,
          addPinModalOpen: false,
          pinLabel: '',
          monthVisited: '',
          yearVisited: null,
          pinComment: '',
        })
      } else {
        console.log(`there was an error in fetching data for user ${this.state.userDocIdentifier}`)
      }
    }).catch((error) => console.log("Error getting document:", error))
  };

  getCountry = location => {
    const locationSplit = location.split(', ');
    return locationSplit[locationSplit.length - 1];
  };

  handleAddLocationToDB = () => {
    let locationObj = {};
    geocodeByAddress(this.state.locationToAdd)
      .then(results => {
        locationObj = results[0];
        return getLatLng(results[0])
      })
      .then(({ lat, lng }) => {
        let objToAdd = {};
        const country = this.getCountry(this.state.locationToAdd);
        if (this.state.beenToButtonClicked) {
          objToAdd = {
            placesBeen: firebase.firestore.FieldValue.arrayUnion({
              name: this.state.locationToAdd,
              location: {
                lat,
                lng,
              },
              placeId: locationObj.place_id,
              country: country,
              label: this.state.pinLabel,
              monthVisited: this.state.monthVisited,
              yearVisited: this.state.yearVisited,
              comment: this.state.pinComment,
            }),
            countriesBeen: firebase.firestore.FieldValue.arrayUnion(country),
          }
        } else if (this.state.wantToGoButtonClicked) {
          objToAdd = {
            placesToGo: firebase.firestore.FieldValue.arrayUnion({
              name: this.state.locationToAdd,
              location: {
                lat,
                lng,
              },
              placeId: locationObj.place_id,
              label: this.state.pinLabel,
              monthVisited: this.state.monthVisited,
              yearVisited: this.state.yearVisited,
              comment: this.state.pinComment,
            })
          }
        }
        db.collection(USERS_COLLECTION).doc(this.state.userDocIdentifier).update(objToAdd)
        .then(() => {
          this.setState({
            locationToAdd: '',
            searchQuery: '',
            mapCenter: {
              lat: lat,
              lng: lng,
            },
            shouldRenderPlacesBeen: this.state.beenToButtonClicked,
            shouldRenderPlacesToGo: this.state.wantToGoButtonClicked,
          }, () => {
            this.renderMapData()
          })
        }).catch((error) => {
          console.log(`error saving document ${error}`)
        })
      });
  };


  handleUpdateProfilePrivacy = (e) => {
    e.preventDefault();
    const currentPublicProfileSetting = this.state.publicProfile;
    db.collection(USERS_COLLECTION).doc(this.state.userDocIdentifier).update({
      publicProfile: !currentPublicProfileSetting
    })
      .then(response => {
        this.setState({
          publicProfile: !currentPublicProfileSetting
        })
      })
      .catch(error => console.log('unable to update user profile setting'))
  };

  shouldRemoveCountry = (placeList, country) => {
    if (!country) {
      return false;
    }
    const otherPlacesFromCountry = placeList.filter(place => place.country === country);
    return otherPlacesFromCountry.length === 0;
  };

  deletePlace = (placeToDelete, placeToGo, placeBeen) => {
    if (placeBeen) {
      const updatedPlacesBeen = this.state.placesBeen.filter(place => place.name !== placeToDelete.name);
      const shouldRemoveCountryFromList = this.shouldRemoveCountry(updatedPlacesBeen, placeToDelete.country);
      if (shouldRemoveCountryFromList) {
        db.collection(USERS_COLLECTION).doc(this.state.userDocIdentifier).update({
          countriesBeen: firebase.firestore.FieldValue.arrayRemove(placeToDelete.country)
        })
          .then(response => {
            this.setState(prevState => {
              return {
                countriesBeen: prevState.countriesBeen - 1
              }
            })
          })
          .catch(error => console.log(error))
      }
      db.collection(USERS_COLLECTION).doc(this.state.userDocIdentifier).update({
        placesBeen: updatedPlacesBeen
      })
        .then(response => {
          this.setState({
            placesBeen: updatedPlacesBeen,
            mapCenter: {
              lat: placeToDelete.location.lat,
              lng: placeToDelete.location.lng,
            }
          })
        })
        .catch(error => console.log(error))
    } else if (placeToGo) {
      const updatedPlacesToGo = this.state.placesToGo.filter(place => place.name !== placeToDelete.name);
      db.collection(USERS_COLLECTION).doc(this.state.userDocIdentifier).update({
        placesToGo: updatedPlacesToGo
      })
        .then(response => {
          this.setState({
            placesToGo: updatedPlacesToGo,
            mapCenter: {
              lat: placeToDelete.location.lat,
              lng: placeToDelete.location.lng,
            }
          })
        })
        .catch(error => console.log(error))
    }
  };

  moveToPlacesBeen = (placeToMove, placeToGo, placeBeen) => {
    const country = placeToMove.country ? placeToMove.country : this.getCountry(placeToMove.name);
    this.deletePlace(placeToMove, placeToGo, placeBeen);
    const objToAdd = {
      placesBeen: firebase.firestore.FieldValue.arrayUnion({
        name: placeToMove.name,
        location: {
          lat: placeToMove.location.lat,
          lng: placeToMove.location.lng,
        },
        placeId: placeToMove.placeId ? placeToMove.placeId : '',
        country: country,
      }),
      countriesBeen: firebase.firestore.FieldValue.arrayUnion(country),
    };
    db.collection(USERS_COLLECTION).doc(this.state.userDocIdentifier).update(objToAdd)
      .then(() => {
        this.setState({
          mapCenter: {
            lat: placeToMove.location.lat,
            lng: placeToMove.location.lng,
          },
          shouldRenderPlacesBeen: true,
          shouldRenderPlacesToGo: false,
        }, () => {
          this.renderMapData()
        })
      }).catch((error) => {
      console.log(`error saving document ${error}`)
    })
  };

  handleBeenToClick = () => {
    this.setState({
      beenToButtonClicked: true,
      wantToGoButtonClicked: false,
      displayDateVisited: true,
    })
  };

  handleWantToGoClick = () => {
    this.setState({
      beenToButtonClicked: false,
      wantToGoButtonClicked: true,
      displayDateVisited: false,
    })
  }

  handleSeePlacesToGo = () => {
    this.setState({
      shouldRenderPlacesBeen: false,
      shouldRenderPlacesToGo: true,
    })
  };

  handleSeePlacesBeen = () => {
    this.setState({
      shouldRenderPlacesBeen: true,
      shouldRenderPlacesToGo: false,
    })
  };

  handleTextChange = (e, { searchQuery, value }) => {
    this.setState({
      searchQuery,
      locationToAdd: value
    })
  };

  handleInputChange = (e, dropdown) => {
    this.setState({
      locationToAdd: dropdown.searchQuery
    })
  };

  handlePinLabelSelect = (e, dropdown) => {
    if (dropdown.value === 'Been To' || dropdown.value === 'Lived' || dropdown.value === 'Born') {
      this.handleBeenToClick();
    } else {
      this.handleWantToGoClick();
    }

    this.setState({
      pinLabel: dropdown.value,
    })
  }

  setAddPinModalOpen = openValue => {
    this.setState({
      addPinModalOpen: openValue,
    })
  }

  handleMonthSelect = (e, dropdown) => {
    this.setState({
      monthVisited: dropdown.value,
    })
  }

  handleYearSelect = (e, dropdown) => {
    this.setState({
      yearVisited: dropdown.value,
    })
  }

  handleSetComment = (e, text) => {
    this.setState({
      pinComment: text.value,
    })
  }

  setPinFilters = (e, checkbox) => {
    if (checkbox.checked) {
      this.setState(prevState => {
        return {
          pinFilters: [...prevState.pinFilters, checkbox.label]
        }
      })
    } else {
      this.setState(prevState => {
        return {
          pinFilters: prevState.pinFilters.filter(pinFilter => pinFilter !== checkbox.label)
        }
      })
    }
  }

  filterPlaces = () => {
    // display legacy pin objects without labels
    const placesBeen = this.state.placesBeen.map(place => {
      if (place.label) {
        return place;
      } else {
        return {...place, label: 'Been To'}
      }
    })
    const placesToGo = this.state.placesToGo.map(place => {
      if (place.label) {
        return place;
      } else {
        return {...place, label: 'Want To Go'}
      }
    })
    // display all pins if no filters are selected
    if (this.state.pinFilters.length === 0) {
      return [...placesBeen, ...placesToGo]
    }
    // otherwise filter all pins
    const filteredPlacesBeen = placesBeen.filter(place => this.state.pinFilters.includes(place.label))
    const filteredPlacesToGo = placesToGo.filter(place => this.state.pinFilters.includes(place.label))
    return [...filteredPlacesBeen, ...filteredPlacesToGo]
  }
  
  render() {
    const { handleLogoutClick, userObject } = this.props;
    return(
       <FluidMapProfile
         locationToAdd={this.state.locationToAdd}
         handleInputChange={this.handleInputChange}
         handleTextChange={this.handleTextChange}
         handleAddLocationToDB={this.handleAddLocationToDB}
         handlePinLabelSelect={this.handlePinLabelSelect}
         pinLabel={this.state.pinLabel}
         addPinModalOpen={this.state.addPinModalOpen}
         setAddPinModalOpen={this.setAddPinModalOpen}
         handleMonthSelect={this.handleMonthSelect}
         handleYearSelect={this.handleYearSelect}
         displayDateVisited={this.state.displayDateVisited}
         handleSetComment={this.handleSetComment}
         profilePhotoSrc={userObject.photoURL}
         profileName={userObject.displayName}
         handleLogoutClick={handleLogoutClick}
         publicProfile={this.state.publicProfile}
         onClickUpdateProfilePrivacy={this.handleUpdateProfilePrivacy}
         userProfileLink={this.state.userProfileLink}
         shouldRenderMyMap
         username={this.state.username}
         listOfCities={this.filterPlaces()}
         shouldRenderPlacesBeen={this.state.shouldRenderPlacesBeen}
         shouldRenderPlacesToGo={this.state.shouldRenderPlacesToGo}
         deletePlace={this.deletePlace}
         moveToPlacesBeen={this.moveToPlacesBeen}
         mapCenter={this.state.mapCenter}
         countriesBeen={this.state.countriesBeen}
         shouldRenderUpdateButtons
         setPinFilters={this.setPinFilters}
         pinFilters={this.state.pinFilters}
         userId={this.state.userDocIdentifier}
         renderMapData={this.renderMapData}
       />
    )
  }
}

export default CurrentUserProfile;