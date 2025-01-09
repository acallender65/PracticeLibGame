const utils = {
    withGrid(n) {
        return n * 16;
    },

    asGridCoords(x,y) {
        return `${x*16},${y*16}`; //good for negative numbers
    },

    nextposition(initialx, initialy, direction) {
        let x = initialx;
        let y = initialy;
        const size = 16;
        if (direction === "left") {
            x -= size;
        } else if (direction === "right") {
            x += size;
        } else if (direction === "up") {
            y -= size;
        } else if (direction === "down") {
            y += size;
        }
        return {x, y};
    },

    oppositedirection(direction) {
        if (direction === "left") {return "right";}
        if (direction === "right") {return "left";}
        if (direction === "up") {return "down";}
        return "up";
    },

    wait(ms) {
        return new Promise(resolve => {
            setTimeout(() => {
                resolve();
            }, ms);
        });
    },

    randomFromArray(array) {
        return array[Math.floor(Math.random() * array.length)];
    },

    emitevent(name, detail) {

        //walking done 
        const event = new CustomEvent(name, {
            detail
        }); 

        document.dispatchEvent(event);
    }
    
}