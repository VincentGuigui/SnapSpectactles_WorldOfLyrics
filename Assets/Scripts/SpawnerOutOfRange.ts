import { SpawnerBase } from "./SpawnerBase"
import { SpawnFromReference } from "./SpawnFromReference";

@component
export class SpawnerOutOfRange extends SpawnFromReference {
    @input
    @hint("Specifies this distance (in cm) to trigger the respawn")
    distanceThreshold: number = 200

    spawnTrigger() {
        var thisPosition = this.objectToSpawn.getTransform().getWorldPosition()
        var referenceObjectPosition = this.referenceObject.getTransform().getWorldPosition()
        var currentDistance = thisPosition.distance(referenceObjectPosition)
        //this.printDebugInEditor("Distance Trigger", currentDistance, ">", this.distanceThreshold)
        if (currentDistance > this.distanceThreshold) {
            return true
        }
        return false
    }
}
