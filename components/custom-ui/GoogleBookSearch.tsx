import React, { useEffect, useRef, useState } from "react";
import { Input } from "../ui/input";
import Image from "next/image";

interface Props {
  onBookSelected: (book: any) => void;
}

const GoogleBookSearch = ({ onBookSelected }: Props) => {
  const [inputValue, setInputValue] = useState("");
  const [predections, setPredictions] = useState([]);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    async function fetchBooks(input: string) {
      await fetch(
        `https://www.googleapis.com/books/v1/volumes?q=${input}&key=${process.env.NEXT_PUBLIC_PLACES_API_KEY}`
      )
        .then((res) => res.json())
        .then((data: any) => {
          if (data.items) {
            setPredictions(data.items);
            setOpen(true);
          } else {
            setPredictions([]);
          }
        });
    }

    inputValue.trim() === "" ? setOpen(false) : fetchBooks(inputValue);
  }, [inputValue]);

  const handleClickOutside = (
    ref: React.RefObject<HTMLElement>,
    callback: () => void
  ) => {
    const handleClick = (event: MouseEvent) => {
      if (ref.current && !ref.current.contains(event.target as Node)) {
        callback();
      }
    };

    useEffect(() => {
      document.addEventListener("mousedown", handleClick);
      return () => {
        document.removeEventListener("mousedown", handleClick);
      };
    }, []);
  };

  const wrapperRef = useRef(null);

  handleClickOutside(wrapperRef, () => {
    setInputValue("");
  });

  const handleSetPrediction = async (prediction: any) => {
    fetch(
      `https://www.googleapis.com/books/v1/volumes/${prediction.id}?key=${process.env.NEXT_PUBLIC_PLACES_API_KEY}&fife=w800-h900`
    )
      .then((res) => res.json())
      .then(async (data: any) => {
        onBookSelected({
          highRes: `https://books.google.com/books/publisher/content/images/frontcover/${data.id}?fife=w400-h600&source=gbs_api`,
          ...data,
        });
        setInputValue("");
      });
  };

  return (
    <div className=" relative w-full">
      <Input
        className="account-form_input form-input bg-white dark:bg-dark-3 "
        placeholder="Search for book..."
        onChange={(evt) => setInputValue(evt.target.value)}
        value={inputValue}
      />
      {open && (
        <div
          ref={wrapperRef}
          className="absolute flex flex-col w-full gap-4 bg-white dark:bg-dark-2 overflow-y-auto z-50 h-36 sm:h-72"
        >
          {predections.map((prediction: any, index) => (
            <div
              className="hover:bg-gray-100 dark:hover:bg-dark-4 p-2"
              key={index}
            >
              <div className="flex items-center gap-1 w-full max-h-20   cursor-pointer  ">
                <div className="flex justify-center items-center relative p-4 w-16 h-20 rounded-md overflow-hidden">
                  <Image
                    alt={prediction?.volumeInfo?.title}
                    src={prediction?.volumeInfo?.imageLinks?.thumbnail}
                    fill
                    sizes="100% 100%"
                    className="object-cover"
                  />
                </div>
                <div
                  onClick={() => handleSetPrediction(prediction)}
                  className="flex flex-col w-full text-black dark:text-white px-4 py-2 cursor-pointer"
                >
                  <p className="overflow-hidden text-ellipsis h-6">
                    {prediction.volumeInfo.title}
                  </p>
                  <div className="flex gap-1 h-6">
                    {prediction.volumeInfo?.authors?.map((item: any) => (
                      <p className="text-subtle-medium">{item}</p>
                    ))}
                  </div>
                </div>
                {index !== prediction.length - 1 && (
                  <hr className="border-white" />
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default GoogleBookSearch;
