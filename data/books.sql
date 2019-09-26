CREATE TABLE books (
    id SERIAL PRIMARY KEY,
    title VARCHAR(255),
    authors VARCHAR(255),
    isbn VARCHAR(255),
    image VARCHAR(2083),
    description TEXT
);

INSERT INTO books (title, authors, image, description)
VALUES('book', 'david', 'bookUrl', 'this book cool');
