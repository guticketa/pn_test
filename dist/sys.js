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
            {
                console.log('----');
                var x0 = _this.cpu.bus.ppu.bus.nameTables.mem[0x03C0].toString(16).toUpperCase();
                var x1 = _this.cpu.bus.ppu.bus.nameTables.mem[0x03C1].toString(16).toUpperCase();
                var x2 = _this.cpu.bus.ppu.bus.nameTables.mem[0x03C2].toString(16).toUpperCase();
                var x3 = _this.cpu.bus.ppu.bus.nameTables.mem[0x03C3].toString(16).toUpperCase();
                var x4 = _this.cpu.bus.ppu.bus.nameTables.mem[0x03C4].toString(16).toUpperCase();
                var x5 = _this.cpu.bus.ppu.bus.nameTables.mem[0x03C5].toString(16).toUpperCase();
                var x6 = _this.cpu.bus.ppu.bus.nameTables.mem[0x03C6].toString(16).toUpperCase();
                var x7 = _this.cpu.bus.ppu.bus.nameTables.mem[0x03C7].toString(16).toUpperCase();
                console.log("0x03C0: " + x0 + " " + x1 + " " + x2 + " " + x3 + " " + x4 + " " + x5 + " " + x6 + " " + x7);
                x0 = _this.cpu.bus.ppu.bus.nameTables.mem[0x03C8].toString(16).toUpperCase();
                x1 = _this.cpu.bus.ppu.bus.nameTables.mem[0x03C9].toString(16).toUpperCase();
                x2 = _this.cpu.bus.ppu.bus.nameTables.mem[0x03CA].toString(16).toUpperCase();
                x3 = _this.cpu.bus.ppu.bus.nameTables.mem[0x03CB].toString(16).toUpperCase();
                x4 = _this.cpu.bus.ppu.bus.nameTables.mem[0x03CC].toString(16).toUpperCase();
                x5 = _this.cpu.bus.ppu.bus.nameTables.mem[0x03CD].toString(16).toUpperCase();
                x6 = _this.cpu.bus.ppu.bus.nameTables.mem[0x03CE].toString(16).toUpperCase();
                x7 = _this.cpu.bus.ppu.bus.nameTables.mem[0x03CF].toString(16).toUpperCase();
                console.log("0x03C8: " + x0 + " " + x1 + " " + x2 + " " + x3 + " " + x4 + " " + x5 + " " + x6 + " " + x7);
                x0 = _this.cpu.bus.ppu.bus.nameTables.mem[0x03D0].toString(16).toUpperCase();
                x1 = _this.cpu.bus.ppu.bus.nameTables.mem[0x03D1].toString(16).toUpperCase();
                x2 = _this.cpu.bus.ppu.bus.nameTables.mem[0x03D2].toString(16).toUpperCase();
                x3 = _this.cpu.bus.ppu.bus.nameTables.mem[0x03D3].toString(16).toUpperCase();
                x4 = _this.cpu.bus.ppu.bus.nameTables.mem[0x03D4].toString(16).toUpperCase();
                x5 = _this.cpu.bus.ppu.bus.nameTables.mem[0x03D5].toString(16).toUpperCase();
                x6 = _this.cpu.bus.ppu.bus.nameTables.mem[0x03D6].toString(16).toUpperCase();
                x7 = _this.cpu.bus.ppu.bus.nameTables.mem[0x03F7].toString(16).toUpperCase();
                console.log("0x03D0: " + x0 + " " + x1 + " " + x2 + " " + x3 + " " + x4 + " " + x5 + " " + x6 + " " + x7);
                x0 = _this.cpu.bus.ppu.bus.nameTables.mem[0x03D8].toString(16).toUpperCase();
                x1 = _this.cpu.bus.ppu.bus.nameTables.mem[0x03D9].toString(16).toUpperCase();
                x2 = _this.cpu.bus.ppu.bus.nameTables.mem[0x03DA].toString(16).toUpperCase();
                x3 = _this.cpu.bus.ppu.bus.nameTables.mem[0x03DB].toString(16).toUpperCase();
                x4 = _this.cpu.bus.ppu.bus.nameTables.mem[0x03DC].toString(16).toUpperCase();
                x5 = _this.cpu.bus.ppu.bus.nameTables.mem[0x03DD].toString(16).toUpperCase();
                x6 = _this.cpu.bus.ppu.bus.nameTables.mem[0x03DE].toString(16).toUpperCase();
                x7 = _this.cpu.bus.ppu.bus.nameTables.mem[0x03DF].toString(16).toUpperCase();
                console.log("0x03D8: " + x0 + " " + x1 + " " + x2 + " " + x3 + " " + x4 + " " + x5 + " " + x6 + " " + x7);
                x0 = _this.cpu.bus.ppu.bus.nameTables.mem[0x03E0].toString(16).toUpperCase();
                x1 = _this.cpu.bus.ppu.bus.nameTables.mem[0x03E1].toString(16).toUpperCase();
                x2 = _this.cpu.bus.ppu.bus.nameTables.mem[0x03E2].toString(16).toUpperCase();
                x3 = _this.cpu.bus.ppu.bus.nameTables.mem[0x03E3].toString(16).toUpperCase();
                x4 = _this.cpu.bus.ppu.bus.nameTables.mem[0x03E4].toString(16).toUpperCase();
                x5 = _this.cpu.bus.ppu.bus.nameTables.mem[0x03E5].toString(16).toUpperCase();
                x6 = _this.cpu.bus.ppu.bus.nameTables.mem[0x03E6].toString(16).toUpperCase();
                x7 = _this.cpu.bus.ppu.bus.nameTables.mem[0x03F7].toString(16).toUpperCase();
                console.log("0x03E0: " + x0 + " " + x1 + " " + x2 + " " + x3 + " " + x4 + " " + x5 + " " + x6 + " " + x7);
                x0 = _this.cpu.bus.ppu.bus.nameTables.mem[0x03E8].toString(16).toUpperCase();
                x1 = _this.cpu.bus.ppu.bus.nameTables.mem[0x03E9].toString(16).toUpperCase();
                x2 = _this.cpu.bus.ppu.bus.nameTables.mem[0x03EA].toString(16).toUpperCase();
                x3 = _this.cpu.bus.ppu.bus.nameTables.mem[0x03EB].toString(16).toUpperCase();
                x4 = _this.cpu.bus.ppu.bus.nameTables.mem[0x03EC].toString(16).toUpperCase();
                x5 = _this.cpu.bus.ppu.bus.nameTables.mem[0x03ED].toString(16).toUpperCase();
                x6 = _this.cpu.bus.ppu.bus.nameTables.mem[0x03EE].toString(16).toUpperCase();
                x7 = _this.cpu.bus.ppu.bus.nameTables.mem[0x03EF].toString(16).toUpperCase();
                console.log("0x03E8: " + x0 + " " + x1 + " " + x2 + " " + x3 + " " + x4 + " " + x5 + " " + x6 + " " + x7);
                x0 = _this.cpu.bus.ppu.bus.nameTables.mem[0x03F0].toString(16).toUpperCase();
                x1 = _this.cpu.bus.ppu.bus.nameTables.mem[0x03F1].toString(16).toUpperCase();
                x2 = _this.cpu.bus.ppu.bus.nameTables.mem[0x03F2].toString(16).toUpperCase();
                x3 = _this.cpu.bus.ppu.bus.nameTables.mem[0x03F3].toString(16).toUpperCase();
                x4 = _this.cpu.bus.ppu.bus.nameTables.mem[0x03F4].toString(16).toUpperCase();
                x5 = _this.cpu.bus.ppu.bus.nameTables.mem[0x03F5].toString(16).toUpperCase();
                x6 = _this.cpu.bus.ppu.bus.nameTables.mem[0x03F6].toString(16).toUpperCase();
                x7 = _this.cpu.bus.ppu.bus.nameTables.mem[0x03F7].toString(16).toUpperCase();
                console.log("0x03F0: " + x0 + " " + x1 + " " + x2 + " " + x3 + " " + x4 + " " + x5 + " " + x6 + " " + x7);
                x0 = _this.cpu.bus.ppu.bus.nameTables.mem[0x03F8].toString(16).toUpperCase();
                x1 = _this.cpu.bus.ppu.bus.nameTables.mem[0x03F9].toString(16).toUpperCase();
                x2 = _this.cpu.bus.ppu.bus.nameTables.mem[0x03FA].toString(16).toUpperCase();
                x3 = _this.cpu.bus.ppu.bus.nameTables.mem[0x03FB].toString(16).toUpperCase();
                x4 = _this.cpu.bus.ppu.bus.nameTables.mem[0x03FC].toString(16).toUpperCase();
                x5 = _this.cpu.bus.ppu.bus.nameTables.mem[0x03FD].toString(16).toUpperCase();
                x6 = _this.cpu.bus.ppu.bus.nameTables.mem[0x03FE].toString(16).toUpperCase();
                x7 = _this.cpu.bus.ppu.bus.nameTables.mem[0x03FF].toString(16).toUpperCase();
                console.log("0x03F8: " + x0 + " " + x1 + " " + x2 + " " + x3 + " " + x4 + " " + x5 + " " + x6 + " " + x7);
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
