CREATE TABLE books (
    id SERIAL PRIMARY KEY,
    title VARCHAR(255),
    authors VARCHAR(255),
    isbn VARCHAR(255),
    image VARCHAR(2083),
    description TEXT
);

INSERT INTO books (title, authors, image, description, isbn)
VALUES('book', 'david', 'https://i.imgur.com/J5LVHEL.jpg', 'this book cool', '1234');
