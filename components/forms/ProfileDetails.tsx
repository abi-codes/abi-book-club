"use client";

import { useUploadThing } from "@/lib/uploadthing";
import { isBase64Image } from "@/lib/utils";
import {
  ProfileDetailsValidation,
  UserValidation,
} from "@/lib/validations/user";
import { zodResolver } from "@hookform/resolvers/zod";
import React, { ChangeEvent, useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "../ui/form";
import { Input } from "../ui/input";
import { Textarea } from "../ui/textarea";
import { fetchUser, updateUserDetails } from "@/lib/actions/user.actions";
import { Button } from "../ui/button";

interface Props {
  user: {
    id: string;
    backgroundImage: string;
    bio: string;
    occupation: string;
    phoneNumber: string;
  };
}

const ProfileDetails = ({ user }: Props) => {
  const { startUpload } = useUploadThing("media");

  const [files, setFiles] = useState<File[]>([]);

  const [isLoading, setIsLoading] = useState(false);

  const form = useForm<z.infer<typeof ProfileDetailsValidation>>({
    resolver: zodResolver(ProfileDetailsValidation),
    defaultValues: {
      id: user.id,
      backgroundImage: user.backgroundImage ? user.backgroundImage : "",
      bio: user.bio ? user.bio : "",
      occupation: user.occupation ? user.occupation : "",
      phoneNumber: user.phoneNumber ? user.phoneNumber : "",
    },
  });

  const onSubmit = async (values: z.infer<typeof ProfileDetailsValidation>) => {
    setIsLoading(true);

    if (values.backgroundImage) {
      const blob = values.backgroundImage;

      const hasImageChanged = isBase64Image(blob);
      if (hasImageChanged) {
        const imgRes = await startUpload(files);

        if (imgRes && imgRes[0].fileUrl) {
          values.backgroundImage = imgRes[0].fileUrl;
        }
      }
    }

    await updateUserDetails({
      userId: user.id,
      backgroundImage: values.backgroundImage ? values.backgroundImage : null,
      bio: values.bio,
      occupation: values.occupation ? values.occupation : null,
      phoneNumber: values.phoneNumber ? values.phoneNumber : null,
    });

    setIsLoading(false);
  };

  const handleImage = (
    e: ChangeEvent<HTMLInputElement>,
    fieldChange: (value: string) => void
  ) => {
    e.preventDefault();

    const fileReader = new FileReader();

    if (e.target.files && e.target.files.length > 0) {
      const file = e.target.files[0];
      setFiles(Array.from(e.target.files));

      if (!file.type.includes("image")) return;

      fileReader.onload = async (event) => {
        const imageDataUrl = event.target?.result?.toString() || "";
        fieldChange(imageDataUrl);
      };

      fileReader.readAsDataURL(file);
    }
  };

  return (
    <section
      className="flex max-sm:flex-col gap-10 border border-solid
     border-gray-300-400 rounded-xl p-5 shadow-sm"
    >
      <h1 className="profile-heading">Profile details</h1>
      <Form {...form}>
        <form
          className="flex flex-1 flex-col gap-2"
          onSubmit={form.handleSubmit(onSubmit)}
        >
          <FormField
            control={form.control}
            name="backgroundImage"
            render={({ field }) => (
              <FormItem className="flex items-center gap-4">
                <FormLabel className="account-form_image-label overflow-hidden">
                  {field.value ? (
                    <img
                      src={field.value}
                      alt="profile_icon"
                      className="rounded-full object-contain"
                    />
                  ) : (
                    <img
                      src="/assets/profile.svg"
                      alt="profile_icon"
                      className="object-contain"
                    />
                  )}
                </FormLabel>
                <FormControl className="flex-1 text-base-semibold dark:text-gray-200">
                  <Input
                    type="file"
                    accept="image/*"
                    placeholder="Add profile photo"
                    className="account-form_image-input form-label"
                    onChange={(e) => handleImage(e, field.onChange)}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="bio"
            render={({ field }) => (
              <FormItem className="flex w-full flex-col gap-3">
                <FormLabel className="form-label">Bio</FormLabel>
                <FormControl>
                  <Textarea
                    className="account-form_input form-input resize-none"
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="occupation"
            render={({ field }) => (
              <FormItem className="flex w-full flex-col gap-3">
                <FormLabel className="form-label">
                  Occupation (optional)
                </FormLabel>
                <FormControl>
                  <Input
                    type="text"
                    className="account-form_input form-input"
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="phoneNumber"
            render={({ field }) => (
              <FormItem className="flex w-full flex-col gap-3">
                <FormLabel className="form-label">
                  Contact number (optional)
                </FormLabel>
                <FormControl>
                  <Input
                    type="text"
                    className="account-form_input form-input"
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <Button
            type="submit"
            className="bg-red-800 dark:bg-red-800 dark:text-white"
            disabled={form.formState.isSubmitting || isLoading}
          >
            {form.formState.isSubmitting || isLoading ? "Submitting" : "Save"}
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
        </form>
      </Form>
    </section>
  );
};

export default ProfileDetails;
