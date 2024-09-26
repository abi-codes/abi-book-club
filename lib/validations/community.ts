import * as z from "zod";
import { findDuplicateCommunityByUsername } from "../actions/community.actions";

export const CommunityValidation = z
  .object({
    communityId: z.string(),
    image: z.string().url().nonempty(),
    name: z
      .string()
      .min(3, { message: "Minimum 3 characters." })
      .max(30, { message: "Maximum 30 caracters." }),
    username: z
      .string()
      .min(3, { message: "Minimum 3 characters." })
      .max(30, { message: "Maximum 30 caracters." })
      .regex(/^[^@]*$/, { message: "Username cannot contain '@'." }),
    bio: z
      .string()
      .min(3, { message: "Minimum 3 characters." })
      .max(1000, { message: "Maximum 1000 caracters." }),
  })
  .refine(
    async (value) => {
      const response = await findDuplicateCommunityByUsername(
        value.username,
        value.communityId
      );

      if (response) {
        return false;
      }
      return true;
    },
    { path: ["username"], message: "Username already taken." }
  );

export const CommunitySelectionValidation = z.object({
  communityId: z.string(),
});
