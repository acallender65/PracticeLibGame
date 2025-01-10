class OverworldMap {
    constructor(config){

        this.overworld = null;
        this.gameObjects = config.gameObjects;
        this.cutscenespaces = config.cutscenespaces || {};
        this.walls = config.walls || {};

        this.lowerimage = new Image();
        this.lowerimage.src = config.lowersrc;

        this.upperimage = new Image();
        this.upperimage.src = config.uppersrc;

        this.cutsceneplaying = false;
        this.ispaused = false;
    }

    drawLowerImage(ctx, focusperson) {
        ctx.drawImage(this.lowerimage, utils.withGrid(14.5) - focusperson.x,  utils.withGrid(7) - focusperson.y)
    }

    drawUpperImage(ctx, focusperson) {
        ctx.drawImage(this.upperimage, utils.withGrid(14.5) - focusperson.x,  utils.withGrid(7) - focusperson.y)
    }

    isspacetaken(currentx, currenty, direction){
        const {x,y} = utils.nextposition(currentx, currenty, direction);
        //console.log(currentx, currenty);
        return this.walls[`${x},${y}`] || false;
    }

    mountobjects() {
        Object.keys(this.gameObjects).forEach(key => {

            let object = this.gameObjects[key];
            object.id = key;

            //xhnage this - items to pick up, has action happened

            object.mount(this);
        })
    }

    async startcutscene(events) {
        this.cutsceneplaying = true;

        //starts loop of async events
        for (let i=0; i<events.length; i++) {
            const eventhandler = new OverworldEvent({
                map: this,
                event: events[i]
            })

            //awaits each event
            await eventhandler.init();
        }

        this.cutsceneplaying = false;

        //reset npcs to do their behaviour
        Object.values(this.gameObjects).forEach(object => object.dobehaviourevent(this))
    }

    checkforactioncutscene() {
        const focusperson = this.gameObjects["mc"];
        const nextcoords = utils.nextposition(focusperson.x, focusperson.y, focusperson.direction);
        const match = Object.values(this.gameObjects).find(object => {
            return `${object.x},${object.y}` === `${nextcoords.x},${nextcoords.y}`
        });
        console.log({match});
        if (!this.cutsceneplaying && match && match.talking.length) {

            const revelantscenario = match.talking.find(scenario => {
                return (scenario.required || []).every(sf => {
                    return playerstate.storyflags[sf]
                })
            })
            revelantscenario && this.startcutscene(revelantscenario.events) 
        }
    }

    checkforfootstepcutscene() {
        const focusperson = this.gameObjects["mc"];
        const match = this.cutscenespaces[`${focusperson.x},${focusperson.y}`];
        if (!this.cutsceneplaying && match) {
          this.startcutscene(match[0].events) //remove the 0
        }
    }

    addwall(x,y) {
        this.walls[`${x},${y}`] = true;
    }

    removewall(x, y) {
        delete this.walls[`${x},${y}`];
    }

    movewall(wasx, wasy, direction) {
        this.removewall(wasx, wasy);
        const {x, y} = utils.nextposition(wasx, wasy, direction);
        this.addwall(x, y);
    }
}


window.OverworldMaps = {
    FFLib: {
        id: "SFLib",
        lowersrc: "images/Finishedbackgrounds-1.png.png",
        uppersrc: "images/Actual Character.png", //replece this with cut out of top wall
        gameObjects: {
            mc: new person({
                isPlayerControlled: true,
                x: utils.withGrid(-1),
                y: utils.withGrid(3),
            }),
            npc1: new person({ 
                isPlayerControlled: false,
                x: utils.withGrid(3),
                y: utils.withGrid(3),
                src: "images/Actual Character (1).png",//change this design
                behaviourloop: [ //not event based - will repeat and loop
                    {type: "stand", direction: "left", time: 800},
                    {type: "stand", direction: "up", time: 800},
                    {type: "stand", direction: "right",  time: 1200},
                    {type: "stand", direction: "up", time: 300},

                ],
                talking: [
                    {
                        events: [
                            {type: "textmessage", text: "*says something in one part of the game*", facemc: "npc1"},
                            {who: "mc", type: "walk", direction: "left"} //makes mc move during this event 
                        ]
                    },
                    {
                        required: ["spoketonpc2"],
                        events: [
                           {type: "textmessage", text: "you've spoken to the circle path npc before me "},
                        ]
                    }
                ]
            }),
            npc2: new person({ 
                isPlayerControlled: false,
                x: utils.withGrid(6),
                y: utils.withGrid(6),
                src: "images/Actual Character (1).png",//change this design
                behaviourloop: [ //not event based - will repeat and loop
                    {type: "walk", direction: "right"},
                    {type: "stand", direction: "up", time: 800},
                    {type: "walk", direction: "up"},
                    {type: "walk", direction: "left"},
                    {type: "walk", direction: "down"}
                ],
                talking: [
                    {
                        events: [
                            {type: "textmessage", text: "hello there", facemc: "npc2"},
                            {who: "mc", type: "walk", direction: "right"}, //makes mc move during this event 
                            {type: "addstoryflag", flag: "spoketonpc2"} //we can set this to happen if the player completes a mingame 13930
                        ]
                    },
                ]
            })
            //put npcs here
        },
        walls: {
            [utils.asGridCoords(1, 0)]: true, //dynamic key
            [utils.asGridCoords(0, 0)]: true,
            [utils.asGridCoords(0, 0)]: true,
            [utils.asGridCoords(0, 0)]: true
            //put walls here
        },
        cutscenespaces: {
            [utils.asGridCoords(16, 4)]: [
                {
                    events: [
                        {who: "npc2", type: "textmessage", text: "this is a bookshelf"},
                        {type: "textmessage", text: "idk stuff", facemc: "npc2"},
                        {who: "mc", type: "walk", direction: "right"},
                        {who: "mc", type: "walk", direction: "right"},
                        {who: "mc", type: "walk", direction: "right"},
                    ]
                }
            ],
            [utils.asGridCoords(30, 3)]: [
                {
                    events: [
                        {type: "changemap", map: "SFLib"},
                    ]
                }
            ]
        }
    },

    SFLib: {
        id: "SFLib",
        lowersrc: "images/Finishedbackgrounds-2.png.png",
        uppersrc: "images/Actual Character.png", //replece this with cut out of top wall
        gameObjects: {
            mc: new person({
                isPlayerControlled: true,
                x: utils.withGrid(-1),
                y: utils.withGrid(3),
            }),
            npc3: new person({ 
                isPlayerControlled: false,
                x: utils.withGrid(7),
                y: utils.withGrid(5),
                src: "/images/Actual Character (1).png",//change this design
                behaviourloop: [ //not event based - will repeat and loop
                    {type: "stand", direction: "left", time: 800},
                    {type: "stand", direction: "up", time: 800},
                    {type: "stand", direction: "right",  time: 1200},
                    {type: "stand", direction: "up", time: 300},

                ],
                talking: [
                    {
                        events: [
                            {type: "textmessage", text: "welcome to the secodn floor", facemc: "npc3"},
                            {who: "mc", type: "walk", direction: "left"} //makes mc move during this event 
                        ]
                    },
                    //{
                       // events: [
                        //    {type: "textmessage", text: "*says something in another part of the game*"},
                        //]
                   // }
                ]
            }),
            npc4: new person({ 
                isPlayerControlled: false,
                x: utils.withGrid(9),
                y: utils.withGrid(7),
                src: "/images/Actual Character (1).png",//change this design
                behaviourloop: [ //not event based - will repeat and loop
                    {type: "walk", direction: "right"},
                    {type: "stand", direction: "up", time: 800},
                    {type: "walk", direction: "up"},
                    {type: "walk", direction: "left"},
                    {type: "walk", direction: "down"}
                ],
                talking: [
                    {
                        events: [
                            {type: "textmessage", text: "congrats on making it here", facemc: "npc4"},
                            {who: "mc", type: "walk", direction: "right"} //makes mc move during this event 
                        ]
                    },
                ]
            })
            //put npcs here
        },
        walls: {
            [utils.asGridCoords(1, 0)]: true, //dynamic key
            [utils.asGridCoords(0, 0)]: true,
            [utils.asGridCoords(0, 0)]: true,
            [utils.asGridCoords(0, 0)]: true
            //put walls here
        },
        cutscenespaces: {
            [utils.asGridCoords(0, 3)]: [
                {
                    events: [
                        {who: "npc3", type: "textmessage", text: "just empty space in here...", facemc: "npc3"},
                        {type: "textmessage", text: ".... for now ... ", facemc: "npc3"},
                        {who: "mc", type: "walk", direction: "right"},
                        {who: "mc", type: "walk", direction: "right"},
                        {who: "mc", type: "walk", direction: "right"},
                    ]
                }
            ]
        }
    }


    //put another map - like SFLib and bedroom
}
