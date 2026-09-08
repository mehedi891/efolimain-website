import Link from "next/link";
import Image from "next/image";
import type { Post } from "@/data/cms-types";
import ButtonWithIcon from "@/components/ButtonWithIcon";
import AnimatedSection from "@/components/AnimatedSection";

function formatDate(iso: string | null, locale = "en-US") {
  if (!iso) return "";
  const d = new Date(iso);
  if (isNaN(d.getTime())) return "";
  return new Intl.DateTimeFormat(locale, {
    month: "long",
    day: "numeric",
    year: "numeric",
  }).format(d);
}

interface BlogsProps {
  posts: Post[];
}

const Blogs = ({ posts }: BlogsProps) => {

  return (
    <section className="">
      <AnimatedSection>
        <div className="mx-auto max-w-7xl px-4 sm:px-6 pb-14 sm:pb-10 md:pb-24 md:pt-10">
          <div className="flex items-end md:justify-between flex-wrap gap-4">
            <h2 className="md:text-5xl/[1.13] text-3xl/snug text-left max-w-[500px] font-bold font-display">Discover Blogs That Help
              You Sell Smarter</h2>
            <Link href="/blog">
              <ButtonWithIcon text1="View all Articles" text2="View all Articles" pClass="text-base font-semibold" />
            </Link>

          </div>
          {posts && posts.length > 0 ? (
            <div className="pt-8 md:pt-13 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {posts.map((post) => (
                <Link
                  key={post.id}
                  href={`/blog/${post.slug}`}
                  className="group flex h-full flex-col overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-sm transition duration-300 hover:-translate-y-0.5 hover:border-[#0D99FF]/40 hover:shadow-lg"
                >
                  <div className="relative aspect-[16/9] overflow-hidden bg-gray-50">
                    {post.cover ? (
                      <Image
                        src={post.cover}
                        alt={post.coverAlt}
                        fill
                        sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 33vw"
                        className="object-cover transition duration-700 ease-out group-hover:scale-105"
                      />
                    ) : (
                      <div className="grid h-full w-full place-items-center bg-gradient-to-br from-[#0D99FF] to-[#7dd3fc]">
                        <span className="px-6 text-center font-display text-lg font-bold text-white/90">
                          {post.category?.name || "eFoli"}
                        </span>
                      </div>
                    )}
                  </div>
                  <div className="flex flex-1 flex-col p-5">
                    <h3 className="font-display text-lg md:text-xl font-bold text-[#13181E] line-clamp-2 transition duration-300 group-hover:text-[#0D99FF]">
                      {post.title}
                    </h3>
                    <p className="mt-2 text-sm text-[#4B5154]">{formatDate(post.publishedAt)}</p>
                  </div>
                </Link>
              ))
              }
            </div>
          ) :
            <div className="pt-8 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              <h3 className="text-2xl font-medium font-display text-red-500">No blog posts found</h3>
            </div>
          }
        </div>
      </AnimatedSection>
    </section>
  )
}

export default Blogs
