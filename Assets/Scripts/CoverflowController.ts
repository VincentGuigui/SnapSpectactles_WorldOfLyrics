import { LyricsReader } from './LyricsReader'
import { ToggleButton } from 'SpectaclesInteractionKit.lspkg/Components/UI/ToggleButton/ToggleButton';

@component
export class PlayMusic extends BaseScriptComponent {

  @input
  private LyricsReader: LyricsReader

  @input
  private MusicTitles: string[] = []

  @input
  private MusicCovers: Material[] = []

  @input
  private PlayMaterial: Material = undefined

  @input
  private PauseMaterial: Material = undefined

  @input PlayPauseImageButton: Image = undefined

  @input("Component.Image")
  private coverImage: Image | undefined

  @input("Component.Text")
  private coverTitle: Text | undefined

  @input("Asset.AudioTrackAsset")
  private _audioTrackAsset: AudioTrackAsset | undefined

  get audioTrackAsset(): AudioTrackAsset | undefined {
    return this._audioTrackAsset
  }
  set audioTrackAsset(track: AudioTrackAsset) {
    this._audioTrackAsset = track

    if (this._audioComponent !== undefined) {
      this._audioComponent.audioTrack = track
    }
  }

  private _audioComponent: AudioComponent | undefined

  private coverIndex = 1;


  onAwake() {
    this.createEvent('OnStartEvent').bind(() => {
      this.onStart();
    });
  }

  private isPlaying = false;
  onStart() {
    this._audioComponent = this.getSceneObject().createComponent("Component.AudioComponent") as AudioComponent
    this._audioComponent.playbackMode = Audio.PlaybackMode.LowLatency

    // This script assumes that a ToggleButton (and Interactable + Collider) component have already been instantiated on the SceneObject.
    var tg = ToggleButton.getTypeName()
    let toggleButton = this.sceneObject.getComponent(tg);

    let onStateChangedCallback = (state: boolean) => {

      this.updateCoverFlow();

      //toggleButton.onStateChanged.add(onStateChangedCallback);
    };
  }

  playPause() {
    if (this._audioComponent == undefined) return;
    if (!this.isPlaying) {
      this._audioComponent.audioTrack = this._audioTrackAsset
      this.PlayPauseImageButton.mainMaterial = this.PauseMaterial
      console.log("Play")
      this._audioComponent.play(1)
      this.LyricsReader.start()
      this.isPlaying = true;
    } else {
      console.log("Pause")
      this.PlayPauseImageButton.mainMaterial = this.PlayMaterial
      this._audioComponent.pause()
      this.LyricsReader.pause()
      this.isPlaying = false;
    }
  }

  updateCoverFlow() {
    console.log("coverIndex", this.coverIndex)
    this.coverTitle.text = this.MusicTitles[this.coverIndex];
    this.coverImage.mainMaterial = this.MusicCovers[this.coverIndex];
  }


  next() {
    console.log("next")
    this.coverIndex = this.coverIndex + 1;
    if (this.coverIndex > this.MusicTitles.length) {
      this.coverIndex = 0;
    }
    this.updateCoverFlow();
  }

  previous() {
    this.coverIndex = this.coverIndex - 1;
    if (this.coverIndex < 0) {
      this.coverIndex = this.MusicTitles.length - 1;
    }
    this.updateCoverFlow();

  }
}
