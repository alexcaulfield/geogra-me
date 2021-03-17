import React from 'react';
import { 
  Card, 
  Button, 
  Image, 
  Label, 
  Rating,
  TextArea 
} from 'semantic-ui-react';
import styled from 'styled-components';

const CardDescription = styled(Card.Description)`
  padding-bottom: 10px;
`;

const DeleteButton = styled(Button)`
  margin-bottom: 10px;
`;

const BeenThereButton = styled(Button)`
  margin-top: 10px;
`;

const Img = styled(Image)`
  padding-bottom: 10px;
`;

const StyledLabelWrapper = styled.div`
  margin-bottom: 10px;
`;

const Comment = styled.p`
  border: 1px solid #e0e1e2;
  border-radius: 5px;
  padding: 6px;
  width: 85%;
  display: inline-block;
`;

const Ratings = styled(Rating)`
  padding-bottom: 10px;
`;

const InfoWindowCard = ({
  city,
  country, 
  deletePlace, 
  cityObj, 
  imgUrl, 
  isPlaceToGo, 
  isPlaceBeen, 
  moveToPlacesBeen, 
  setIsOpen, 
  shouldRenderUpdateButtons,
  setPlaceRating,
  editingComment,
  setEditingComment,
  placeComment,
  setPlaceComment,
}) => (
  <Card>
    <Card.Content>
      <Card.Header>{city}</Card.Header>
      {!!country && <Card.Meta>{country}</Card.Meta>}
      <CardDescription>
        {!!imgUrl && (
          <Img src={imgUrl} wrapped rounded size='medium' />
        )}
        {!!cityObj.label && (
          <StyledLabelWrapper>
            <Label>
              {cityObj.label}
            </Label>
          </StyledLabelWrapper>
        )}
        {!!cityObj.monthVisited && !!cityObj.yearVisited && (
          <StyledLabelWrapper>
            <Label>
            {cityObj.monthVisited} {cityObj.yearVisited}
            </Label>
          </StyledLabelWrapper>
        )}
        {isPlaceBeen && (
          <>
            <Ratings 
              rating={cityObj.rating ? cityObj.rating : 0} 
              maxRating={5}
              onRate={setPlaceRating}
            />
            {cityObj.rating > 0 && (
              <Button 
                icon='close' 
                basic 
                size='small' 
                onClick={(e, value) => setPlaceRating(e, {...value, rating: 0})}
              />
            )}
          </>
        )}
        {!!cityObj.comment && (
          <>
            {editingComment ? (
              <TextArea 
                value={placeComment} 
                onChange={(e, data) => setPlaceComment(data.value)}
              />
            ) : (
              <Comment>{placeComment}</Comment>
            )}
            <Button 
              icon='pencil' 
              basic 
              size='small' 
              onClick={() => setEditingComment(true)}
            />
          </>
        )}
      </CardDescription>
      {shouldRenderUpdateButtons &&
        <Card.Content extra>
          <StyledLabelWrapper>
            <DeleteButton 
              content='Delete this place' 
              icon='delete' 
              onClick={() => {
                deletePlace(cityObj, isPlaceToGo, isPlaceBeen)
                setIsOpen(false)
              }} 
            />
          </StyledLabelWrapper>
          {isPlaceToGo && (
            <BeenThereButton 
              content="I've been to this place!" 
              icon='check' 
              onClick={() => moveToPlacesBeen(cityObj, isPlaceToGo, isPlaceBeen)}
            />
          )}
        </Card.Content>
      }
    </Card.Content>
  </Card>
);

export default InfoWindowCard;