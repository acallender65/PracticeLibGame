class revealingtext {
    constructor(config) {
        this.element = config.element;
        this.text = config.text;
        this.speed = config.speed || 130; //changes text speed

        this.timeout = null;
        this.isdone = false;
    }

    revealonecharacter(list) {
        const next = list.splice(0,1)[0];
        next.span.classList.add("revealed");

        if (list.length > 0) {
            this.timeout = setTimeout(() => {
                this.revealonecharacter(list);
            }, next.delayAfter);
        } else {
            this.isdone = true;
        }
        
    }

    skiptodone() {
        clearTimeout(this.timeout);
        this.isdone = true;
        this.element.querySelectorAll("span").forEach(span => {
            span.classList.add("revealed");
        })
    }

    init(){
        let characters = [];
        this.text.split("").forEach(character => {

            // adding the span to the document
            let span = document.createElement("span");
            span.textContent = character;
            this.element.appendChild(span);

            characters.push({
                span,
                delayAfter: character === " " ? 0 : this.speed, //makes it look better
            })
        })

        this.revealonecharacter(characters);
    }
}