import { currentUser } from "@clerk/nextjs";
import { fetchUser } from "@/lib/actions/user.actions";
import { redirect } from "next/navigation";
import { fetchBookDetails } from "@/lib/actions/book.actions";
import Image from "next/image";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import Rating from "@/components/custom-ui/RatingInput";
import { Separator } from "@/components/ui/separator";

async function Page({ params }: { params: { id: string } }) {
  if (!params.id) return null;

  const user = await currentUser();

  if (!user) return null;

  const userInfo = await fetchUser(user.id);

  if (!userInfo?.user?.onboarded) redirect("/onboarding");

  const bookDetails = await fetchBookDetails(params.id);

  const cateogries = await bookDetails?.categories.map((category: any) => (
    <p className="text-subtle-semibold text-center lg:text-small-regular text-black dark:text-light-1">
      {category}
    </p>
  ));

  const reviews = await bookDetails?.reviews.map(
    (review: any, index: number) => (
      <div className="flex flex-col gap-4">
        <div className="grid grid-cols-[1fr,18fr] gap-2">
          <div className="relative h-10 w-10 object-cover">
            <Image
              src={review?.createdBy?.image}
              alt="Profile image"
              fill
              className="rounded-full object-cover shadow-2xl"
            />
          </div>
          <div className="flex flex-col gap-1 accordion-titles">
            <p>{review?.createdBy?.name}</p>
            <Rating defaultRating={review?.rating} />
            <p
              className="text-subtle-semibold lg:text-small-regular h-16 
          text-black dark:text-light-1 overflow-y-auto "
            >
              {review?.review}
            </p>
          </div>
        </div>
        {bookDetails?.reviews.length - 1 !== index && <Separator />}
      </div>
    )
  );

  return (
    <section className="relative">
      <div className="flex flex-col items-center  gap-4">
        <p className="text-heading2-semibold text-black dark:text-light-1">
          {bookDetails.title}
        </p>
        <p className="text-black dark:text-light-1">
          {bookDetails.reviews && bookDetails.reviews.length > 0
            ? bookDetails?.reviews?.reduce(
                (totalRating: number, review: any) => {
                  return totalRating + (review.rating ? review.rating : 0);
                },
                0
              ) / bookDetails?.reviews?.length
            : 0}
        </p>
        <Rating
          defaultRating={
            bookDetails?.reviews?.reduce((totalRating: number, review: any) => {
              return totalRating + review.rating;
            }, 0) / bookDetails?.reviews?.length
          }
        />

        <div className="relative w-40 h-60">
          <Image
            src={bookDetails.cover}
            alt={bookDetails.title}
            fill
            className="object-contain"
          />
        </div>

        <Accordion defaultValue={["item-1"]} type="multiple" className="w-full">
          <AccordionItem value="item-1">
            <AccordionTrigger className="accordion-titles">
              Reviews
            </AccordionTrigger>
            <AccordionContent>
              <div className="flex flex-col justify-start items-start w-full">
                {reviews}
              </div>
            </AccordionContent>
          </AccordionItem>
          <AccordionItem value="item-2">
            <AccordionTrigger className="accordion-titles">
              Categories
            </AccordionTrigger>
            <AccordionContent>
              <div className="flex flex-col justify-start items-start">
                {cateogries}
              </div>
            </AccordionContent>
          </AccordionItem>

          <AccordionItem value="item-3">
            <AccordionTrigger className="accordion-titles">
              Description
            </AccordionTrigger>
            <AccordionContent>
              {bookDetails.description && (
                <div
                  className="text-subtle-semibold lg:text-small-regular text-black dark:text-light-1"
                  dangerouslySetInnerHTML={{
                    __html: bookDetails.description,
                  }}
                ></div>
              )}
            </AccordionContent>
          </AccordionItem>
        </Accordion>
      </div>
    </section>
  );
}

export default Page;
