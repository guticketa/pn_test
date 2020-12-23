var Pad = /** @class */ (function () {
    function Pad() {
        this.reg = { P1: 0, P2: 0 };
        this.p1Info = new Array(8).fill(0);
        this.count = 0;
    }
    Pad.prototype.write = function (addr, data) {
        switch (addr) {
            case 0x0016: {
                this.reg.P1 = data;
                if ((this.reg.P1 & 0x01) === 0x01) {
                    this.count = 0;
                }
                return;
            }
            case 0x0017: {
                return;
            }
            default: {
                return;
            }
        }
    };
    Pad.prototype.read = function (addr) {
        switch (addr) {
            case 0x0016: {
                var val = 0x01;
                if (this.count < 8) {
                    val = this.p1Info[this.count];
                }
                if ((this.reg.P1 & 0x01) !== 0x01) {
                    if (this.count < 7) {
                        this.count++;
                    }
                }
                return val;
            }
            case 0x0017: {
                return 0;
            }
            default: {
                return 0;
            }
        }
    };
    Pad.prototype.keydownA = function () {
        this.p1Info[0] = 0x01;
    };
    Pad.prototype.keydownB = function () {
        this.p1Info[1] = 0x01;
    };
    Pad.prototype.keydownSelect = function () {
        this.p1Info[2] = 0x01;
    };
    Pad.prototype.keydownStart = function () {
        this.p1Info[3] = 0x01;
    };
    Pad.prototype.keydownUp = function () {
        this.p1Info[4] = 0x01;
    };
    Pad.prototype.keydownDown = function () {
        this.p1Info[5] = 0x01;
    };
    Pad.prototype.keydownLeft = function () {
        this.p1Info[6] = 0x01;
    };
    Pad.prototype.keydownRight = function () {
        this.p1Info[7] = 0x01;
    };
    // KeyUp
    Pad.prototype.keyupA = function () {
        this.p1Info[0] = 0x00;
    };
    Pad.prototype.keyupB = function () {
        this.p1Info[1] = 0x00;
    };
    Pad.prototype.keyupSelect = function () {
        this.p1Info[2] = 0x00;
    };
    Pad.prototype.keyupStart = function () {
        this.p1Info[3] = 0x00;
    };
    Pad.prototype.keyupUp = function () {
        this.p1Info[4] = 0x00;
    };
    Pad.prototype.keyupDown = function () {
        this.p1Info[5] = 0x00;
    };
    Pad.prototype.keyupLeft = function () {
        this.p1Info[6] = 0x00;
    };
    Pad.prototype.keyupRight = function () {
        this.p1Info[7] = 0x00;
    };
    return Pad;
}());
export { Pad };
