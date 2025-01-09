class textmessage {
    constructor ({ text, oncomplete}) {
        this.text = text;
        this.oncomplete = oncomplete;
        this.element = null;
    }

    createelement() {
        this.element = document.createElement("div");
        this.element.classList.add("textmessage");
        this.element.innerHTML = (`
            <p class="textmessagetext"></p>
            <button class="textmessagebutton">Next</button>
        `)
        this.revealingtext = new revealingtext({
            element: this.element.querySelector(".textmessagetext"),
            text: this.text,
        })
        this.revealingtext.init();
        this.element.querySelector("button").addEventListener("click", () => {
            //close text box
            this.done();
        });

        this.actionlistener = new keypresslistener("Enter", () => {
            this.done();
        })
    }

    done() {

        if (this.revealingtext.isdone) {
            this.actionlistener.unbind();
            this.element.remove();
            this.oncomplete();
        }
        this.revealingtext.skiptodone();
    }

    init(container) {
        this.createelement();
        container.appendChild(this.element)
        //this.revealingtext.init();
    }
}
