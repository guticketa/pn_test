var Frame = /** @class */ (function () {
    function Frame(ctx) {
        this.ctx = ctx;
    }
    Frame.prototype.render = function (img) {
        this.ctx.putImageData(img, 0, 0);
    };
    return Frame;
}());
export { Frame };
