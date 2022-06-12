class Text extends CanvasObject {

    type = 'Text';

    createAppeareance() {
        this.baseNode = document.createElementNS("http://www.w3.org/2000/svg", 'text');
        this.baseNode.classList.add('text');
    }

    autoResize() {
        let rect = this.baseNode.getBBox();
        this.setSize(rect.width, rect.height);
    }

    setPosition(x, y) {
        this.baseNode.setAttributeNS(null, 'transform', 'translate(' + x + ' ' + y + ')');
        this.x = x;
        this.y = y;
    }

    fillText() {
        let textSplit = this.data.text.split("\n"),
            i = 0,
            tSpan;
        this.baseNode.innerHTML = '';
        this.baseNode.setAttributeNS(null, 'font-size', this.data.size);
        for(i; i < textSplit.length; ++i) {
            tSpan = document.createElementNS("http://www.w3.org/2000/svg", 'tspan');
            tSpan.setAttributeNS(null, 'x', 0);
            tSpan.setAttributeNS(null, 'dy', '1.2em');
            tSpan.innerHTML = textSplit[i];
            this.baseNode.appendChild(tSpan);
        }
    }

    update() {
        this.setPosition(this.x, this.y);
        this.fillText();
        this.autoResize();
    }
}