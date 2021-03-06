import React from 'react';
import {
  Dimmer,
  Loader,
  Image,
  Segment,
} from 'semantic-ui-react'
import BasicHeader from "./basic_header";

const LoadingPage = () => (
  <>
    <BasicHeader />
    <Segment>
      <Dimmer active inverted>
        <Loader size='large'>Loading</Loader>
      </Dimmer>
      <Image src='https://react.semantic-ui.com/images/wireframe/paragraph.png' />
    </Segment>
  </>
);

export default LoadingPage;