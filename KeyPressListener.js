//prevents text being skipped by mistake

class keypresslistener {
    constructor( keycode, callback) {
        let keysafe = true;
        this.keydownfunction = function(event) {
            if (event.code === keycode) {
                if (keysafe) {
                    keysafe = false;
                    callback();
                }
            }
        };
        this.keyupfunction = function(event) {
            if (event.code === keycode) {
                keysafe = true;
            }
        };

        document.addEventListener("keydown", this.keydownfunction);
        document.addEventListener("keyup", this.keyupfunction);
    }

    unbind() {
        document.removeEventListener("keydown", this.keydownfunction);
        document.removeEventListener("keyup", this.keyupfunction);
    }
}