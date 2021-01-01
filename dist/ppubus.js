import { Memory } from './memory.js';
var PpuBus = /** @class */ (function () {
    function PpuBus() {
        this.patternTables = new Memory(0x2000);
        this.nameTables = new Memory(0x2000);
        this.readBuffer = 0x00;
        this.paletteRAM = new Memory(0x20);
    }
    PpuBus.prototype.read = function (addr) {
        if (addr <= 0x1fff) {
            var data = this.readBuffer;
            this.readBuffer = this.patternTables.read(addr);
            return data;
        }
        else if (addr <= 0x2FFF) {
            // Nametable 0 - 3
            var data = this.readBuffer;
            this.readBuffer = this.nameTables.read(addr - 0x2000);
            return data;
        }
        else if (addr <= 0x3EFF) {
            // Mirrors of 0x2000-0x2EFF
            // return this.read(addr - 0x1000);
            var data = this.readBuffer;
            this.readBuffer = this.nameTables.read(addr - 0x3000);
            return data;
        }
        else if (addr <= 0x3F1F) {
            if (addr === 0x3F04 || addr === 0x3F08 || addr === 0x3F0C)
                console.log('!!!');
            // Palette RAM indexes
            this.readBuffer = this.nameTables.read(addr - 0x3000);
            // console.log('Palette RAM indexes')
            if (addr === 0x3F10 || addr === 0x3F14 || addr === 0x3F18 || addr === 0x3F1C) {
                return this.paletteRAM.read(addr - 0x3F00 - 0x10);
            }
            else {
                return this.paletteRAM.read(addr - 0x3F00);
            }
        }
        else {
            // Mirrors of 0x3F00-0x3F1F
            this.readBuffer = this.nameTables.read(addr - 0x3000);
            // console.log('Mirror of 0x3F00-0x3F1F')
            if (addr === 0x3F30 || addr === 0x3F34 || addr === 0x3F38 || addr === 0x3F3C) {
                return this.paletteRAM.read(addr - 0x3F20 - 0x10);
            }
            else {
                return this.paletteRAM.read(addr - 0x3F20);
            }
            // return this.nameTables.read(addr - 0x2020);
        }
    };
    PpuBus.prototype.write = function (addr, data) {
        if (addr <= 0x1fff) {
            this.patternTables.write(addr, data);
        }
        else if (addr <= 0x2FFF) {
            // Nametable 0 - 3
            this.nameTables.write(addr - 0x2000, data);
        }
        else if (addr <= 0x3EFF) {
            // Mirrors of 0x2000-0x2EFF
            this.nameTables.write(addr - 0x3000, data);
            // this.write(addr - 0x1000, data);
        }
        else if (addr <= 0x3F1F) {
            // Palette RAM indexes
            if (addr === 0x3F10) {
                console.log('0x3f10');
            }
            if (addr === 0x3F10 || addr === 0x3F14 || addr === 0x3F18 || addr === 0x3F1C) {
                this.paletteRAM.write(addr - 0x3F00 - 0x10, data);
            }
            else {
                this.paletteRAM.write(addr - 0x3F00, data);
            }
        }
        else {
            // Mirrors of 0x3F00-0x3F1F
            console.log('addr is over than 0x3F20.');
            if (addr === 0x3F30 || addr === 0x3F34 || addr === 0x3F38 || addr === 0x3F3C) {
                this.paletteRAM.write(addr - 0x3F20 - 0x10, data);
            }
            else {
                this.paletteRAM.write(addr - 0x3F20, data);
            }
        }
    };
    return PpuBus;
}());
export { PpuBus };
