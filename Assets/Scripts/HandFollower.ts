import { VectorUtils } from "./VectorUtils";
import { HandInputData } from "SpectaclesInteractionKit.lspkg/Providers/HandInputData/HandInputData";
import { HandType } from "SpectaclesInteractionKit.lspkg/Providers/HandInputData/HandType";
import { LandmarkName } from "SpectaclesInteractionKit.lspkg/Providers/HandInputData/LandmarkNames";
import TrackedHand from "SpectaclesInteractionKit.lspkg/Providers/HandInputData/TrackedHand"
import WorldCameraFinderProvider from "SpectaclesInteractionKit.lspkg/Providers/CameraProvider/WorldCameraFinderProvider"

const HandTypeBoth: string = "both"
const HandTypeLeft: string = "left"
const HandTypeRight: string = "right"

@component
export class HandFollower extends BaseScriptComponent {
    @input private handFollowObject: SceneObject;
    @input private distanceToHand: number = 10
    @input maxHandAngle: number = 30;
    @input("string")
    @widget(
        new ComboBoxWidget([
            new ComboBoxItem("Both", "both"),
            new ComboBoxItem("Left", "left"),
            new ComboBoxItem("Right", "right")
        ])
    )
    handTypes: string = "both"

    @input("string")
    @widget(
        new ComboBoxWidget([
            new ComboBoxItem("palmCenter", "palmCenter"),
            new ComboBoxItem("indexKnuckle"),
            new ComboBoxItem("indexMidJoint"),
            new ComboBoxItem("indexUpperJoint"),
            new ComboBoxItem("indexTip"),
            new ComboBoxItem("middleKnuckle"),
            new ComboBoxItem("middleMidJoint"),
            new ComboBoxItem("middleUpperJoint"),
            new ComboBoxItem("middleTip"),
            new ComboBoxItem("ringKnuckle"),
            new ComboBoxItem("ringMidJoint"),
            new ComboBoxItem("ringUpperJoint"),
            new ComboBoxItem("ringTip"),
            new ComboBoxItem("pinkyKnuckle"),
            new ComboBoxItem("pinkyMidJoint"),
            new ComboBoxItem("pinkyUpperJoint"),
            new ComboBoxItem("pinkyTip"),
            new ComboBoxItem("thumbBaseJoint"),
            new ComboBoxItem("thumbDistal"),
            new ComboBoxItem("thumbMidJoint"),
            new ComboBoxItem("thumbTip"),
            new ComboBoxItem("wrist"),
            new ComboBoxItem("thumbToWrist"),
            new ComboBoxItem("indexToWrist"),
            new ComboBoxItem("middleToWrist"),
            new ComboBoxItem("ringToWrist"),
            new ComboBoxItem("pinkyToWrist"),
        ])
    )
    trackedLandmark: string = "palmCenter"
    
    @input viewInEditor: boolean = false

    private handProvider: HandInputData = HandInputData.getInstance()
    private leftHand = this.handProvider.getHand("left" as HandType);
    private rightHand = this.handProvider.getHand("right" as HandType);
    private camera = WorldCameraFinderProvider.getInstance();
    private noTrackCount = 0;

    onAwake() {
        this.createEvent("UpdateEvent").bind(() => {
            this.update();
        })
        this.handFollowObject.enabled = false;
        if (global.deviceInfoSystem.isEditor()) {
            const delayedEvent = this.createEvent("DelayedCallbackEvent");
            delayedEvent.bind(() => {
                this.handFollowObject.enabled = true;
            });
            delayedEvent.reset(5);
        }
    }

    update() {
        if (global.deviceInfoSystem.isEditor() && !this.viewInEditor) return;
        if (this.tryShowHandMenu(this.leftHand) || this.tryShowHandMenu(this.rightHand)) {
            this.handFollowObject.enabled = true;
            this.noTrackCount = 0;
        }
        else {
            this.noTrackCount++;
            if (this.noTrackCount > 10) {
                this.handFollowObject.enabled = false;
            }
        }
    }

    private getLandmarkPosition(hand: TrackedHand) {
        if (this.trackedLandmark == "palmCenter")
            return hand.getPalmCenter()
        return hand[this.trackedLandmark].position;
    }


    private tryShowHandMenu(hand: TrackedHand): boolean {
        if (this.handTypes == HandTypeBoth || this.handTypes == hand.handType) {
            if (!hand.isTracked()) {
                return false;
            }
            const pinkyKnucklePosition = hand.pinkyKnuckle.position;
            if (pinkyKnucklePosition != null) {

                const knuckleForward = hand.indexKnuckle.forward;
                const cameraForward = this.camera.getTransform().forward;
                const angle = Math.acos(knuckleForward.dot(cameraForward) / (knuckleForward.length * cameraForward.length)) * 180.0 / Math.PI;
                if (Math.abs(angle) > this.maxHandAngle) {
                    return false;
                }
                var directionNextToKnuckle = hand.handType == "left" ? hand.indexKnuckle.right :
                    hand.indexKnuckle.right.mult(VectorUtils.scalar3(-1));

                this.handFollowObject.getTransform().setWorldRotation(hand.indexKnuckle.rotation);
                //this.handFollowObject.getTransform().setWorldPosition(
                //    pinkyKnucklePosition.add(directionNextToKnuckle.mult(VectorUtils.scalar3(this.distanceToHand))));
                this.handFollowObject.getTransform().setWorldPosition(
                    this.getLandmarkPosition(hand).add(directionNextToKnuckle.mult(VectorUtils.scalar3(this.distanceToHand))));
                return true;
            }
        }
        return false;
    }
}
