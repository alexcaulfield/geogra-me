/**
 * New Map UI that displays the map full width on the user's display
 */
import React from 'react';
import MyMapComponent from './map_component';
import {Label, Icon} from 'semantic-ui-react';
import {GOOGLE_MAP_URL} from './../utils';
import SettingsDropdown from "./settings_dropdown";
import TravelStatsCard from "./travel_stats_card";
import AddPinContainer from './add_pin_container';
import PinFilterSelectionCard from './pin_filter_selection_card';
import {isMobile} from 'react-device-detect';
import styled from 'styled-components';

const SettingsIcon = styled(Icon)`
  padding-left: 8px;
  margin: 0;
`;

const FluidMapProfile = props => {
  return (
    <div style={{position: 'relative', width: '100%'}}>
      <div
        style={{
          position: 'absolute',
          left: '8px',
          top: '8px',
          zIndex: 100,
        }}
      >
        <SettingsDropdown
          settingsTrigger={
            <Label image size='huge' color='blue'>
              {props.profilePhotoSrc && <img alt={props.profileName} src={props.profilePhotoSrc} />}
              {props.shouldRenderMyMap ? 'My Map' : `${props.profileName}`}
              <SettingsIcon name='setting' />
            </Label>
          }
          handleLogoutClick={props.handleLogoutClick}
          publicProfile={props.publicProfile}
          onClickUpdateProfilePrivacy={props.onClickUpdateProfilePrivacy}
          userProfileLink={props.userProfileLink}
          username={props.username}
          renderPersonalProfileSettings={props.shouldRenderMyMap}
        />
      </div>
      <div
        style={{
          position: 'absolute',
          right: '8px',
          top: '8px',
          zIndex: 100,
        }}
      >
        <PinFilterSelectionCard
          setPinFilters={props.setPinFilters}
          pinFilters={props.pinFilters}
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
        shouldRenderUpdateButtons={props.shouldRenderUpdateButtons}
        userId={props.userId ? props.userId : ''}
        renderMapData={props.renderMapData}
      />
      <div
        style={{
          position: 'absolute',
          left: '8px',
          bottom: isMobile ? '125px' : '8px',
          width: '40vw',
          zIndex: 100,
        }}
      >
        <TravelStatsCard
          name={props.shouldRenderMyMap ? 'My': `${props.profileName}'s`}
          countriesBeen={props.countriesBeen}
        />
      </div>
      {props.shouldRenderMyMap && (
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
          displayDateVisited={props.displayDateVisited}
          pinLabel={props.pinLabel}
        />
      )}
    </div>
  )
}

export default FluidMapProfile;
