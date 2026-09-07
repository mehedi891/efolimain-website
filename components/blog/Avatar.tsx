/**
 * Author avatar. The CMS returns `avatarUrl: null` for most authors, so fall
 * back to an initials badge in the brand blue rather than a broken image.
 */
import Image from "next/image";
import type { Author } from "@/data/cms-types";

const initialsOf = (name: string = ""): string =>
  name
    .trim()
    .split(/\s+/)
    .slice(0, 2)
    .map((w) => w[0])
    .join("")
    .toUpperCase() || "E";

interface AvatarProps {
  author?: Author | null;
  className?: string;
  textClass?: string;
}

const Avatar = ({
  author,
  className = "h-9 w-9",
  textClass = "text-xs",
}: AvatarProps) => {
  if (author?.avatar) {
    return (
      <Image
        src={author.avatar}
        alt={author.name}
        width={64}
        height={64}
        className={`${className} shrink-0 rounded-full object-cover`}
      />
    );
  }

  return (
    <span
      aria-hidden="true"
      title={author?.name}
      className={`${className} ${textClass} grid shrink-0 place-items-center rounded-full bg-gradient-to-br from-[#0D99FF] to-[#7dd3fc] font-display font-bold text-white`}
    >
      {initialsOf(author?.name)}
    </span>
  );
};

export default Avatar;
