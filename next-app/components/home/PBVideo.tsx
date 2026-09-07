const pbThumbnail = "/img/home/pbVthumbnail.webp";
const PBVideo = () => {
  return (
    <section className="pt-10">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 pb-14 sm:pb-20 lg:pb-24 pt-10">
        <div className="grid overflow-hidden rounded-xl">

          <img
            src={pbThumbnail}
            alt="PushBundle"
            className="col-start-1 row-start-1 w-full h-full object-cover"
          />

          <div
            className="col-start-1 row-start-1 place-self-center z-10
               px-7 py-3 text-2xl font-display font-bold w-[145px] h-[145px] flex items-center justify-center
               bg-white rounded-full shadow-2xl cursor-pointer"
          >
            Play
          </div>
        </div>

      </div>

    </section>
  )
}

export default PBVideo
