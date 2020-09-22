import React, { useEffect, useState } from "react";
import Steps from "./steps";
import Genres from "./genres";
import Subgenres from "./subgenres";
import Information from "./information";
import AddNewSubgenre from "./addSubgenre";
import SuccessMessage from "./successMessage";
import _ from "lodash";

import * as libraryService from "../services/libraryService";
import * as bookService from "../services/bookService";

const Wizard = () => {
  const [genres, setGenres] = useState([]);
  const [book, setBook] = useState({
    genre: {},
    subgenre: {},
    information: {},
  });
  const [newSubgenre, setNewSubgenre] = useState();
  const [step, setStep] = useState(1);
  const [isFinished, setIsFinished] = useState();

  /**
   * Load initial genres
   */
  useEffect(() => {
    libraryService.getGenre().then((allGenres) => {
      setGenres(allGenres.genres);
    });
  });

  /**
   * Add selected genre to book object
   * 
   * @param {object} selectedGenre
   */
  const handleAddGenre = (selectedGenre) => {
    setBook({ ...book, genre: selectedGenre });
  };

  /**
   * Add selected subgenre to book object
   * 
   * @param {object} selectedSubgenre
   */
  const handleAddSubgenre = (selectedSubgenre) => {
    setBook({ ...book, subgenre: selectedSubgenre });
  };

  const handleNextStep = () => {
    setStep(step + 1);
  };

  const handleBackStep = () => {
    setStep(step - 1);
  };

  /**
   * Checks if add new subgenre is clicked
   * 
   * @param {boolean} addNewSubgenre
   */
  const handleAddNewSubgenre = (addNewSubgenre) => {
    setNewSubgenre(addNewSubgenre);
  };

  /**
   * Adds new subgenre to book object
   * 
   * @param {boolean} description
   * @param {string} name
   */
  const handleNewSubgenre = (description, name) => {
    setBook({
      ...book,
      subgenre: { name: name, isDescriptionRequired: description },
    });
  };

  /**
   * Adds object with new book information to book object
   * Sending new book to backend service
   * 
   * @param {object} information
   */
  const handleSuccess = (information) => {
    const newBook = { ...book, information };
    setBook(newBook);
    bookService.addBook(newBook).then((response) => {
      if (response.status === 201) {
        setIsFinished(true);
      }
    });
  };

  /**
   * Returns corresponding component based on current flow.
   * Current flow is determined with function resolveFlow()
   * 
   * @param {number} step - current step
   */
  const renderSwitch = (step) => {
    return resolveFlow()[step - 1].component;
  };

  /**
   * Returns current flow based on: 
   * 1. Init flow - contains two steps: genre, subgenre
   * 2. Standard flow - contains three steps: genre, subgenre, information
   * 3. Custom flow - contains four steps: genre, subgenre, new subgenre, information
   * 
   * @returns current flow as array of steps
   */
  const resolveFlow = () => {
    const steps = {
      genreStep: {
        label: "Genre",
        component: (
          <Genres
            selectedGenre={book.genre}
            genres={genres}
            onAddGenre={handleAddGenre}
            onNextStep={handleNextStep}
          />
        ),
      },
      subgenreStep: {
        label: "Subgenre",
        component: (
          <Subgenres
            onNextStep={handleNextStep}
            onBackStep={handleBackStep}
            onAddSubgenre={handleAddSubgenre}
            subgenres={book.genre.subgenres}
            onAddNewSubgenre={handleAddNewSubgenre}
            selectedSubgenre={book.subgenre}
            newSubgenre={newSubgenre}
          />
        ),
      },
      addNewSubgenreStep: {
        label: "Add new subgenre",
        component: (
          <AddNewSubgenre
            onAddNewSubgenre={handleNewSubgenre}
            onNextStep={handleNextStep}
            onBackStep={handleBackStep}
          />
        ),
      },
      informationStep: {
        label: "Information",
        component: (
          <Information
            onBackStep={handleBackStep}
            onAddBook={handleSuccess}
            isDescriptionRequired={book.subgenre.isDescriptionRequired}
          />
        ),
      },
      placeholderStep: {
        label: "",
        step: "...",
        component: null,
      },
    };

    const {
      genreStep,
      subgenreStep,
      placeholderStep,
      informationStep,
      addNewSubgenreStep,
    } = steps;

    const initFlow = [genreStep, subgenreStep, placeholderStep];

    const standardFlow = [genreStep, subgenreStep, informationStep];

    const customFlow = [
      genreStep,
      subgenreStep,
      addNewSubgenreStep,
      informationStep,
    ];

    if (_.isEmpty(book.subgenre) && newSubgenre === undefined) {
      return initFlow;
    } else if (newSubgenre) {
      return customFlow;
    } else {
      return standardFlow;
    }
  };

  /**
   * Used for adding new book and returning to first step
   */
  const restartHandler = () => {
    setStep(1);
    setBook({ genre: {}, subgenre: {} });
    setNewSubgenre();
    setIsFinished();
  };

  return (
    <div className="container">
      <div className="grid-container lib">
        {isFinished ? (
          <SuccessMessage onRestart={restartHandler} />
        ) : (
          <React.Fragment>
            <div className="grid-x lib__title">
              <h5>Add book - New book</h5>
            </div>
            <Steps step={step} flow={resolveFlow()} />
            {renderSwitch(step)}
          </React.Fragment>
        )}
      </div>
    </div>
  );
};

export default Wizard;
