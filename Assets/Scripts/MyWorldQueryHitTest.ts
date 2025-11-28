import { InteractorTriggerType } from "SpectaclesInteractionKit.lspkg/Core/Interactor/Interactor"
import WorldCameraFinderProvider from "SpectaclesInteractionKit.lspkg/Providers/CameraProvider/WorldCameraFinderProvider"

// import required modules
const WorldQueryModule = require("LensStudio:WorldQueryModule")
const SIK = require("SpectaclesInteractionKit.lspkg/SIK").SIK
const EPSILON = 0.01
const MIN_DISTANCE_TO_FLOOR = 70;

@component
export class MyWorldQueryHitTest extends BaseScriptComponent {

    private primaryInteractor
    private hitTestSession: HitTestSession

    private camera = WorldCameraFinderProvider.getInstance()
    private rayStart: vec3
    public currentHitPosition: vec3
    public currentHitRotation: quat
    public currentHitRotationParrallelToGround: quat
    subscribers: MyWorldQueryHitSubscriberRegistration[] = []

    @input
    surfaceClassification = false

    @input
    filter = false
    @input
    printDebug = false

    printDebugInEditor(...data: any[]) {
        if (this.printDebug && global.deviceInfoSystem.isEditor)
            console.log(data)
    }

    onAwake() {
        // create update event
        this.createEvent("UpdateEvent").bind(this.onUpdate.bind(this))
    }

    isRegistered(registration: MyWorldQueryHitSubscriberRegistration): boolean {
        return this.subscribers.indexOf(registration) > -1

    }
    register(registration: MyWorldQueryHitSubscriberRegistration) {
        this.printDebugInEditor("WorldQuery Register", registration.subscriber.name)
        if (!this.isRegistered(registration)) {
            this.subscribers.push(registration)
        }
    }

    unregister(registration: MyWorldQueryHitSubscriberRegistration) {
        var index = this.subscribers.indexOf(registration)
        if (index > -1) {
            this.printDebugInEditor("WorldQuery Unregister", registration.subscriber.name)
            this.subscribers.splice(index, 1)
        }
    }

    private createHitTestSession() {
        // create hit test session with options
        this.printDebugInEditor("WorldQuery start")
        var options = HitTestSessionOptions.create()
        options.filter = this.filter
        this.hitTestSession = WorldQueryModule.createHitTestSessionWithOptions(options)
    }

    private stopHitTestSession() {
        this.printDebugInEditor("WorldQuery Stop")
        this.hitTestSession.stop()
        this.hitTestSession = null
    }

    onUpdate() {
        if (this.subscribers.length > 0 && this.hitTestSession == null) {
            this.createHitTestSession()
        }
        if (this.subscribers.length == 0 && this.hitTestSession != null) {
            this.stopHitTestSession()
            return
        }
        if (this.hitTestSession == null) {
            return
        }
        var needHand = this.subscribers.find((sub) => { return sub.handHit })
        if (needHand) {
            this.primaryInteractor = SIK.InteractionManager.getTargetingInteractors().shift()
            if (this.primaryInteractor &&
                this.primaryInteractor.isActive() &&
                this.primaryInteractor.isTargeting()
            ) {
                this.rayStart = new vec3(this.primaryInteractor.startPoint.x, this.primaryInteractor.startPoint.y, this.primaryInteractor.startPoint.z + 30)
                const rayEnd = this.primaryInteractor.endPoint
                this.hitTestSession.hitTest(this.rayStart, rayEnd, this.onHandHitTestResult.bind(this))
            }
            else {
                this.onHandHitTestResult(null)
            }
        }
        else {
            this.rayStart = this.camera.getWorldPosition()
            const rayEnd = this.camera.getForwardPosition(300, false)
            this.hitTestSession.hitTest(this.rayStart, rayEnd, this.onGazeHitTestResult.bind(this))
        }
    }

    onHitTestResultCore(results: WorldQueryHitTestResult, handHit: boolean) {
        var subs = this.subscribers.filter((sub, index, arr) => { return sub.handHit == handHit })
        if (results == null) {
            subs.forEach(sub => { sub.hitCallback(null) })
            return
        }

        var placeholderSubs = subs.filter((sub, index, arr) => { return sub.receivePlaceholder })
        var triggeredSubs = subs.filter((sub, index, arr) => { return sub.receiveTrigger })
        // get hit information
        const hitPosition: vec3 = results.position
        const hitNormal: vec3 = results.normal
        // identifying the direction the object should look at based on the normal of the hit location.

        // hit horizontal plane
        if (1 - Math.abs(hitNormal.normalize().dot(vec3.up())) < EPSILON &&
            this.rayStart.y - hitPosition.y > MIN_DISTANCE_TO_FLOOR
        ) {
            var placeholderSubsFloor = placeholderSubs.filter((sub, index, arr) => { return sub.surfaceType == MyWorldQueryHitSurfaceTypes.Floor })
            var triggeredSubsFloor = triggeredSubs.filter((sub, index, arr) => { return sub.surfaceType == MyWorldQueryHitSurfaceTypes.Floor })
            var lookDirection = this.camera.forward()
            var worldHitResult = new MyWorldQueryHitResult()
            worldHitResult.handHit = handHit
            worldHitResult.triggered = false
            worldHitResult.currentHitPosition = hitPosition
            worldHitResult.currentHitRotation = quat.lookAt(lookDirection, hitNormal)
            lookDirection.y = 0
            worldHitResult.currentHitRotationParrallelToGround = quat.lookAt(lookDirection, hitNormal)
            placeholderSubsFloor.forEach(sub => { sub.hitCallback(worldHitResult) })
            if (triggeredSubsFloor.length > 0)
                if (
                    this.primaryInteractor.previousTrigger !== InteractorTriggerType.None &&
                    this.primaryInteractor.currentTrigger === InteractorTriggerType.None
                ) {
                    this.printDebugInEditor("WorldQuery Triggered")
                    worldHitResult.triggered = true
                    triggeredSubsFloor.forEach(sub => { sub.hitCallback(worldHitResult) })
                }
        }
    }

    onGazeHitTestResult(results: WorldQueryHitTestResult) {
        this.onHitTestResultCore(results, false);
    }

    onHandHitTestResult(results: WorldQueryHitTestResult) {
        this.onHitTestResultCore(results, true);
    }
}


export enum MyWorldQueryHitSurfaceTypes {
    Floor,
    Ceiling,
    Wall
}

export class MyWorldQueryHitSubscriberRegistration {
    receivePlaceholder: boolean
    receiveTrigger: boolean
    handHit: boolean
    surfaceType: MyWorldQueryHitSurfaceTypes
    subscriber: SceneObject
    hitCallback: (results: MyWorldQueryHitResult) => void
    constructor(receivePlaceholder: boolean, receiveTrigger: boolean, handHit: boolean, subscriber: SceneObject, hitCallback: (results: MyWorldQueryHitResult) => void) {
        this.receivePlaceholder = receivePlaceholder
        this.receiveTrigger = receiveTrigger
        this.handHit = handHit
        this.subscriber = subscriber
        this.hitCallback = hitCallback
    }
}


export class MyWorldQueryHitResult {
    rawResults: MyWorldQueryHitResult
    handHit: boolean
    triggered: boolean
    currentHitPosition: vec3
    currentHitRotation: quat
    currentHitRotationParrallelToGround: quat
}

