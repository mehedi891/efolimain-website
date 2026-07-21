/**
 * Author avatar. The CMS returns `avatarUrl: null` for most authors, so fall
 * back to an initials badge in the brand blue rather than a broken image.
 */
const initialsOf = (name = "") =>
  name
    .trim()
    .split(/\s+/)
    .slice(0, 2)
    .map((w) => w[0])
    .join("")
    .toUpperCase() || "E";

const Avatar = ({ author, className = "h-9 w-9", textClass = "text-xs" }) => {
  if (author?.avatar) {
    return (
      <img
        src={author.avatar}
        alt={author.name}
        loading="lazy"
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
