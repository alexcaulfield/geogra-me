import React from 'react';
import {
  Dropdown,
} from 'semantic-ui-react';
import {useHistory} from "react-router-dom";

const copyToClipboard = (userProfileLink) => {
  navigator.clipboard.writeText(userProfileLink)
};

const SettingsDropdown = ({
  settingsTrigger,
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
      trigger={settingsTrigger}
      pointing='top left'
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