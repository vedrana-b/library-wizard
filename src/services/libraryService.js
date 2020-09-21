import genres from './library.json';

export function getGenre() {
    return new Promise((resolve, reject) => {
        resolve(genres);
    });
}