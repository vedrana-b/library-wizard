import React, { useState } from "react";
import Joi, { validate } from "joi-browser";

const Subgenres = ({
  subgenres,
  onNextStep,
  onAddSubgenre,
  onAddNewSubgenre,
  onBackStep,
  selectedSubgenre: bookSubgenre,
  newSubgenre,
}) => {
  const [selectedSubgenre, setSelectedSubgenre] = useState(bookSubgenre);
  const [addNewSubgenre, setAddNewSubgenre] = useState(newSubgenre);

  /**
   * Sets selected standard subgenre.
   *
   * @param {{id:string, name: string, isDescriptionRequired:boolean}} subgenre
   */
  const handleSubgenres = (subgenre) => {
    setAddNewSubgenre(false);
    setSelectedSubgenre(subgenre);
  };

  /**
   * Sets flag for adding custom subgenre
   */
  const handleAddNewSubgenre = () => {
    setAddNewSubgenre(true);
    setSelectedSubgenre({});
  };

  /**
   * Perform next step.
   * If standard subgenre is not selected or option for adding new subgenre
   * then user cannot go to next step
   */
  const nextHandler = () => {
    if (!validateSubgenres().error !== !validateAddNew().error) {
      onAddSubgenre(selectedSubgenre);
      onAddNewSubgenre(addNewSubgenre);
      onNextStep();
    } else {
      return;
    }
  };

  /**
   * Validates selected subgenre.
   * Returns error if no standard subgenre is selected
   */
  const validateSubgenres = () => {
    const subgenreSchema = Joi.object({
      id: Joi.number().required(),
      name: Joi.string().required(),
      isDescriptionRequired: Joi.boolean().optional(),
    });
    return subgenreSchema.validate(selectedSubgenre);
  };

  /**
   * Validates if option for adding new subgenre is selected
   * Return error if option is not selected
   */
  const validateAddNew = () => {
    const addNewSchema = Joi.boolean().valid(true).required();
    return addNewSchema.validate(addNewSubgenre);
  };

  const backHandler = () => {
    onBackStep();
  };

  return (
    <React.Fragment>
      <div className="grid-x genres">
        {subgenres.map((subgenre) => {
          return (
            <button
              key={subgenre.id}
              onClick={() => handleSubgenres(subgenre)}
              className={
                subgenre === selectedSubgenre
                  ? "button button__genre active"
                  : "button button__genre"
              }
            >
              {subgenre.name}
            </button>
          );
        })}
        <button
          onClick={handleAddNewSubgenre}
          className={
            addNewSubgenre
              ? "button button__genre active"
              : "button button__genre"
          }
        >
          Add new
        </button>
      </div>
      <div className="grid-x buttons">
        <button
          onClick={backHandler}
          className="button button__control button__control--back"
        >
          <i className="fa fa-angle-left button__icon"></i>
          Back
        </button>
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

export default Subgenres;
