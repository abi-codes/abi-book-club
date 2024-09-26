import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "../ui/form";
import { BookValidation } from "@/lib/validations/book";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import GoogleBookSearch from "../custom-ui/GoogleBookSearch";
import { Input } from "../ui/input";
import Rating from "../custom-ui/RatingInput";
import { useState } from "react";
import Image from "next/image";
import { Button } from "../ui/button";
import { IBook } from "@/lib/types/book";
interface Props {
  book?: IBook;
  onSubmit: (book: any) => void;
  back: () => void;
}

const BookshelfBook = ({ book, onSubmit, back }: Props) => {
  const [currentBook, setCurrentBook] = useState<any>(book);
  const [isLoading, setIsLoading] = useState(false);

  const form = useForm<z.infer<typeof BookValidation>>({
    resolver: zodResolver(BookValidation),
    defaultValues: {
      id: book?.id ? book.id : "",
      bookId: book?.bookId ? book?.bookId : "",
      title: book?.title ? book?.title : "",
      subtitle: book?.subtitle ? book?.subtitle : "",
      authors: book?.authors ? book?.authors : [],
      cover: book?.cover ? book.cover : "",
    },
  });

  const onFormSubmit = async (values: z.infer<typeof BookValidation>) => {
    setIsLoading(true);

    onSubmit(currentBook);

    setIsLoading(false);
  };

  const handleBookSelection = (googleBook: any) => {
    setCurrentBook({
      bookId: googleBook.id,
      title: googleBook.volumeInfo.title,
      subtitle: googleBook.volumeInfo.subtitle,
      description: googleBook.volumeInfo.description,
      categories: googleBook.volumeInfo.categories,
      authors: googleBook.volumeInfo.authors,
      cover: googleBook.highRes ? googleBook.highRes : "",
    });
  };

  return (
    <Form {...form}>
      <form
        className="flex flex-col justify-start sm:gap-10 gap-5 max-h-96  
        sm:max-h-none overflow-y-scroll scrollbar-hide relative"
        onSubmit={form.handleSubmit(onFormSubmit)}
      >
        <FormItem className="flex w-full flex-col gap-3 ">
          <FormLabel className="form-label">Enter book name</FormLabel>
          <FormControl>
            <GoogleBookSearch
              onBookSelected={(book) => handleBookSelection(book)}
            />
          </FormControl>
          <FormMessage />
        </FormItem>

        <div className="flex flex-col gap-1 items-center justify-center w-full">
          <h3 className="text-center text-heading4-medium text-black dark:text-light-1">
            {(currentBook && currentBook.title) || "No book selected"}
          </h3>
          <div className="flex flex-col gap-1">
            <div className="flex justify-center items-center relative  rounded-md overflow-hidden">
              {currentBook && currentBook.cover ? (
                <Image
                  src={currentBook?.cover}
                  alt={currentBook?.title}
                  height={96}
                  width={80}
                  className="object-cover"
                />
              ) : (
                <Image
                  src={"/assets/reading-svg.svg"}
                  alt="Want to read"
                  height={96}
                  width={96}
                  className="object-cover"
                />
              )}
            </div>
          </div>
        </div>
        <div className="flex flex-row justify-between">
          <Button
            type="submit"
            className="bg-red-800 dark:bg-red-800 dark:text-white"
            onClick={() => back()}
          >
            Back
          </Button>

          <Button
            type="submit"
            className="bg-red-800 dark:bg-red-800 dark:text-white"
            disabled={form.formState.isSubmitting || isLoading || !currentBook}
          >
            {form.formState.isSubmitting || isLoading ? "Submitting" : "Next"}
            {form.formState.isSubmitting ||
              (isLoading && (
                <svg
                  aria-hidden="true"
                  className="w-6 h-6 ml-2 text-slate-200 animate-spin dark:text-slate-600 fill-red-800"
                  viewBox="0 0 100 101"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z"
                    fill="currentColor"
                  />
                  <path
                    d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z"
                    fill="currentFill"
                  />
                </svg>
              ))}
          </Button>
        </div>
      </form>
    </Form>
  );
};

export default BookshelfBook;
