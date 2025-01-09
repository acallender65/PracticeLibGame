class OverworldEvent {
    constructor ({map, event}) {
        this.map = map;
        this.event = event;
    }

    stand(resolve) {
        const who = this.map.gameObjects[this.event.who];
        who.startBehaviour(
            { map: this.map}, 
            {type: "stand", direction: this.event.direction, time: this.event.time
        });

        const completehandler = e => {
            if (e.detail.whoid === this.event.who) {
                document.removeEventListener("personstandingcomplete", completehandler);
                resolve();
            }
        }
        document.addEventListener("personstandingcomplete", completehandler);
    }

    walk(resolve) {
        const who = this.map.gameObjects[this.event.who];
        who.startBehaviour(
            { map: this.map}, 
            {type: "walk", 
             direction: this.event.direction, 
             retry: true
        });

        const completehandler = e => {
            if (e.detail.whoid === this.event.who) {
                document.removeEventListener("personwalkingcomplete", completehandler);
                resolve();
            }
        }
        document.addEventListener("personwalkingcomplete", completehandler);

    }

    textmessage(resolve){

        if (this.event.facemc) {
            const obj = this.map.gameObjects[this.event.facemc];
            obj.direction = utils.oppositedirection(this.map.gameObjects["mc"].direction);
        }

        const message = new textmessage({
            text: this.event.text,
            oncomplete: () => resolve()
        });

        message.init(document.querySelector(".gamecontainer"));
    }

    changemap(resolve) {
        const scenetransition = new SceneTransition();
        scenetransition.init(document.querySelector(".gamecontainer"), () => {
            this.map.overworld.startmap(window.OverworldMaps[this.event.map]);
            resolve();
            scenetransition.fadeout();
        })

    }

    pause(resolve) {
        this.map.ispaused = true;
        const menu = new pausemenu({
            //progress: this.map.overworld.progress,
            oncomplete: () => {
                resolve();
                this.map.ispaused = false;
                this.map.overworld.startgameloop();
            }
        });

        menu.init(document.querySelector(".gamecontainer"));
    }

    addstoryflag (resolve){
        window.playerState.storyflags[this.event.flag] = true;
        resolve();
    }   

    init() {
        return new Promise(resolve => {
            this[this.event.type](resolve)
        })
    }
}