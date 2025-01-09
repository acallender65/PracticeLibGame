class Sprite {
    constructor(config){
        //set up stage
        this.image = new Image();
        this.image.src = config.src;
        this.image.onload = () => {
            this.isLoaded = true;
        }

        //shadow stuff
        //this.shadow = new Image();
        //this.useShadow = true; //config.useShadow || false
        //if (this.useShadow){
        //  this.shadow.src = ""
        //}
        //this.shadow.onload = () => {
        //    this.isShadowLoaded = true;
        //}

        //configuring animations + idle states
        this.animations = config.animations || {
            "idledown": [ [0,0] ],
            "idleright": [ [1,3] ],
            "idleup": [ [1,1] ],
            "idleleft": [ [1,2] ],
            "walkdown": [ [1,0], [0,0], [3,0], [0,0] ],
            "walkright": [ [2,3], [1,3], [4,3], [1,3] ],
            "walkup": [ [2,1], [1,1], [4,1], [1,1] ],
            "walkleft": [ [2,2], [1,2], [4,2], [1,2] ]
        }
        this.currentanimation = config.currentanimation || "idledown";
        this.currentanimationframe = 0;

        this.animationFrameLimit = config.animationFrameLimit || 10;
        this.animationFrameProgress = this.animationFrameLimit;

        //Reference game object
        this.gameObject = config.gameObject;

    }

    get frame(){
        return this.animations[this.currentanimation][this.currentanimationframe];

    }

    setAnimation(key){
        if (this.currentanimation !== key){
            this.currentanimation = key;
            this.currentanimationframe = 0;
            this.animationFrameProgress = this.animationFrameLimit;
        }
    }

    updateAnimationProgress() {
        //down tick the frame progress
        if (this.animationFrameProgress > 0) {
            this.animationFrameProgress -= 1;
            return;
        }

        //reset the counter
        this.animationFrameProgress = this.animationFrameLimit;
        this.currentanimationframe += 1;

        if (this.frame === undefined) {
            this.currentanimationframe = 0;
        }
    }


    draw(ctx, focusperson) {
        const x = this.gameObject.x + utils.withGrid(14.5) - focusperson.x;
        const y = this.gameObject.y - 2 + utils.withGrid(7) - focusperson.y;

        //this.isShadowLoaded && ctx.drawImage(this.shadow, x, y)


        const [framex, framey] = this.frame;

        this.isLoaded && ctx.drawImage(this.image, framex*350, framey*350, 320, 320, x, y, 48, 48);

        this.updateAnimationProgress();
    }
}