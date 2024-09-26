import { CommunitySelectionValidation } from "@/lib/validations/community";
import { zodResolver } from "@hookform/resolvers/zod";
import React, { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { Form } from "../ui/form";
import { Button } from "../ui/button";
import Representation from "../custom-ui/Representation";
import { fetchCommunitiesByUserId } from "@/lib/actions/community.actions";
import { set } from "mongoose";

interface Props {
  currentCommunityId?: string;
  userId: string;
  selectCommunity: (communityId: string) => void;
  next: () => void;
}

const CommunitySelection = ({
  currentCommunityId,
  userId,
  selectCommunity,
  next,
}: Props) => {
  const [isLoading, setIsLoading] = useState(false);
  const [selectedOption, setSelectionOption] = useState<any>(null);

  const [options, setOptions] = useState<any[]>([]);

  useEffect(() => {
    if (selectedOption && selectedOption._id) {
      selectCommunity(selectedOption._id);
    }
  }, [selectedOption]);

  useEffect(() => {
    setIsLoading(true);
    fetchCommunitiesByUserId({
      userId: userId,
      pageNumber: 1,
      pageSize: 10,
    })
      .then((response) => {
        setOptions(response.communities);
        if (currentCommunityId) {
          setSelectionOption(
            response.communities.find(
              (community: any) => community._id === currentCommunityId
            )
          );
        }
        // setTotalPages(response.communitiesTotalPages);
        setIsLoading(false);
      })
      .catch((error) => {
        console.error("Error fetching user clublist", error);
      });
  }, []);

  const form = useForm<z.infer<typeof CommunitySelectionValidation>>({
    resolver: zodResolver(CommunitySelectionValidation),
    defaultValues: {
      communityId: currentCommunityId ? currentCommunityId : "",
    },
  });

  const onFormSubmit = () => {
    if (selectedOption && selectedOption.id !== null) {
      next();
    }
  };

  return (
    <Form {...form}>
      <form
        className="flex flex-col gap-5 sm:gap-10"
        onSubmit={form.handleSubmit(onFormSubmit)}
      >
        {isLoading && <p>Please wait while we fetch your communities...</p>}
        {!isLoading && options && options.length === 0 && (
          <p>
            You need to create a community first before you can create voting
            queues
          </p>
        )}
        {!isLoading && options && options.length > 0 && (
          <Representation
            selectedOption={selectedOption}
            options={options}
            onChange={(option) => {
              setSelectionOption(option);
            }}
          />
        )}

        <Button
          type="submit"
          className="bg-red-800 dark:bg-red-800 dark:text-white"
          disabled={form.formState.isSubmitting || !selectedOption}
        >
          Submit
        </Button>
      </form>
    </Form>
  );
};

export default CommunitySelection;
