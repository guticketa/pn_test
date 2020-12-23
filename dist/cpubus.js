import { Memory } from './memory.js';
import { Ppu } from './ppu.js';
import { Pad } from './pad.js';
var wramBase = 0x0000;
var wramTop = 0x07ff;
var ppuBase = 0x2000;
var ppuTop = 0x2007;
var dmaBase = 0x4014;
var dmaTop = 0x4014;
var padBase = 0x4016;
var padTop = 0x4017;
var programROMLBase = 0x8000;
var programROMLTop = 0xbfff;
var programROMHBase = 0xc000;
var programROMHTop = 0xffff;
var CpuBus = /** @class */ (function () {
    function CpuBus() {
        this.wram = new Memory(0x800);
        this.ppu = new Ppu();
        this.pad = new Pad();
        this.programROML = new Memory(0x4000);
        this.programROMH = new Memory(0x4000);
        // this.dma = new Dma();
        this.OAMDMA = 0x00;
        this.dmaBusy = false;
    }
    CpuBus.prototype.write = function (addr, data) {
        if (addr <= 0x07ff) {
            this.wram.write(addr, data);
        }
        else if (addr <= 0x2007) {
            this.ppu.write(addr - 0x2000, data);
        }
        else if (addr <= 0x4014) {
            console.log('dma!');
            // const start = data << 8;
            // for (let i = 0; i < 256; i++) {
            //     this.ppu.oam.write(i, this.wram.read(start + i));
            // }
            // this.dma.transfer(data, this.wram, this.ppu.oam);
            this.OAMDMA = data << 8;
            this.dmaBusy = true;
        }
        else if (addr <= 0x401f) {
            this.pad.write(addr - 0x4000, data);
        }
        else if (addr <= 0xbfff) {
            this.programROML.write(addr - 0x8000, data);
        }
        else if (addr <= 0xffff) {
            this.programROMH.write(addr - 0xc000, data);
        }
    };
    CpuBus.prototype.read = function (addr) {
        if (addr <= 0x07ff) {
            return this.wram.read(addr);
        }
        else if (addr <= 0x2007) {
            return this.ppu.read(addr - 0x2000);
        }
        else if (addr <= 0x401f) {
            return this.pad.read(addr - 0x4000);
        }
        else if (addr <= 0xbfff) {
            return this.programROML.read(addr - 0x8000);
        }
        else if (addr <= 0xffff) {
            return this.programROMH.read(addr - 0xc000);
        }
        else {
            return 0;
        }
    };
    return CpuBus;
}());
export { CpuBus };
