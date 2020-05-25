import React from 'react';
import {
  Dropdown,
  Button,
} from 'semantic-ui-react';

const settingsButton = <Button circular icon='setting' />;

const copyToClipboard = (userProfileLink) => {
  navigator.clipboard.writeText(userProfileLink)
};

const SettingsDropdown = ({
  handleLogoutClick,
  publicProfile,
  onClickUpdateProfilePrivacy,
  userProfileLink,
}) => (
  <Dropdown
    trigger={settingsButton}
    pointing='top left'
    icon={null}
  >
    <Dropdown.Menu>
      <Dropdown.Item
        text='Make Profile Public'
        icon='lock open'
        active={publicProfile}
        onClick={onClickUpdateProfilePrivacy}
      />
      <Dropdown.Item
        text='Make Profile Private'
        icon='lock'
        active={!publicProfile}
        onClick={onClickUpdateProfilePrivacy}
      />
      <Dropdown.Item
        text='Copy Profile Link'
        icon='copy'
        onClick={copyToClipboard(userProfileLink)}
      />
      <Dropdown.Item
        text='Log Out'
        icon='sign out'
        onClick={handleLogoutClick}
      />
    </Dropdown.Menu>
  </Dropdown>
);

export default SettingsDropdown;