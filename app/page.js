import Image from "next/image";
import Link from "next/link";

export default function Home() {

  return (
    <>
    <div className="flex flex-col gap-4 justify-center items-center text-white min-h-[44vh] px-2 sm:px-4 py-8 md:py-12">
      <div className="font-bold text-2xl xs:text-3xl md:text-4xl lg:text-5xl flex flex-wrap items-center gap-2 justify-center text-center">
        <span className="whitespace-nowrap">Buy Me a Chai</span> <span><img className="invertImg w-[50px] xs:w-[60px] md:w-[88px]" src="/tea.gif" alt="" /></span>
      </div>
      <p className="text-center text-xs xs:text-sm md:text-base">A crowdfunding platform for creators to fund their projects.</p>
      <p className="text-center text-xs xs:text-sm md:text-base max-w-2xl">A place where your fans can buy you a chai. Unleash the power of your fans and get your projects funded.</p>
      <div className="flex flex-wrap justify-center gap-2">
        <Link href="/login" className="text-white bg-gradient-to-br from-purple-600 to-blue-500 hover:bg-gradient-to-bl focus:ring-4 focus:outline-none focus:ring-blue-300 dark:focus:ring-blue-800 font-medium rounded-lg text-xs xs:text-sm px-4 xs:px-5 py-2 xs:py-2.5 text-center">
          Start Here
        </Link>
        <Link href="/about" className="text-white bg-gradient-to-br from-purple-600 to-blue-500 hover:bg-gradient-to-bl focus:ring-4 focus:outline-none focus:ring-blue-300 dark:focus:ring-blue-800 font-medium rounded-lg text-xs xs:text-sm px-4 xs:px-5 py-2 xs:py-2.5 text-center">
          Read More
        </Link>
      </div>
    </div>

    <div className="bg-white h-1 opacity-10"></div>

    <div className="text-white container mx-auto my-10 md:my-20 flex flex-col gap-8 md:gap-16 px-2 sm:px-4">
      <h2 className="text-xl xs:text-2xl md:text-3xl font-bold text-center my-4">Your fans can buy you a chai</h2>
      <div className="flex flex-col md:flex-row gap-8 md:gap-5 justify-evenly">
        <div className="item space-y-3 text-center flex flex-col items-center justify-center">
          <img className="bg-slate-400 rounded-full p-2" width={70} height={70} src="/man.gif" alt="" />
          <p className="text-white font-bold">Fans want to help</p>
          <p className="text-xs xs:text-sm md:text-base">Your fans are available to support you</p>
        </div>
        <div className="item space-y-3 text-center flex flex-col items-center justify-center">
          <img className="bg-slate-400 rounded-full p-2" width={70} height={70} src="/coin.gif" alt="" />
          <p className="text-white font-bold">Fans want to contribute</p>
          <p className="text-xs xs:text-sm md:text-base">Your fans are willing to contribute financially</p>
        </div>
        <div className="item space-y-3 text-center flex flex-col items-center justify-center">
          <img className="bg-slate-400 rounded-full p-2" width={70} height={70} src="/group.gif" alt="" />
          <p className="text-white font-bold">Fans want to collaborate</p>
          <p className="text-xs xs:text-sm md:text-base">Your fans are ready to collaborate with you</p>
        </div>
      </div>
    </div>

    <div className="bg-white h-1 opacity-10"></div>

    <div className="text-white container mx-auto my-10 md:my-20 flex flex-col items-center justify-center gap-8 md:gap-16 px-2 sm:px-4">
      <h2 className="text-xl xs:text-2xl md:text-3xl font-bold text-center my-4">Learn more about us</h2>
      <div className="w-full max-w-[700px] aspect-video">
        <iframe 
          className="w-full h-full"
          src="https://www.youtube.com/embed/QtaorVNAwbI?si=QA8MU8hibu__r_H-" 
          title="YouTube video player" 
          frameBorder="0" 
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" 
          referrerPolicy="strict-origin-when-cross-origin" 
          allowFullScreen
        ></iframe>
      </div>
    </div>
    </>
  );
}
