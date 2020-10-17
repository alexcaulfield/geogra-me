import React from 'react'
import {Header as SemanticHeader, Segment} from "semantic-ui-react";

const Footer = () => (
  <Segment>
    <SemanticHeader as='h4'>© {new Date().getFullYear()} Alex Caulfield</SemanticHeader>
  </Segment>
);

export default Footer
