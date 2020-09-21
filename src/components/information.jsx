import React, { useState } from "react";
import Joi from "joi-browser";

const Information = ({ onAddBook, onBackStep, isDescriptionRequired }) => {
  const [errors, setErrors] = useState([]);
  const [bookInformation, setBookInformation] = useState({
    title: "",
    author: "",
    publisher: "",
    isbn: "",
    date: "",
    numOfPages: "",
    format: "",
    desc: "",
    edition: "",
    editionLang: "",
  });

  const handleSuccess = () => {
    setErrors([]);
    const validationResult = validate();
    if (!validationResult.error) {
      onAddBook(bookInformation);
    } else {
      setErrors(validationResult.error.details);
    }
  };

  const validate = () => {
    const schema = Joi.object({
      title: Joi.string().required().error(setErrorMessage("Title")),
      author: Joi.string().required().error(setErrorMessage("Author")),
      publisher: Joi.string().required().error(setErrorMessage("Publisher")),
      isbn: Joi.string().required().error(setErrorMessage("Isbn")),
      date: Joi.date().required().error(setErrorMessage("Date")),
      numOfPages: Joi.number()
        .required()
        .min(1)
        .error(setErrorMessage("Number of pages")),
      format: Joi.string().required().error(setErrorMessage("Format")),
      edition: Joi.string().required().error(setErrorMessage("Edition")),
      editionLang: Joi.string()
        .required()
        .error(setErrorMessage("Edition Language")),
      desc: isDescriptionRequired
        ? Joi.string().required().error(setErrorMessage("Description"))
        : Joi.string().allow("").optional(),
    }).options({
      abortEarly: false,
    });

    return schema.validate(bookInformation);
  };

  const backHandler = () => {
    onBackStep();
  };
  const getError = (prop) => {
    return errors && errors.find((err) => err.path.includes(prop));
  };

  const setErrorMessage = (prop) => {
    return (errors) => {
      errors.forEach((err) => {
        switch (err.type) {
          case "any.required":
            err.message = `${prop} is required field`;
            break;
          case "string.base":
            err.message = `${prop} should be a type of 'text'`;
            break;
          case "any.empty":
            err.message = `${prop} should not be empty`;
            break;
          case "number.base":
            err.message = `${prop} should be a type 'integer'`;
            break;
          case "number.min":
            err.message = `${prop} should be greater than ${err.context.min}'`;
            break;
          case "date.base":
            err.message = `${prop} should be a type of date`;
            break;
          default:
            break;
        }
      });
      return errors;
    };
  };

  return (
    <div>
      <div className="grid-x">
        <label className="book__label">
          Book title
          <input
            value={bookInformation.title}
            onChange={({ target }) =>
              setBookInformation({ ...bookInformation, title: target.value })
            }
            className="book__input"
            placeholder="Book title"
          ></input>
          {getError("title") && (
            <p className="error__msg">{getError("title").message}</p>
          )}
        </label>
      </div>
      <div className="grid-x">
        <label className="book__label">
          Author
          <select
            className="book__input"
            value={bookInformation.author}
            onChange={({ target }) =>
              setBookInformation({ ...bookInformation, author: target.value })
            }
          >
            <option value="" disabled defaultValue>
              Author
            </option>
            <option value="Jane Austen">Jane Austen</option>
            <option value="William Faulkner">William Faulkner</option>
          </select>
          {getError("author") && (
            <p className="error__msg">{getError("author").message}</p>
          )}
        </label>
      </div>
      <div className="grid-x">
        <label className="book__label">
          ISBN
          <input
            value={bookInformation.isbn}
            onChange={({ target }) =>
              setBookInformation({ ...bookInformation, isbn: target.value })
            }
            className="book__input"
            placeholder="ISBN"
          ></input>
          {getError("isbn") && (
            <p className="error__msg">{getError("isbn").message}</p>
          )}
        </label>
      </div>
      <div className="grid-x">
        <label className="book__label">
          Publisher
          <select
            value={bookInformation.publisher}
            onChange={({ target }) =>
              setBookInformation({
                ...bookInformation,
                publisher: target.value,
              })
            }
            className="book__input"
          >
            <option value="" disabled defaultValue>
              Publisher
            </option>
            <option value="Jane Austen">Jane Austen</option>
            <option value="William Faulkner">William Faulkner</option>
          </select>
          {getError("publisher") && (
            <p className="error__msg">{getError("publisher").message}</p>
          )}
        </label>
      </div>
      <div className="grid-x">
        <label
          value={bookInformation.date}
          onChange={({ target }) =>
            setBookInformation({ ...bookInformation, date: target.value })
          }
          className="book__label"
        >
          Data published
          <input type="date" className="book__input book__input--md"></input>
          {getError("date") && (
            <p className="error__msg">{getError("date").message}</p>
          )}
        </label>
      </div>
      <div className="grid-x">
        <label className="book__label">
          Number of pages
          <input
            value={bookInformation.numOfPages}
            onChange={({ target }) =>
              setBookInformation({
                ...bookInformation,
                numOfPages: target.value,
              })
            }
            className="book__input book__input--sm"
            placeholder="Number of pages"
          ></input>
          {getError("numOfPages") && (
            <p className="error__msg">{getError("numOfPages").message}</p>
          )}
        </label>
      </div>
      <div className="grid-x">
        <label className="book__label">
          Format
          <select
            value={bookInformation.format}
            onChange={({ target }) =>
              setBookInformation({ ...bookInformation, format: target.value })
            }
            className="book__input book__input--md"
          >
            <option value="" disabled defaultValue>
              Format
            </option>
            <option value="format 1">Format 1</option>
            <option value="format 2">Format 2</option>
          </select>
          {getError("format") && (
            <p className="error__msg">{getError("format").message}</p>
          )}
        </label>
      </div>
      <div className="grid-x">
        <label className="book__label book__label--sm">
          Edition
          <input
            value={bookInformation.edition}
            onChange={({ target }) =>
              setBookInformation({ ...bookInformation, edition: target.value })
            }
            className="book__input book__input--md"
            placeholder="Edition"
          ></input>
          {getError("edition") && (
            <p className="error__msg">{getError("edition").message}</p>
          )}
        </label>

        <label className="book__label">
          Edition language
          <select
            value={bookInformation.editionLang}
            onChange={({ target }) =>
              setBookInformation({
                ...bookInformation,
                editionLang: target.value,
              })
            }
            className="book__input book__input--md"
          >
            <option value="" disabled defaultValue>
              Edition language
            </option>
            <option value="format 1">Format 1</option>
            <option value="format 2">Format 2</option>
          </select>
          {getError("editionLang") && (
            <p className="error__msg">{getError("editionLang").message}</p>
          )}
        </label>
      </div>
      <div className="grid-x">
        <label className="book__label">
          Description
          <textarea
            value={bookInformation.desc}
            onChange={({ target }) =>
              setBookInformation({ ...bookInformation, desc: target.value })
            }
            className="book__textarea"
            placeholder="Type the description..."
          ></textarea>
          {getError("desc") && (
            <p className="error__msg">{getError("desc").message}</p>
          )}
        </label>
      </div>
      <div className="grid-x buttons">
        <button
          onClick={backHandler}
          className="button button__control button__control--back"
        >
          <i className="fa fa-angle-left button__icon"></i>Back
        </button>
        <button
          onClick={handleSuccess}
          className="button button__control button__control--next"
        >
          Add
        </button>
      </div>
    </div>
  );
};

export default Information;
