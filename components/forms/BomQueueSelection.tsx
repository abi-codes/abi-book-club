import Image from "next/image";
import React, { useState } from "react";
import { Button } from "../ui/button";
import { Form } from "../ui/form";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { QueueValidation } from "@/lib/validations/queue";
import { zodResolver } from "@hookform/resolvers/zod";

interface Props {
  currentQueue: any[];
  handleAddQueue: (index: number) => void;
  handleRemoveQueue: (index: number) => void;
  next: () => void;
  back: () => void;
}

const BomQueueSelection = ({
  currentQueue,
  handleAddQueue,
  handleRemoveQueue,
  next,
  back,
}: Props) => {
  const form = useForm<z.infer<typeof QueueValidation>>({
    resolver: zodResolver(QueueValidation),
    defaultValues: {
      id: "",
      bookQueue: currentQueue ? currentQueue : [null, null, null],
    },
  });

  const isValidQueue = (queue: any[]) => {
    for (var item of queue) {
      if (item === null) {
        return false;
      }
    }
    return true;
  };

  const onFormSubmit = () => {
    next();
  };
  return (
    <Form {...form}>
      <form
        className="flex flex-col gap-5 sm:gap-10"
        onSubmit={form.handleSubmit(onFormSubmit)}
      >
        <div className="grid grid-cols-3 gap-3">
          {currentQueue.map((queue: any, index: number) =>
            queue ? (
              <div
                key={index}
                className="group flex flex-col gap-2 items-center 
              justify-center cursor-pointer relative overflow-hidden"
              >
                <div
                  className="absolute translate-x-20 group-hover:translate-x-0 
              duration-500 right-0 top-0 rounded-lg"
                >
                  <Image
                    src="/assets/more.svg"
                    alt="Close"
                    width={20}
                    height={20}
                  />
                </div>
                <Image
                  src={queue.cover}
                  alt={queue.title}
                  width={80}
                  height={100}
                />
                <p
                  className="text-center text-small-semibold h-10 
                px-2 overflow-hidden"
                >
                  {queue.title}
                </p>
                <div
                  className="absolute z-50 translate-x-20 group-hover:translate-x-0 
              duration-500 right-0 bottom-0 rounded-lg"
                  onClick={() => {
                    handleRemoveQueue(index);
                  }}
                >
                  <Image
                    src="/assets/delete.svg"
                    alt="Close"
                    width={20}
                    height={20}
                  />
                </div>
              </div>
            ) : (
              <Image
                key={index}
                src={"/assets/add-book.svg"}
                alt="Add book"
                className="m-auto cursor-pointer hover:"
                width={80}
                height={80}
                onClick={() => handleAddQueue(index)}
              />
            )
          )}
        </div>
        <div className="flex justify-between">
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
            disabled={
              form.formState.isSubmitting || !isValidQueue(currentQueue)
            }
          >
            Submit
          </Button>
        </div>
      </form>
    </Form>
  );
};

export default BomQueueSelection;
