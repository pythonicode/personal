import Image from "next/image";
import { PopIn } from "@/components/animations/pop-in";
import { WordsPullUp } from "@/components/animations/text/words-pull-up";
    
export default function Home() {
  return (
    <main>
      <section className="mx-auto max-w-screen-lg flex flex-col items-center justify-center py-20 px-4">
        <div className="flex flex-col items-center gap-4">
         <PopIn>
          <div className="relative w-32 h-32">
            <Image
              src="/images/hero.jpg"
              alt="Anthony Riley"
              fill
              objectFit="cover"
              className="rounded"
            />
            </div>
          </PopIn>
          <div className="flex flex-col text-center">
            <WordsPullUp text="Anthony Riley" className="text-4xl font-black mb-1" />
            <WordsPullUp text="Athlete • Developer • Entrepreneur" className="text-neutral-500" />
            
          </div>
        </div>
        <div>
          
        </div>
      </section>
    </main>
  )
}
