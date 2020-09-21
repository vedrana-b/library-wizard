import React, { useState } from "react";
import Joi from "joi-browser";

const AddNewSubgenre = ({ onAddNewSubgenre, onNextStep, onBackStep }) => {
  const [description, setDescription] = useState(false);
  const [name, setName] = useState("");
  const [errors, setErrors] = useState([]);

  const handleDescription = () => {
    setDescription(true);
  };

  const nextHandler = () => {
    const validationResult = validate();
    if (!validationResult.error) {
      onAddNewSubgenre(description, name);
      onNextStep();
    } else {
      setErrors(validationResult.error.details);
    }
  };

  const handleName = ({ target: input }) => {
    setName(input.value);
  };

  const validate = () => {
    const result = {
      description,
      name,
    };
    const schema = Joi.object({
      description: Joi.boolean(),
      name: Joi.string()
        .required()
        .error((errors) => {
          errors.forEach((err) => {
            switch (err.type) {
              case "any.required":
                err.message = "Bookname is a required field";
                break;
              case "string.base":
                err.message = `Bookname should be a type of 'text'`;
                break;
              case "any.empty":
                err.message = `Bookname cannot be an empty field`;
                break;
              default:
                break;
            }
          });
          return errors;
        }),
    });
    return schema.validate(result);
  };

  const getError = (prop) => {
    return errors && errors.find((err) => err.path.includes(prop));
  };
  const backHandler = () => {
    onBackStep();
  };

  return (
    <div className="genres">
      <div className="grid-x error">
        <label className="book__subgenre">
          <input
            value={name}
            onChange={handleName}
            className="book__input"
            placeholder="Subgenre name"
          ></input>
        </label>
        {getError("name") && (
          <p className="error__msg">{getError("name").message}</p>
        )}
      </div>
      <div className="grid-x book__new-subgenre">
        <input onChange={handleDescription} type="checkbox"></input>
        <p className="book__new-subgenre--desc">
          Description is required for this subgenre
        </p>
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
    </div>
  );
};

export default AddNewSubgenre;
