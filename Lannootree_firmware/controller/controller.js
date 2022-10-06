import Color from './color.js';

export default class Controller {

    pause = false;
    preprocessed= null;
    effect = null;
    ledmatrix = Array.from(Array(10), () => new Array(10));

    constructor() {
    }

    async _main() {
        while(!this.pause) {
            if(this.preprocessed != null) this.play_preprocessed(this.preprocessed)
            if(this.effect != null) this.play_effect(this.effect)

            // Debugging
            for(var i = 0; i < this.ledmatrix.length; i++) {
                for(var j = 0; j < this.ledmatrix[i].length; j++) {
                    console.log(this.ledmatrix[i][j]);
                }
            }

        }
    }

    set_matrixsize(width, height) {
        this.stop()
        this.ledmatrix = Array.from(Array(height), () => new Array(width));
    }

    stop(){
        this.effect=null;
        this.preprocessed=null;
        const off = new Color(0,0,0);
        for(var i = 0; i < this.ledmatrix.length; i++) {
            for(var j = 0; j < this.ledmatrix[i].length; j++) {
                this.ledmatrix[i][j] = off;
            }
        }
    }
    
    pause(){
        this.pause = !this.pause;
    }
    
    get_preprocessed(){
    
    }

    set_preprocessed(preprocessed_id){
        this.preprocessed = preprocessed_id
    }

    play_preprocessed(){
    
    }

    set_color(red, green, blue) {

    }
    
    set_effect(effect_id){
        this.effect = effect_id;
    }
    
    index = 0;
    play_effect(){
        if(this.effect == "eff1") {


        }
    
    }

    get_client_json(){
        return [ 
            { eff_id: "eff_1", eff_name: ""},
            { eff_id: "eff_2", eff_name: ""},
            { eff_id: "eff_3", eff_name: ""}
        ]
    }
    
}