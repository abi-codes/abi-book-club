"use server";

import { connectToDB } from "../mongoose";
import Book from "../models/book.model";
import BookReview from "../models/bookReview.model";
import User from "../models/user.model";

export async function createBook(book: any) {
  try {
    connectToDB();

    const newBook = new Book(book);
    return await newBook.save();
  } catch (error) {
    throw new Error(`Failed to create book: ${error}`);
  }
}

export async function fetchBooks() {
  try {
    connectToDB();

    const booksQuery = Book.find();

    const books = await booksQuery.exec();

    for (const book of books) {
      const reviews = await BookReview.find({ bookId: book._id });
      book.reviews = reviews;
    }

    return books;
  } catch (error) {
    console.error(`Failed to fetch books: ${error}`);
    throw new Error(`Failed to fetch books: ${error}`);
  }
}

export async function fetchBookDetails(id: string) {
  try {
    connectToDB();

    const book = await Book.findOne({ id });

    const reviews = await BookReview.find({ bookId: book._id }).populate(
      "createdBy",
      "name image",
      User
    );

    book.reviews = reviews;

    return book;
  } catch (error) {
    console.error(`Failed to fetch book details: ${error}`);
    throw new Error(`Failed to fetch book details: ${error}`);
  }
}

export async function updateOrCreateBook(book: any) {
  try {
    connectToDB();
    //Check if the book already exists in the db
    const response = await Book.findOne({
      bookId: book.bookId,
      title: book.title,
      subtitle: book.subtitle,
    });

    if (!response) {
      //If it doesn't exist, create it
      const newBook = new Book(book);
      return await newBook.save();
    } else {
      return response;
    }
  } catch (error: any) {
    throw new Error(`Failed to create/update book: ${error.message}`);
  }
}
