import { TrainingVolumeCalendarAsync } from "@/components/ui/custom/training-volume-calendar/training-volume-calendar-async";
import { OrienteeringSessionsCalendarAsync } from "@/components/ui/custom/orienteering-sessions-calendar/orienteering-sessions-calendar-async";
import { EffectiveVolumeCalendarAsync } from "@/components/ui/custom/effective-volume-calendar/effective-volume-calendar-async";

export default function TrainingPage() {
  return (
    <main className="max-w-screen-md mx-auto px-4 py-16">
      <h1 className="text-3xl md:text-4xl font-bold text-foreground mb-4 text-center">Training</h1>
      <section className="my-8">
        <TrainingVolumeCalendarAsync />
      </section>
      <section className="my-8">
        <OrienteeringSessionsCalendarAsync targetSessions={2} />
      </section>
      <section className="my-8">
        <EffectiveVolumeCalendarAsync />
      </section>
    </main>
  )
}