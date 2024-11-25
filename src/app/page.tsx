import Image from "next/image";
import { PopIn } from "@/components/animations/pop-in";
import { WordsPullUp } from "@/components/animations/text/words-pull-up";
import TextGradientScroll from "@/components/animations/text/text-scroll";
import { Blockquote, BlockquoteAuthor } from "@/components/ui/blockquote";
import { Wiggle } from "@/components/animations/wiggle";
    
export default function Home() {
  return (
    <main>
      <section className="mx-auto max-w-screen-lg flex flex-col items-center justify-center py-20 px-4">
        <div className="flex flex-col items-center gap-4">
          <Wiggle>
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
          </Wiggle>
          <div className="flex flex-col text-center">
            <WordsPullUp text="Anthony Riley" className="text-4xl font-black mb-1" />
            <WordsPullUp text="Athlete • Developer • Entrepreneur" className="text-neutral-500" />
            <PopIn>
              <Blockquote className="max-w-xl mx-auto text-sm my-8">
                When joining startups I noticed that the pace of development would churn out major amount of technical debt and spaghetti code, I was surprised to find this problem exacerbated and not nullified in larger software companies.
                <BlockquoteAuthor>Anthony Riley</BlockquoteAuthor>
              </Blockquote>
            </PopIn>
             <TextGradientScroll className="max-w-prose leading-4 mb-96" text="&#9;&#9;&#9;&#9;Welcome to my website! I am a fullstack software engineer and manager with a passion for creating intuitive and beautiful experiences for users on web and mobile. Here I like to share my interests in health, endurance, music and technology. I also use this site as a store of memory for what I've said, read, seen or done, as well as an experimentation ground for new technology, unique design and interesting findings."/>
          </div>
        </div>
        <div>
          
        </div>
      </section>
    </main>
  )
}
