class Relation extends CanvasObject {

    type = 'Relation';

    line = document.createElementNS("http://www.w3.org/2000/svg", 'line');

    text = document.createElementNS("http://www.w3.org/2000/svg", 'text');

    textRect = document.createElementNS("http://www.w3.org/2000/svg", 'rect');

    createAppeareance() {
        this.baseNode = document.createElementNS("http://www.w3.org/2000/svg", 'g');
        this.baseNode.classList.add('relation');

        this.baseNode.appendChild(this.line);
        this.baseNode.appendChild(this.textRect);
        this.baseNode.appendChild(this.text);
    }

    setPosition(x, y) {

        if(this.text.innerHTML.length == 0) {
            this.text.classList.remove('visible');
            this.textRect.classList.remove('visible');
        } else {
            this.text.classList.add('visible');
            this.textRect.classList.add('visible');
        }

        let x1 = this.data.class1.x + this.data.class1.width/2,
            y1 = this.data.class1.y + this.data.class1.height/2,
            x2 = this.data.class2.x + this.data.class2.width/2,
            y2 = this.data.class2.y + this.data.class2.height/2,
            width = x2 - x1,
            height = y2 - y1,
            textRect = this.text.getBBox();

        this.width = width;
        this.height = height;

        this.x = x1;
        this.y = y1;

        this.textRect.setAttributeNS(null, 'width', textRect.width + 10);
        this.textRect.setAttributeNS(null, 'height', textRect.height + 10);
        this.textRect.setAttributeNS(null, 'x', this.x + this.width/2 - textRect.width/2 - 5);
        this.textRect.setAttributeNS(null, 'y', this.y + this.height/2  - textRect.height/2 - 5);

        this.text.setAttributeNS(null, 'x', this.x + this.width/2 - textRect.width/2);
        this.text.setAttributeNS(null, 'y', this.y + this.height/2 - textRect.height/2);

        //this.baseNode.setAttributeNS(null, 'transform','translate(' + this.data.class1.x + ' ' + this.data.class1.y + ')');
        this.line.setAttributeNS(null, 'x1', x1);
        this.line.setAttributeNS(null, 'y1', y1);

        this.line.setAttributeNS(null, 'x2', x2);
        this.line.setAttributeNS(null, 'y2', y2);
    }

    update() {
        super.update();

        this.text.innerHTML = this.data.label;
        this.setPosition(this.x, this.y);

    }
}