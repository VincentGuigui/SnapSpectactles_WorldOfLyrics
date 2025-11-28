import { LyricsSubscriber } from "./LyricsSubscriber"
import { PlaceOnTheFloorIfTrigger } from "./PlaceOnTheFloorIfTrigger"

@component
export class PlaceDanceSteps extends PlaceOnTheFloorIfTrigger {
    @input
    @allowUndefined
    toNotify: LyricsSubscriber

    afterPlacement() {
        this.toNotify.setEnable(true)
    }
}
 