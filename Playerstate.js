//configure cutscenes properly

class playerstate{
    constructor(){
        this.storyflags = { //use to progress story
            //"eventhappened": true,
            //"minigamecompleted": true,
            spoketonpc2: true
        };
    }
}

window.playerstate = new playerstate();