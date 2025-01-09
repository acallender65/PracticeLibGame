class SceneTransition {
    constructor() {
        this.element = null;
    }

    createelement() {
        this.element = document.createElement('div');
        this.element.classList.add('SceneTransition');
    }

    fadeout() {
        this.element.classList.add("fadeout");
        this.element.addEventListener('animationend', () => {
            this.element.remove();
        }, {once: true});
    }

    init(container, callback) {
        this.createelement();
        container.appendChild(this.element);

        this.element.addEventListener('animationend', () => {
            callback();
        }, {once: true});
    }
}