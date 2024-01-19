import { environment } from "../../environments/environment"


export class CoreServices {
    protected globalSettings = {
        backendUrl: '',
        player: null
    }
    constructor() {
        this.globalSettings.backendUrl = environment.domain;
    }

    
}