import React from 'react';
import {
  Dropdown,
  Button,
} from 'semantic-ui-react';
import {useHistory} from "react-router-dom";

const settingsButton = <Button circular icon='setting' size='huge' color='blue'/>;

const copyToClipboard = (userProfileLink) => {
  navigator.clipboard.writeText(userProfileLink)
};

const SettingsDropdown = ({
  handleLogoutClick,
  publicProfile,
  onClickUpdateProfilePrivacy,
  userProfileLink,
  username,
  renderPersonalProfileSettings,
}) => {
  const history = useHistory();
  return (
    <Dropdown
      trigger={settingsButton}
      pointing='top right'
      icon={null}
    >
      <Dropdown.Menu>
        {renderPersonalProfileSettings && (
          <>
            <Dropdown.Item
              text={username}
              icon='user outline'
              onClick={copyToClipboard(userProfileLink)}
            />
            <Dropdown.Item
              text='Copy Profile Link'
              icon='copy'
              onClick={copyToClipboard(userProfileLink)}
            />
            <Dropdown.Item
              text={!publicProfile ? 'Make Profile Public' : 'Make Profile Private'}
              icon={!publicProfile ? 'lock open' : 'lock'}
              onClick={onClickUpdateProfilePrivacy}
            />
          </>
        )}
        {!renderPersonalProfileSettings && (
          <>
            <Dropdown.Item
              text={username}
              icon='user outline'
              onClick={copyToClipboard(userProfileLink)}
            />
            <Dropdown.Item
              text='My Profile'
              icon='user outline'
              onClick={() => history.push('/profile')}
            />
          </>
        )}
        <Dropdown.Item
          text='Log Out'
          icon='sign out'
          onClick={handleLogoutClick}
        />
      </Dropdown.Menu>
    </Dropdown>
  )
};

export default SettingsDropdown;