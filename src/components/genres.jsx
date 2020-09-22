import React, { useState } from "react";
import Joi from "joi-browser";

const Genres = ({
  genres,
  onNextStep,
  onAddGenre,
  selectedGenre: bookGenre,
}) => {
  const [selectedGenre, setSelectedGenre] = useState(bookGenre);
    
  const handleGenres = (genre) => {
    setSelectedGenre(genre);
  };

  /**
   * Validates selected genre.
   * Returns error if no genre is selected
   */
  const validation = () => {
    const schema = Joi.object({
      id: Joi.number().required(),
      name: Joi.string().required(),
      subgenres: Joi.array().optional(),
    });
    return schema.validate(selectedGenre);
  };

  /**
   * Perform next step.
   * If genre is not selected, user cannot go to next step
   */
  const nextHandler = () => {
    if (!validation().error) {
      onAddGenre(selectedGenre);
      onNextStep();
    } else {
      return;
    }
  };

  return (
    <React.Fragment>
      <div className="grid-x genres">
        {genres.map((genre) => {
          return (
            <button
              onClick={() => handleGenres(genre)}
              key={genre.id}
              id={genre.id}
              className={
                genre === selectedGenre
                  ? "button button__genre active"
                  : "button button__genre"
              }
            >
              {genre.name}
            </button>
          );
        })}
      </div>
      <div className="grid-x buttons">
        <button
          onClick={nextHandler}
          className="button button__control button__control--next"
        >
          Next
        </button>
      </div>
    </React.Fragment>
  );
};

export default Genres;
