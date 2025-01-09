class pausemenu {
    constructor({oncomplete}) {
        this.oncomplete = oncomplete;
    }

    getoptions(pagekey) {
        if (pagekey === "root") {
            return [
                {
                    label: "Save",
                    description: "Save progress",
                    handler: () => {
                        //add this
                    }
                },
                {
                    label: "Close",
                    description: "Close menu",
                    handler: () => {
                        this.close();
                    }
                }
            ]
        }
    }

    createelement (){
        this.element = document.createElement("div");
        this.element.classList.add("pausemenu");
        this.element.innerHTML = (`
        <h1>Pause Menu</h1>
        `)
    }

    close() {
        this.esc?.unbind();
        this.keyboardmenu.end();
        this.element.remove();
        this.oncomplete();
    }
    
    async init (container) {
        this.createelement();
        this.keyboardmenu = new keyboardmenu( {
            descriptioncontainer: container
        })

        this.keyboardmenu.init(this.element);
        this.keyboardmenu.setoptions(this.getoptions("root"));

        container.appendChild(this.element);

        utils.wait(200); 
        this.esc = new keypresslistener("Escape", () => {
            this.close();
        })
    }
}