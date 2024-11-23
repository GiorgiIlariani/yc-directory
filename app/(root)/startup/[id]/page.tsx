import { formatDate } from "@/lib/utils";
import { client } from "@/sanity/lib/client";
import { STARTUP_BY_ID_QUERY } from "@/sanity/lib/queries";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import React, { Suspense } from "react";
import markdownit from "markdown-it";
import View from "@/components/ViewSees";

const md = markdownit();

export const experimenatal_ppr = true;

type Author = {
  _id: string;
  image?: string | null;
  name?: string | null;
  username?: string | null;
};

type Post = {
  _id: string;
  _createdAt: string;
  title: string | null;
  description?: string | null;
  pitch?: string | null;
  image?: string | null;
  author?: Author | null;
  category?: string | null;
};

const page = async ({ params }: { params: Promise<{ id: string }> }) => {
  const id = (await params).id;

  const post: Post | null = await client.fetch(STARTUP_BY_ID_QUERY, { id });

  if (!post) return notFound();

  const parsedContent = post.pitch ? md.render(post.pitch) : "";

  return (
    <>
      <section className="pink_container !min-h-[230px]">
        <p className="tag">{formatDate(post._createdAt)}</p>
        <h1 className="heading">{post.title || "Untitled Startup"}</h1>
        <p className="sub-heading !max-w-5xl">
          {post.description || "No description provided"}
        </p>
      </section>

      <section className="section_container">
        {post.image ? (
          <img
            src={post.image}
            alt="thumbnail"
            className="w-full h-auto rounded-xl"
          />
        ) : (
          <p className="no-result">No image available</p>
        )}

        <div className="space-y-5 mt-10 max-w-4xl mx-auto">
          <div className="flex-between gap-5">
            {post.author ? (
              <Link
                href={`user/${post.author._id}`}
                className="flex gap-2 items-center mb-3"
              >
                <Image
                  src={post.author.image || ""} // Use a default avatar
                  alt="avatar"
                  width={64}
                  height={64}
                  className="rounded-full drop-shadow-lg"
                />
                <div>
                  <p className="text-20-medium">
                    {post.author.name || "Anonymous"}
                  </p>
                  <p className="text-16-medium !text-black-300">
                    {post.author.username || "Unknown"}
                  </p>
                </div>
              </Link>
            ) : (
              <p className="no-result">Author information not available</p>
            )}

            <p className="category-tag">{post.category || "Uncategorized"}</p>
          </div>
          <h3 className="text-30-bold">Pitch Details</h3>
          {parsedContent ? (
            <article
              className="prose max-w-4xl font-work-sans break-all"
              dangerouslySetInnerHTML={{ __html: parsedContent }}
            />
          ) : (
            <p className="no-result">No details provided</p>
          )}
        </div>
        <hr className="divider" />

        <Suspense fallback={<div className="view-skeleton" />}>
          <View id={id} />
        </Suspense>
      </section>
    </>
  );
};

export default page;
