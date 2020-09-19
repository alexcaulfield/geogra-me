import React, {useState} from 'react';
import MyMapComponent from './map_component';
import {Label, Modal, Button, Icon} from 'semantic-ui-react';
import { USERS_COLLECTION, GOOGLE_MAP_URL, SITE_URL } from './../utils';
import SettingsDropdown from "./settings_dropdown";
import TravelStatsCard from "./travel_stats_card";
import AddPinContainer from './add_pin_container';

const MobileMapProfile = props => {
  return (
    <div
      style={{position: 'relative'}}
    >
      <div
        style={{
          position: 'absolute',
          marginLeft: '8px',
          marginTop: '8px',
          zIndex: 100,
        }}
      >
        <Label image size='huge' color='blue'>
          <img src={props.profilePhotoSrc} />
          {props.shouldRenderMyMap ? 'My Map' : `${props.profileName}`}
        </Label>
      </div>
      <div
        style={{
          position: 'absolute',
          right: '8px',
          marginTop: '8px',
          zIndex: 100,
        }}
      >
        <SettingsDropdown
          handleLogoutClick={props.handleLogoutClick}
          publicProfile={props.publicProfile}
          onClickUpdateProfilePrivacy={props.onClickUpdateProfilePrivacy}
          userProfileLink={props.userProfileLink}
          username={props.username}
          renderPersonalProfileSettings={props.shouldRenderMyMap}
        />
      </div>
      <MyMapComponent
        isMarkerShown
        googleMapURL={GOOGLE_MAP_URL}
        loadingElement={<div style={{ height: `100%`, width: `100%` }} />}
        containerElement={<div style={{ height: `100%`, width: `100%`}} />}
        mapElement={<div style={{ height: `100vh`, width: `100vw` }} />}
        listOfCities={props.listOfCities}
        shouldRenderPlacesBeen={props.shouldRenderPlacesBeen}
        shouldRenderPlacesToGo={props.shouldRenderPlacesToGo}
        deletePlace={props.deletePlace}
        moveToPlacesBeen={props.moveToPlacesBeen}
        mapCenter={props.mapCenter}
        shouldRenderUpdateButtons
      />
      <div
        style={{
          position: 'absolute',
          marginLeft: '12px',
          top: '80vh',
          width: '40vw',
          zIndex: 100,
        }}
      >
        <TravelStatsCard
          name={props.shouldRenderMyMap ? 'My': `${props.profileName}'s`}
          countriesBeen={props.countriesBeen}
        />
      </div>
      <AddPinContainer
        addPinModalOpen={props.addPinModalOpen}
        setAddPinModalOpen={props.setAddPinModalOpen}
        locationToAdd={props.locationToAdd}
        handleInputChange={props.handleInputChange}
        handleTextChange={props.handleTextChange}
        handleAddLocationToDB={props.handleAddLocationToDB}
        handlePinLabelSelect={props.handlePinLabelSelect}
        handleMonthSelect={props.handleMonthSelect}
        handleYearSelect={props.handleYearSelect}
        handleSetComment={props.handleSetComment}
      />
    </div>
  )
}

export default MobileMapProfile;
