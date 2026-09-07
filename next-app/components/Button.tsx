interface ButtonProps {
  pClass?: string;
  text1?: string;
  text2?: string;
  disabled?: boolean;
}

/**
 * The site's signature two-line "roll up" button. Presentational only (no
 * hooks), so it works in both Server and Client component trees.
 */
export default function Button({
  pClass = "",
  text1 = "Button",
  text2 = "Button",
  disabled = false,
}: ButtonProps) {
  return (
    <button disabled={disabled} className={`cursor-pointer relative group ${pClass}`}>
      <div className="relative overflow-hidden">
        <p className="group-hover:-translate-y-7 duration-[1.125s] ease-[cubic-bezier(0.19,1,0.22,1)]">
          {text1}
        </p>
        <p className="absolute top-7 left-0 group-hover:top-0 duration-[1.125s] ease-[cubic-bezier(0.19,1,0.22,1)]">
          {text2}
        </p>
      </div>
    </button>
  );
}
