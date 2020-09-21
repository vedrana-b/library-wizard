export function addBook(book) {
    return new Promise((resolve, reject) => {
        console.log("POST /book: ", book);
        resolve({
            status: 201
        });
    });
}