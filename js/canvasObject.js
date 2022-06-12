class CanvasObject {

    type = 'object';

    width = 0;

    height = 0;

    x = 0;

    y = 0;

    data = {};

    baseNode = null;

    constructor(data) {

        this.data = data;
    }

    createAppeareance() {

    }

    unselect() {
        this.baseNode.classList.remove('selected');
    }

    select() {
        this.baseNode.classList.remove('selected');
        this.baseNode.classList.add('selected');
    }

    isSelected() {
        return this.baseNode.classList.contains('selected');
    }

    setPosition(x,y) {
        this.baseNode.setAttributeNS(null, 'x', x);
        this.baseNode.setAttributeNS(null, 'y', y);
        this.x = x;
        this.y = y;
    }

    setSize(width, height) {
        this.baseNode.setAttributeNS(null, 'width', width);
        this.baseNode.setAttributeNS(null, 'height', height);
        this.width = width;
        this.height = height;
    }

    update() {
        this.setPosition(this.x, this.y);
        this.setSize(this.width, this.height);
    }

    render() {
        this.createAppeareance();
        this.baseNode.classList.add('field');
        this.baseNode.__instance__ = this;
    }
}