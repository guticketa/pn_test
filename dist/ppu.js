import { PpuBus } from './ppubus.js';
import { Memory } from './memory.js';
import { Frame } from './draw.js';
// The OAM (Object Attribute Memory) is internal memory inside the PPU that contains a display list of up to 64 sprites, where each sprite's information occupies 4 bytes.
/*
 * | Common Name | Address | Bits      | Notes |
 * | ----------- | ------- | --------- |
 * | PPUSTATUS   | $2002   | VS0- ---- | blank (V), sprite 0 hit (S), sprite overflow (O); read resets write pair for $2005/$2006 |
 *
 */
var colors = [
    [84, 84, 84],
    [0, 30, 116],
    [8, 16, 144],
    [48, 0, 136],
    [68, 0, 100],
    [92, 0, 48],
    [84, 4, 0],
    [60, 24, 0],
    [32, 42, 0],
    [8, 58, 0],
    [0, 64, 0],
    [0, 60, 0],
    [0, 50, 60],
    [0, 0, 0],
    [0, 0, 0],
    [0, 0, 0],
    [152, 150, 152],
    [8, 76, 196],
    [48, 50, 236],
    [92, 30, 228],
    [136, 20, 176],
    [160, 20, 100],
    [152, 34, 32],
    [120, 60, 0],
    [84, 90, 0],
    [40, 114, 0],
    [8, 124, 0],
    [0, 118, 40],
    [0, 102, 120],
    [0, 0, 0],
    [0, 0, 0],
    [0, 0, 0],
    [236, 238, 236],
    [76, 154, 236],
    [120, 124, 236],
    [176, 98, 236],
    [228, 84, 236],
    [236, 88, 180],
    [236, 106, 100],
    [212, 136, 32],
    [160, 170, 0],
    [116, 196, 0],
    [76, 208, 32],
    [56, 204, 108],
    [56, 180, 204],
    [60, 60, 60],
    [0, 0, 0],
    [0, 0, 0],
    [236, 238, 236],
    [168, 204, 236],
    [188, 188, 236],
    [212, 178, 236],
    [236, 174, 236],
    [236, 174, 212],
    [236, 180, 176],
    [228, 196, 144],
    [204, 210, 120],
    [180, 222, 120],
    [168, 226, 144],
    [152, 226, 180],
    [160, 214, 228],
    [160, 162, 160],
    [0, 0, 0],
    [0, 0, 0]
];
var Ppu = /** @class */ (function () {
    function Ppu() {
        this.stat = 0;
        this.cycle = 0;
        this.img = new ImageData(256, 240);
        this.oam = new Memory(256);
        this.reg = {
            PPUCTRL: 0,
            PPUMASK: 0,
            PPUSTATUS: 0x80,
            OAMADDR: 0,
            OAMDATA: 0,
            PPUSCROLL: 0,
            PPUADDR: 0,
            PPUDATA: 0
        };
        this.bus = new PpuBus();
        var canvas = (document.getElementById('canvas'));
        var ctx = canvas.getContext('2d');
        this.frame = new Frame(ctx);
        // Initialize background palettes
        this.bgColorSet = new Array(4);
        for (var i = 0; i < 4; i++) {
            this.bgColorSet[i] = new Array(4);
            for (var j = 0; j < 4; j++) {
                this.bgColorSet[i][j] = new Array(3).fill(0);
            }
        }
        this.spColorSet = new Array(4);
        for (var i = 0; i < 4; i++) {
            this.spColorSet[i] = new Array(4);
            for (var j = 0; j < 4; j++) {
                this.spColorSet[i][j] = new Array(3).fill(0);
            }
        }
    }
    Ppu.prototype.setupPalette = function () {
        // BG
        for (var i = 0; i < 16; i++) {
            var setIndex = (i >> 2) & 0x03;
            var colIndex = i & 0x03;
            // const val = this.bus.read(0x3f00 + i);
            var val = 0;
            if (i === 4 || i === 8 || i === 0xC) {
                val = this.bus.paletteRAM.mem[0];
            }
            else {
                val = this.bus.paletteRAM.mem[i];
            }
            this.bgColorSet[setIndex][colIndex] = colors[val];
        }
        // Sprites
        for (var i = 0; i < 16; i++) {
            var setIndex = (i >> 2) & 0x03;
            var colIndex = i & 0x03;
            var val = 0;
            if (i === 0 || i === 4 || i === 8 || i === 0xC) {
                val = this.bus.paletteRAM.mem[0];
            }
            else {
                val = this.bus.paletteRAM.mem[0x10 + i];
            }
            // const val = this.bus.read(0x3f10 + i);
            this.spColorSet[setIndex][colIndex] = colors[val];
        }
    };
    Ppu.prototype.write = function (addr, data) {
        switch (addr) {
            case 0: {
                this.reg.PPUCTRL = data;
                return;
            }
            case 1: {
                this.reg.PPUMASK = data;
                return;
            }
            case 3: {
                this.reg.OAMADDR = data;
                return;
            }
            case 4: {
                this.oam.write(this.reg.OAMADDR, data);
                this.reg.OAMADDR++;
                return;
            }
            case 5: {
                this.reg.PPUSCROLL = data;
                return;
            }
            case 6: {
                // must
                this.reg.PPUADDR =
                    ((this.reg.PPUADDR << 8) | (data & 0xff)) & 0xffff;
                return;
            }
            case 7: {
                // must
                this.reg.PPUDATA = data;
                this.bus.write(this.reg.PPUADDR, data);
                if ((this.reg.PPUCTRL & 0x04) === 0x04) {
                    this.reg.PPUADDR += 32;
                }
                else {
                    this.reg.PPUADDR += 1;
                }
                return;
            }
            default: {
                return;
            }
        }
    };
    Ppu.prototype.read = function (addr) {
        switch (addr) {
            case 2: {
                var val = this.reg.PPUSTATUS;
                this.reg.PPUSTATUS &= 0x7f;
                return val;
            }
            case 4: {
                return this.oam.read(this.reg.OAMADDR++);
            }
            case 7: {
                var addr_1 = this.reg.PPUADDR;
                if ((this.reg.PPUCTRL & 0x04) === 0x04) {
                    this.reg.PPUADDR += 32;
                }
                else {
                    this.reg.PPUADDR += 1;
                }
                return this.bus.read(addr_1);
            }
            default: {
                return 0;
            }
        }
    };
    Ppu.prototype.dot = function (x, y, color) {
        var index = y * (this.img.width * 4) + x * 4;
        this.img.data[index + 0] = color.r; // R
        this.img.data[index + 1] = color.g; // G
        this.img.data[index + 2] = color.b; // B
        this.img.data[index + 3] = 0xff; // A
    };
    Ppu.prototype.drawSprite = function (u, v, tile, attr) {
        if ((attr & 0x20) == 0x20) {
            // behind background.
            return;
        }
        for (var y = 0; y < 8; y++) {
            for (var x = 0; x < 8; x++) {
                var b0 = (this.bus.patternTables.mem[0x1000 + tile * 16 + y + 0] >>
                    (7 - x)) &
                    0x1;
                var b1 = (this.bus.patternTables.mem[0x1000 + tile * 16 + y + 8] >>
                    (7 - x)) &
                    0x1;
                var colorInfo = (b1 << 1) | b0;
                var _a = this.spColorSet[attr & 0x3][colorInfo], r = _a[0], g = _a[1], b = _a[2];
                var color = { r: r, g: g, b: b };
                if (colorInfo !== 0) {
                    var s = u + x;
                    var t = v + y;
                    if ((attr & 0x80) === 0x80) {
                        t = v + 7 - y;
                    }
                    if ((attr & 0x40) === 0x40) {
                        s = u + 7 - x;
                    }
                    this.dot(s, t, color);
                }
            }
        }
    };
    Ppu.prototype.drawBackground = function (colorSet, charAddr, u, v) {
        var bgPatternTableAddr;
        if ((this.reg.PPUCTRL & 0x10) === 0x10) {
            bgPatternTableAddr = 0x1000;
        }
        else {
            bgPatternTableAddr = 0x0000;
        }
        for (var y = 0; y < 8; y++) {
            for (var x = 0; x < 8; x++) {
                var b0 = (this.bus.patternTables.mem[bgPatternTableAddr + charAddr * 16 + y + 0] >>
                    (7 - x)) &
                    0x1;
                var b1 = (this.bus.patternTables.mem[bgPatternTableAddr + charAddr * 16 + y + 8] >>
                    (7 - x)) &
                    0x1;
                // const e: number = Math.floor((b1 * 2 + b0) / 3.0 * 255);
                // const color: Rgb888 = {r:e, g:e, b:e};
                var colorInfo = (b1 << 1) | b0;
                var _a = this.bgColorSet[colorSet][colorInfo], r = _a[0], g = _a[1], b = _a[2];
                var color = { r: r, g: g, b: b };
                this.dot(u * 8 + x, v * 8 + y, color);
            }
        }
    };
    Ppu.prototype.drawScreen = function () {
        this.setupPalette();
        // Draw background
        for (var v = 0; v < 30; v++) {
            for (var u = 0; u < 32; u++) {
                var addr = ((v << 5) | (u & 0xff)) & 0x3ff;
                // const charAddr: number = this.bus.nameTables.read(addr);
                var charAddr = this.bus.nameTables.mem[addr];
                // const charAddr: number = ((v << 5) | (u & 0xff)) & 0x3ff;
                var bgPaletteOffset = ((v << 1) & 0x38) | ((u >> 2) & 0x7);
                var bgPaletteAddr = 0x23c0 + bgPaletteOffset;
                if (bgPaletteAddr === 0x23c4 || bgPaletteAddr === 0x23c8 || bgPaletteAddr === 0x23cc) {
                    bgPaletteAddr = 0x23C0;
                    console.log("???");
                }
                // const paletteInfo: number = this.bus.read(
                //     0x23c0 + bgPaletteOffset
                // );
                var paletteInfo = this.bus.nameTables.mem[0x03c0 + bgPaletteOffset];
                // const paletteInfo = this.bus.paletteRAM.mem[bgPaletteOffset];
                var select = (v & 0x02) | ((u >> 1) & 0x1);
                var colorSet = (paletteInfo >> (select * 2)) & 0x03;
                this.drawBackground(colorSet, charAddr, u, v);
            }
        }
        // Draw sprite
        for (var u = 0; u < 256; u = u + 4) {
            var y = this.oam.read(u) - 1;
            var tile = this.oam.read(u + 1);
            var attr = this.oam.read(u + 2); // Attributes
            var x = this.oam.read(u + 3);
            this.drawSprite(x, y, tile, attr);
        }
        this.frame.render(this.img);
    };
    Ppu.prototype.assertVblank = function (cpu) {
        if ((this.reg.PPUCTRL & 0x80) === 0x80) {
            console.log('interruptNMI()!');
            cpu.interruptNMI();
        }
    };
    Ppu.prototype.process = function (cpu, cycle) {
        this.cycle += cycle;
        if (this.stat === 0 && this.cycle >= 241 * 341 + 2) {
            this.stat = 1;
            this.reg.PPUSTATUS = 0x80;
            if ((this.reg.PPUCTRL & 0x80) === 0x80) {
                cpu.interruptNMI();
            }
            return false;
        }
        else if (this.stat === 1 && this.cycle >= 261 * 341 + 2) {
            this.stat = 2;
            this.reg.PPUSTATUS = 0x00;
            return false;
        }
        else if (this.stat === 2 && this.cycle >= 262 * 341) {
            this.stat = 0;
            this.cycle = this.cycle - 262 * 341;
            return true;
        }
        return false;
    };
    return Ppu;
}());
export { Ppu };
