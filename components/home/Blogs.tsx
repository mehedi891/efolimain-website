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
                <Link key={post.id} href={`/blog/${post.slug}`}>
                  <article className="flex flex-col gap-2 group">
                    {post.cover ? (
                      <div className="relative max-h-[300px] mb-3 h-[240px] md:h-[300px] w-full">
                        <Image src={post.cover} alt={post.coverAlt} fill sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 33vw" className="object-cover rounded-2xl
              transition ease-initial duration-600
              group-hover:scale-105
              group-hover:drop-shadow-2xl
              " />
                      </div>
                    ) : (
                      <div className="max-h-[300px] mb-3 h-[240px] md:h-[300px] w-full rounded-2xl bg-[#F1F5F9]" />
                    )}
                    <h3 className="font-display text-lg md:text-2xl font-bold text-[#13181E] line-clamp-2
                transition ease-initial duration-600 group-hover:text-[#0D99FF]
              ">{post.title}</h3>
                    <p className="text-base text-[#4B5154]">── {formatDate(post.publishedAt)}</p>
                  </article>
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
