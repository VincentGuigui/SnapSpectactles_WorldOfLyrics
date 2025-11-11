import { Song } from "./Song"

@component
export class Songs extends BaseScriptComponent {
    @input
    Songs: Song[]
}