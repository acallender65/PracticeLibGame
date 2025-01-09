class Overworld {
    constructor(config) {
        this.element = config.element;
        this.canvas = this.element.querySelector(".gamecanvas");
        this.ctx = this.canvas.getContext("2d");
    }

    startgameloop() {
        const step = () => {
            //Clear off the canvas
            this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height)

            //focus person
            const focusperson = this.map.gameObjects.mc;

            //update objects - optimise this !!
            Object.values(this.map.gameObjects).forEach(object => {
                object.update({
                    arrow: this.directioninput.direction,
                    map: this.map,
                });
            })

            //draw lower layer
            this.map.drawLowerImage(this.ctx, focusperson);

            //draw game objects
            Object.values(this.map.gameObjects).sort((a, b) => {
                return a.y - b.y;
            }).forEach(object => {
                object.sprite.draw(this.ctx, focusperson);
            })

            //draw upper layer
            this.map.drawUpperImage(this.ctx, focusperson);

            if (!this.map.ispaused) {
                requestAnimationFrame (() => {
                    step();
                })
            }

        }
        step();
    }

    bindactioninput() {
        new keypresslistener("Enter", () => {
            //check for person here
            this.map.checkforactioncutscene();
        })

        new keypresslistener("Escape", () => {
            if (!this.map.cutsceneplaying) {
                this.map.startcutscene([
                    {type: "pause"},
                ])
            }
        })
    }

    bindheropositioncheck() {
        document.addEventListener("personwalkingcomplete", e => {
            if (e.detail.whoid === "mc") {
                //hero position has changed
                this.map.checkforfootstepcutscene(); //triggered by walking
            }
        })
    }

    startmap (mapconfig) {
        this.map = new OverworldMap(mapconfig);
        this.map.overworld = this;
        this.map.mountobjects();
    }

    init() {
        this.startmap(window.OverworldMaps.FFLib);

        this.bindactioninput();
        this.bindheropositioncheck();

        this.directioninput = new directioninput(); 
        this.directioninput.init();

        this.startgameloop();

        //this.map.startcutscene([
        //    {type: "textmessage", text: "Hello world"},
        //])
            
        }

}