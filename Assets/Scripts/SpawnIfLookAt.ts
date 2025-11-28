import { LSTween } from "LSTween.lspkg/LSTween"
import Easing from "LSTween.lspkg/TweenJS/Easing"
import { SpawnTransform } from "./SpawnerBase"
import WorldCameraFinderProvider from "SpectaclesInteractionKit.lspkg/Providers/CameraProvider/WorldCameraFinderProvider"
import { SpawnFromReference } from "./SpawnFromReference"

@component
export class SpawnIfLookAt extends SpawnFromReference {
    @input
    objectToLookAt: SceneObject
    @input
    spawnLookAtDuration: number = 3000
    @input
    unspawnLookAwayDuration: number = 3000

    firstSeen: number = 0
    lastSeen: number = 0
    camera = WorldCameraFinderProvider.getInstance();

    onStart(): void {
        this.hasSpawned = this.objectToSpawn.enabled
    }

    spawnTrigger(): boolean {
        var seen = this.camera.inFoV(this.objectToLookAt.getTransform().getWorldPosition())
        if (seen) {
            this.lastSeen = Date.now()
            if (!this.hasSpawned) {
                if (this.firstSeen == 0)
                    this.firstSeen = Date.now()
                if (this.lastSeen - this.firstSeen > this.spawnLookAtDuration)
                    return true
            } else {
                return false
            }
        }
        else {
            if (this.hasSpawned && Date.now() - this.lastSeen > this.unspawnLookAwayDuration) {
                this.unspawnObject()
                this.firstSeen = 0
                this.lastSeen = 0
            }
            return false
        }
    }

    spawnObjectActionWithTransition(tr: SpawnTransform, onComplete: () => void) {
        var objTr = this.getObjectToSpawn().getTransform()
        objTr.setWorldPosition(tr.position)
        objTr.setWorldRotation(tr.rotation)
        LSTween.scaleFromToLocal(objTr, vec3.zero(), vec3.one(), this.transitionDuration).easing(Easing.Elastic.Out)
            .onComplete(this.onSpawnComplete.bind(this))
            .start()
    }

    unspawnObject() {
        LSTween.scaleFromToLocal(this.getObjectToSpawn().getTransform(), vec3.one(), vec3.zero(), this.transitionDuration).easing(Easing.Elastic.In)
            .onComplete(this.onUnspawnComplete.bind(this))
            .start()

    }
}
