class GameObject {
    constructor(config){
        this.id = null;
        this.ismounted = false;
        this.x = config.x || 0;
        this.y = config.y || 0;
        this.direction = config.direction || "down"
        this.sprite = new Sprite({
            gameObject: this,
            src: config.src || "images/Actual Character (1).png",
        });

        this.behaviourloop = config.behaviourloop || [];
        this.behaviourloopindex = 0;

        this.talking = config.talking || [];

    }

    mount(map){
        console.log("mount");
        this.ismounted = true;
        map.addwall(this.x, this.y)

        //add delay if there is a behaviour

        setTimeout(() => {
            this.dobehaviourevent(map);
        }, 10)
    }

    update() {

    }

    // asynchronous code - will not happen until await is finished
    async dobehaviourevent(map) {

        //doesnt do anything if cutscene is playing
        if (map.iscutsceneplaying || this.behaviourloop.length === 0 || this.isstanding) {
            return;
        }

        //sets up event
        let eventconfig = this.behaviourloop[this.behaviourloopindex];
        eventconfig.who = this.id;

        //creates event
        const eventhandler = new OverworldEvent({map, event: eventconfig });
        await eventhandler.init();

        //sets up next event
        this.behaviourloopindex += 1;
        if (this.behaviourloopindex === this.behaviourloop.length) {
            this.behaviourloopindex = 0;
        }

        this.dobehaviourevent(map);
    }

}
