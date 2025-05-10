import { cn, formatDate } from "@/lib/utils";
import { EyeIcon } from "lucide-react";
import Link from "next/link";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { Author, Startup } from "@/sanity.types";
import { Skeleton } from "@/components/ui/skeleton";

export type StartupTypeCard = Omit<Startup, "author"> & { author?: Author };

const StartupCard = ({ post }: { post: StartupTypeCard }) => {
  const {
    _createdAt,
    views,
    author,
    title,
    category,
    _id,
    image,
    description,
  } = post;

  return (
    <li className="startup-card group flex flex-col justify-between">
      <div className="flex-between">
        <p className="startup_card_date">{formatDate(_createdAt)}</p>
        <div className="flex gap-1.5">
          <EyeIcon className="size-6 text-primary" />
          <span className="text-16-medium">{views ?? 0}</span>{" "}
          {/* Use fallback if views are missing */}
        </div>
      </div>

      <div className="flex-between mt-5 gap-5">
        <div className="flex-1">
          {author ? (
            <Link href={`/user/${author._id}`}>
              <p className="text-16-medium line-clamp-1">
                {author.name || "Unknown"}
              </p>{" "}
              {/* Fallback for author name */}
            </Link>
          ) : (
            <p className="text-16-medium line-clamp-1">Anonymous</p> // Fallback for missing author
          )}
          <Link href={`/startup/${_id}`}>
            <h3 className="text-26-semibold line-clamp-1 break-all">
              {title || "Untitled Startup"}
            </h3>
            {/* Fallback for title */}
          </Link>
        </div>
        {author?.image ? (
          <Link href={`/user/${author._id}`}>
            <Image
              src={author.image}
              alt={author.name || "User Avatar"} // Fallback for alt text
              width={48}
              height={48}
              className="rounded-full"
            />
          </Link>
        ) : (
          <div className="w-12 h-12 rounded-full bg-gray-300" /> // Fallback for missing author image
        )}
      </div>

      <Link href={`/startup/${_id}`}>
        <p className="startup-card_desc">
          {description || "No description available"}
        </p>{" "}
        {/* Fallback for description */}
        {image ? (
          <img src={image} alt="thumbnail" className="startup-card_img" />
        ) : (
          <div className="bg-gray-200 w-full h-56 rounded-lg" /> // Fallback for missing image
        )}
      </Link>

      <div className="flex-between gap-3 mt-auto pt-4">
        <Link href={`/?query=${category?.toLowerCase() || "uncategorized"}`}>
          <p className="text-16-medium">{category || "Uncategorized"}</p>
        </Link>
        <Button className="startup-card_btn" asChild>
          <Link href={`/startup/${_id}`}>Details</Link>
        </Button>
      </div>
    </li>
  );
};

export const StartupCardSkeleton = () => (
  <>
    {[0, 1, 2, 3, 4].map((index: number) => (
      <li key={cn("skeleton", index)}>
        <Skeleton className="startup-card_skeleton" />
      </li>
    ))}
  </>
);

export default StartupCard;
