import { SpawnerBase, SpawnTransform } from "./SpawnerBase"

@component
export class SpawnFromReference extends SpawnerBase {
    @input
    referenceObject: SceneObject
    @input
    @hint("Relative to referenceObject position")
    changeDistance: boolean = true
    @input
    @showIf("changeDistance", true)
    distanceRange: vec2 = new vec2(100, 100)

    computeSpawnTransformation(): SpawnTransform {
        var thisPosition = this.getObjectToSpawn().getTransform().getWorldPosition()
        var thisRotation = this.getObjectToSpawn().getTransform().getWorldRotation()
        if (this.changeDistance) {

            var referenceObjectPosition = this.referenceObject.getTransform().getWorldPosition()
            var currentDistance = thisPosition.distance(referenceObjectPosition);
            var currentDir = thisPosition.sub(referenceObjectPosition)

            const distance =
                this.changeDistance
                    ? MathUtils.randomRange(this.distanceRange.x, this.distanceRange.y)
                    : currentDistance

            var respawnPosition = referenceObjectPosition.add(currentDir.normalize().uniformScale(distance))
            return new SpawnTransform(respawnPosition, thisRotation)
        }
        else {
            return new SpawnTransform(thisPosition, thisRotation)
        }
    }
}
