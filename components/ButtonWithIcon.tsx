interface ButtonWithIconProps {
  pClass?: string;
  text1?: string;
  text2?: string;
}

const ButtonWithIcon = ({
  pClass = "",
  text1 = "Button",
  text2 = "Button",
}: ButtonWithIconProps) => {
  return (
    <button
      className={`cursor-pointer relative group ${pClass}`}
    >
      <div className="
       relative inline-flex w-fit items-center pb-0.5 gap-2
              text-base font-semibold text-[#13181E]
              overflow-hidden
            
              before:content-[''] before:absolute before:left-0 before:bottom-0 before:block before:-translate-x-full
              before:h-[2px] before:w-full before:bg-[#13181E] before:origin-left
              before:transition-[translate] before:duration-900 before:ease-out

            
              after:content-[''] after:absolute after:left-0 after:bottom-0 after:block
              after:h-[2px] after:w-full after:bg-[#13181E] after:origin-right
              after:transition-[translate] after:duration-500 after:ease-out 

              group-hover:before:translate-x-0 group-hover:after:translate-x-full
      ">
        <div className="relative overflow-hidden">
          <p
            className="group-hover:-translate-y-7 duration-[1.125s] ease-[cubic-bezier(0.19,1,0.22,1)]"
          >
            {text1}
          </p>
          <p
            className="absolute top-7 left-0 group-hover:top-0 duration-[1.125s] ease-[cubic-bezier(0.19,1,0.22,1)]"
          >
            {text2}
          </p>
        </div>

        <svg width="13" height="13" viewBox="0 0 13 13" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M10.7525 3.97035L2.0955 12.6274L0.673004 11.2049L9.33004 2.54786H1.69981V0.536133H12.7643V11.6006H10.7525V3.97035Z" fill="#13181E" />
        </svg>
      </div>
    </button>
  )
}

export default ButtonWithIcon