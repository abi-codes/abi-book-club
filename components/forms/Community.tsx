"use client";

import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "../ui/form";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { CommunityValidation } from "@/lib/validations/community";

import { isBase64Image } from "@/lib/utils";
import { useUploadThing } from "@/lib/uploadthing";
import { ChangeEvent, useState } from "react";
import {
  createCommunity,
  updateCommunityInfo,
} from "@/lib/actions/community.actions";
import { Input } from "../ui/input";
import Image from "next/image";
import { Button } from "../ui/button";
import { Textarea } from "../ui/textarea";
import { usePathname, useRouter } from "next/navigation";
import { ICommunityForm } from "@/lib/types/community";

interface Props {
  community: ICommunityForm;
}

const Community = ({ community }: Props) => {
  const { startUpload } = useUploadThing("media");
  const [files, setFiles] = useState<File[]>([]);

  const [isLoading, setLoading] = useState(false);

  const pathname = usePathname();

  const router = useRouter();

  const form = useForm<z.infer<typeof CommunityValidation>>({
    resolver: zodResolver(CommunityValidation),
    defaultValues: {
      communityId: community?.id ? community.id : "",
      image: community?.image ? community.image : "",
      name: community?.name ? community.name : "",
      username: community?.username ? community.username : "",
      bio: community?.bio ? community.bio : "",
    },
  });

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

  const onSubmit = async (values: z.infer<typeof CommunityValidation>) => {
    setLoading(true);
    const blob = values.image;

    const hasImageChanged = isBase64Image(blob);
    if (hasImageChanged) {
      const imgRes = await startUpload(files);

      if (imgRes && imgRes[0].fileUrl) {
        values.image = imgRes[0].fileUrl;
      }
    }

    if (values.communityId?.trim() !== "") {
      await updateCommunityInfo(
        values.communityId,
        values.name,
        values.username,
        values.image,
        "active",
        values.bio
      );

      router.refresh();
    } else {
      const response = await createCommunity(
        values.name,
        values.username,
        values.image,
        values.bio,
        community.ownerUserId
      );
      router.push(`/clubs/${response}`);
    }
  };

  return (
    <Form {...form}>
      <form
        className="flex flex-col justify-start gap-5 max-h-96  sm:max-h-none overflow-y-auto"
        onSubmit={form.handleSubmit(onSubmit)}
      >
        <FormField
          control={form.control}
          name="image"
          render={({ field }) => (
            <FormItem className="flex items-center gap-4">
              <FormLabel className="account-form_image-label overflow-hidden">
                {field.value ? (
                  <Image
                    src={field.value}
                    alt="profile_icon"
                    width={96}
                    height={96}
                    priority
                    className="rounded-full object-cover"
                  />
                ) : (
                  <Image
                    src="/assets/profile.svg"
                    alt="profile_icon"
                    width={24}
                    height={24}
                    className="rounded-full object-contain"
                  />
                )}
              </FormLabel>
              <FormControl className="flex-1 text-base-semibold text-gray-200">
                <Input
                  type="file"
                  accept="image/*"
                  placeholder="Add profile photo"
                  className="account-form_image-input"
                  onChange={(e) => handleImage(e, field.onChange)}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem className="flex w-full flex-col gap-1">
              <FormLabel className="form-label">Name</FormLabel>
              <FormControl>
                <Input
                  type="text"
                  className="account-form_input form-input"
                  placeholder='e.g "Sci-Fi Scribes"'
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="username"
          render={({ field }) => (
            <FormItem className="flex w-full flex-col gap-3">
              <FormLabel className="form-label">Username</FormLabel>
              <FormControl>
                <Input
                  type="text"
                  className="account-form_input form-input"
                  placeholder='e.g. "scifiscribes" '
                  {...field}
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
              <FormLabel className="text-base-semibold form-label">
                Bio
              </FormLabel>
              <FormControl>
                <Textarea
                  rows={2}
                  className="account-form_input form-input resize-none"
                  placeholder="Describe what the book club is about"
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
  );
};

export default Community;
