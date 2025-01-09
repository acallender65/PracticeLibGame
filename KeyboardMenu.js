class keyboardmenu {
    constructor(config={}){
        this.options = [];
        this.up = null;
        this.down = null;
        this.prevfocus = null;
        this.descriptioncontainer = config.descriptioncontainer || null;
    }

    setoptions(options){
        this.options = options;
        this.element.innerHTML = this.options.map((option, index) => {
            const disabledattr = option.disabled ? "disabled" : "";
            const autofocusattr = option.autofocus ? "autofocus" : "";
            return (`
                <div class="option">
                <button ${disabledattr} ${autofocusattr} data-button = "${index}" data-description = "${option.description}">
                    ${option.label}
                </button>
                </div>`)
        }).join("");

        this.element.querySelectorAll("button").forEach(button => {
            button.addEventListener("click", () => {
                const chosenoption = this.options[Number(button.dataset.button)];
                chosenoption.handler();
            });

            button.addEventListener("mouseenter", () => {
                button.focus();
            })
            button.addEventListener("focus", () => {
                this.prevfocus = button;
                this.descriptionelementtext.innerText = button.dataset.description;
            })
        });
    }

    createElement(){
        this.element = document.createElement("div");
        this.element.classList.add("keyboardmenu");

        this.descriptionelement = document.createElement("div");
        this.descriptionelement.classList.add("Descriptionbox");
        this.descriptionelement.innerHTML = (`<p>infor here</p>`);
        this.descriptionelementtext = this.descriptionelement.querySelector("p");
    }

    end () {
        this.element.remove();
        this.descriptionelement.remove();

        this.up.unbind();
        this.down.unbind();
    }

    init(container){
        this.createElement();
        (this.descriptioncontainer || container).appendChild(this.descriptionelement);
        container.appendChild(this.element);

        this.up = new keypresslistener("ArrowUp", () => {
            const nextindex = Number(this.prevfocus.getAttribute("data-button"));
            const nextbutton = Array.from(this.element.querySelectorAll("button[data-button]")).reverse.find(el => {
                return el.dataset.button > current && !el.disabled
            })
            prevbutton?.focus();
        });

        this.down = new keypresslistener("ArrowDown", () => {
            const nextindex = Number(this.prevfocus.getAttribute("data-button"));
            const nextbutton = Array.from(this.element.querySelectorAll("button[data-button]")).find(el => {
                return el.dataset.button > current && !el.disabled
            })
            nextbutton?.focus();
        });
    }
}