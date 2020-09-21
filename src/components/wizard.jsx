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
  const [book, setBook] = useState({ genre: {}, subgenre: {}, information: {} });
  const [newSubgenre, setNewSubgenre] = useState();
  const [step, setStep] = useState(1);
  const [isFinished, setIsFinished] = useState();

  useEffect(() => {
    libraryService.getGenre().then(allGenres => {
    setGenres(allGenres.genres);
    });
  });

  const handleAddGenre = (selectedGenre) => {
    setBook({ ...book, genre: selectedGenre });
  };

  const handleAddSubgenre = (selectedSubgenre) => {
    setBook({ ...book, subgenre: selectedSubgenre });
  };

  const handleNextStep = () => {
    setStep(step + 1);
  };

  const handleBackStep = () => {
    setStep(step - 1);
  };

  const handleAddNewSubgenre = (addNewSubgenre) => {
    setNewSubgenre(addNewSubgenre);
  };

  const handleNewSubgenre = (description, name) => {
    setBook({
      ...book,
      subgenre: { name: name, isDescriptionRequired: description },
    });
  };

  const handleSuccess = (information) => {
    const newBook = {...book, information};
    setBook(newBook);
    bookService.addBook(newBook).then(response => {
        if (response.status === 201) {
            setIsFinished(true);
        }
    })
  };

  const renderSwitch = (step) => {
    return resolveFlow()[step - 1].component;
  };

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
          <Information onBackStep={handleBackStep} onAddBook={handleSuccess} isDescriptionRequired={book.subgenre.isDescriptionRequired}/>
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
