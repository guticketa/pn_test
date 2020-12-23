import { Cpu } from './cpu.js';
var Sys = /** @class */ (function () {
    function Sys() {
        var _this = this;
        this.processFrame = function () {
            while (true) {
                var count = 0;
                if (_this.cpu.bus.dmaBusy) {
                    for (var i = 0; i < 256; i++) {
                        _this.cpu.bus.ppu.oam.write(i, _this.cpu.bus.wram.read(_this.cpu.bus.OAMDMA + i));
                    }
                    count += 514;
                    _this.cpu.bus.dmaBusy = false;
                }
                var _a = _this.cpu.run(), halt = _a[0], cycle = _a[1];
                count += cycle;
                if (_this.cpu.bus.ppu.process(_this.cpu, count * 3)) {
                    break;
                }
            }
            _this.cpu.bus.ppu.drawScreen();
            requestAnimationFrame(_this.processFrame);
        };
        this.cpu = new Cpu('nes');
        document.addEventListener('keydown', function (event) {
            switch (event.key) {
                case 'z':
                    _this.cpu.bus.pad.keydownA();
                    break;
                case 'x':
                    _this.cpu.bus.pad.keydownB();
                    break;
                case 'c':
                    _this.cpu.bus.pad.keydownSelect();
                    break;
                case 'v':
                    _this.cpu.bus.pad.keydownStart();
                    break;
                case 'ArrowUp':
                    _this.cpu.bus.pad.keydownUp();
                    break;
                case 'ArrowDown':
                    _this.cpu.bus.pad.keydownDown();
                    break;
                case 'ArrowLeft':
                    _this.cpu.bus.pad.keydownLeft();
                    break;
                case 'ArrowRight':
                    _this.cpu.bus.pad.keydownRight();
                    break;
                default:
                    break;
            }
        });
        document.addEventListener('keyup', function (event) {
            switch (event.key) {
                case 'z':
                    _this.cpu.bus.pad.keyupA();
                    break;
                case 'x':
                    _this.cpu.bus.pad.keyupB();
                    break;
                case 'c':
                    _this.cpu.bus.pad.keyupSelect();
                    break;
                case 'v':
                    _this.cpu.bus.pad.keyupStart();
                    break;
                case 'ArrowUp':
                    _this.cpu.bus.pad.keyupUp();
                    break;
                case 'ArrowDown':
                    _this.cpu.bus.pad.keyupDown();
                    break;
                case 'ArrowLeft':
                    _this.cpu.bus.pad.keyupLeft();
                    break;
                case 'ArrowRight':
                    _this.cpu.bus.pad.keyupRight();
                    break;
                default:
                    break;
            }
        });
    }
    Sys.prototype.loadCassette = function (data) {
        this.cpu.loadCassette(data);
    };
    Sys.prototype.interruptReset = function () {
        this.cpu.interruptReset();
    };
    Sys.prototype.run = function () {
        requestAnimationFrame(this.processFrame);
    };
    return Sys;
}());
export { Sys };
