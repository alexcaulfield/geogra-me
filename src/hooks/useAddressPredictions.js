/**
 * Created by Sebastian De Deyne
 * https://sebastiandedeyne.com/writing-a-custom-react-hook-google-places-autocomplete/
 */

import { useEffect, useRef, useState, useMemo } from "react";
import { debounce } from "lodash";

export default function useAddressPredictions(input) {
  const [predictions, setPredictions] = useState([]);

  const autocomplete = useRef();

  if (!autocomplete.current) {
    autocomplete.current =
      new window.google.maps.places.AutocompleteService();
  }

  const debouncedGetPlacePredictions = useMemo(
    () =>
      debounce(input => {
        autocomplete.current.getPlacePredictions(
          { input },
          predictions => {
            if (predictions) {
              setPredictions(
                predictions.map(prediction => {
                  return {
                    key: prediction.id,
                    value: prediction.description,
                    text: prediction.description,
                  };
                })
              );
            }
          }
        );
      }, 500),
    []
  );

  useEffect(() => {
    debouncedGetPlacePredictions(input);
  }, [debouncedGetPlacePredictions, input]);

  return predictions;
}