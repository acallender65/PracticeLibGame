class person extends GameObject {
    constructor(config) {
        super(config);
        this.movingProgressRemaining = 0;
        this.isstanding = false;

        this.isPlayerControlled = config.isPlayerControlled || false;
        
        this.directionUpdate = {
            "up": ["y", -1],
            "down": ["y", 1],
            "left": ["x", -1],
            "right": ["x", 1]
        }
    }

    update(state) {
        if (this.movingProgressRemaining > 0) {
            this.updatePosition();
        } else {

            //more cases need to be added

            //arrow has been pressed and no cut scene
            if (!state.map.iscutsceneplaying && this.isPlayerControlled && this.movingProgressRemaining === 0 && state.arrow) {
                this.startBehaviour(state, {
                    type: "walk",
                    direction: state.arrow
                })
            }
            this.updateSprite(state);
        }
        
    }


    startBehaviour(state, behaviour){
        //set character direction to behaviour
        this.direction = behaviour.direction;
        if (behaviour.type === "walk") {
            //stops if space is not free
            if (state.map.isspacetaken(this.x, this.y, this.direction)){

                behaviour.retry && setTimeout(() => {
                    this.startBehaviour(state, behaviour)
                }, 10);

                return;
            }
            //walks 
            state.map.movewall(this.x, this.y, this.direction); //sets a wall for our space 
            this.movingProgressRemaining = 16;
            this.updateSprite(state);
        }

        if (behaviour.type === "stand") {
            this.standing = true;
            setTimeout(() => {
                utils.emitevent("personstandingcomplete", {whoid: this.id});
                this.standing = false;
            }, behaviour.time);

        }
    }

    updatePosition() {
            const [property, change] = this.directionUpdate[this.direction];
            this[property] += change;
            this.movingProgressRemaining -= 1;

            if (this.movingProgressRemaining === 0) {
                //walk done
                utils.emitevent("personwalkingcomplete", {whoid: this.id})
            }
    }

    updateSprite(){

        if (this.movingProgressRemaining > 0) {
            this.sprite.setAnimation("walk" + this.direction);
            return;
        }
        this.sprite.setAnimation("idle" + this.direction);
    }
}