import { CpuBus } from './cpubus.js';
function debugLog(s) {
    console.log(s);
}
var opDict = {
    0x69: { mode: 'immediate', name: 'ADC', cycle: 2 },
    0x65: { mode: 'zeropage', name: 'ADC', cycle: 3 },
    0x75: { mode: 'zeropageX', name: 'ADC', cycle: 4 },
    0x6d: { mode: 'absolute', name: 'ADC', cycle: 4 },
    0x7d: { mode: 'absoluteX', name: 'ADC', cycle: 4 },
    0x79: { mode: 'absoluteY', name: 'ADC', cycle: 4 },
    0x61: { mode: 'indirectX', name: 'ADC', cycle: 6 },
    0x71: { mode: 'indirectY', name: 'ADC', cycle: 5 },
    0xe9: { mode: 'immediate', name: 'SBC', cycle: 2 },
    0xe5: { mode: 'zeropage', name: 'SBC', cycle: 3 },
    0xf5: { mode: 'zeropageX', name: 'SBC', cycle: 4 },
    0xed: { mode: 'absolute', name: 'SBC', cycle: 4 },
    0xfd: { mode: 'absoluteX', name: 'SBC', cycle: 4 },
    0xf9: { mode: 'absoluteY', name: 'SBC', cycle: 4 },
    0xe1: { mode: 'indirectX', name: 'SBC', cycle: 6 },
    0xf1: { mode: 'indirectY', name: 'SBC', cycle: 5 },
    0x29: { mode: 'immediate', name: 'AND', cycle: 2 },
    0x25: { mode: 'zeropage', name: 'AND', cycle: 3 },
    0x35: { mode: 'zeropageX', name: 'AND', cycle: 4 },
    0x2d: { mode: 'absolute', name: 'AND', cycle: 4 },
    0x3d: { mode: 'absoluteX', name: 'AND', cycle: 4 },
    0x39: { mode: 'absoluteY', name: 'AND', cycle: 4 },
    0x21: { mode: 'indirectX', name: 'AND', cycle: 6 },
    0x31: { mode: 'indirectY', name: 'AND', cycle: 5 },
    0x09: { mode: 'immediate', name: 'ORA', cycle: 2 },
    0x05: { mode: 'zeropage', name: 'ORA', cycle: 3 },
    0x15: { mode: 'zeropageX', name: 'ORA', cycle: 4 },
    0x0d: { mode: 'absolute', name: 'ORA', cycle: 4 },
    0x1d: { mode: 'absoluteX', name: 'ORA', cycle: 4 },
    0x19: { mode: 'absoluteY', name: 'ORA', cycle: 4 },
    0x01: { mode: 'indirectX', name: 'ORA', cycle: 6 },
    0x11: { mode: 'indirectY', name: 'ORA', cycle: 5 },
    0x49: { mode: 'immediate', name: 'EOR', cycle: 2 },
    0x45: { mode: 'zeropage', name: 'EOR', cycle: 3 },
    0x55: { mode: 'zeropageX', name: 'EOR', cycle: 4 },
    0x4d: { mode: 'absolute', name: 'EOR', cycle: 4 },
    0x5d: { mode: 'absoluteX', name: 'EOR', cycle: 4 },
    0x59: { mode: 'absoluteY', name: 'EOR', cycle: 4 },
    0x41: { mode: 'indirectX', name: 'EOR', cycle: 6 },
    0x51: { mode: 'indirectY', name: 'EOR', cycle: 5 },
    0x0a: { mode: 'accumulator', name: 'ASL', cycle: 2 },
    0x06: { mode: 'zeropage', name: 'ASL', cycle: 5 },
    0x16: { mode: 'zeropageX', name: 'ASL', cycle: 6 },
    0x0e: { mode: 'absolute', name: 'ASL', cycle: 6 },
    0x1e: { mode: 'absoluteX', name: 'ASL', cycle: 7 },
    0x4a: { mode: 'accumulator', name: 'LSR', cycle: 2 },
    0x46: { mode: 'zeropage', name: 'LSR', cycle: 5 },
    0x56: { mode: 'zeropageX', name: 'LSR', cycle: 6 },
    0x4e: { mode: 'absolute', name: 'LSR', cycle: 6 },
    0x5e: { mode: 'absoluteX', name: 'LSR', cycle: 7 },
    0x2a: { mode: 'accumulator', name: 'ROL', cycle: 2 },
    0x26: { mode: 'zeropage', name: 'ROL', cycle: 5 },
    0x36: { mode: 'zeropageX', name: 'ROL', cycle: 6 },
    0x2e: { mode: 'absolute', name: 'ROL', cycle: 6 },
    0x3e: { mode: 'absoluteX', name: 'ROL', cycle: 7 },
    0x6a: { mode: 'accumulator', name: 'ROR', cycle: 2 },
    0x66: { mode: 'zeropage', name: 'ROR', cycle: 5 },
    0x76: { mode: 'zeropageX', name: 'ROR', cycle: 6 },
    0x6e: { mode: 'absolute', name: 'ROR', cycle: 6 },
    0x7e: { mode: 'absoluteX', name: 'ROR', cycle: 7 },
    0x90: { mode: 'relative', name: 'BCC', cycle: 2 },
    0xb0: { mode: 'relative', name: 'BCS', cycle: 2 },
    0xf0: { mode: 'relative', name: 'BEQ', cycle: 2 },
    0xd0: { mode: 'relative', name: 'BNE', cycle: 2 },
    0x50: { mode: 'relative', name: 'BVC', cycle: 2 },
    0x70: { mode: 'relative', name: 'BVS', cycle: 2 },
    0x10: { mode: 'relative', name: 'BPL', cycle: 2 },
    0x30: { mode: 'relative', name: 'BMI', cycle: 2 },
    0x24: { mode: 'zeropage', name: 'BIT', cycle: 3 },
    0x2c: { mode: 'absolute', name: 'BIT', cycle: 4 },
    0x4c: { mode: 'absolute', name: 'JMP', cycle: 3 },
    0x6c: { mode: 'indirect', name: 'JMP', cycle: 5 },
    0x20: { mode: 'absolute', name: 'JSR', cycle: 6 },
    0x60: { mode: 'implied', name: 'RTS', cycle: 6 },
    0x00: { mode: 'implied', name: 'BRK', cycle: 7 },
    0x40: { mode: 'implied', name: 'RTI', cycle: 6 },
    0xc9: { mode: 'immediate', name: 'CMP', cycle: 2 },
    0xc5: { mode: 'zeropage', name: 'CMP', cycle: 3 },
    0xd5: { mode: 'zeropageX', name: 'CMP', cycle: 4 },
    0xcd: { mode: 'absolute', name: 'CMP', cycle: 4 },
    0xdd: { mode: 'absoluteX', name: 'CMP', cycle: 4 },
    0xd9: { mode: 'absoluteY', name: 'CMP', cycle: 4 },
    0xc1: { mode: 'indirectX', name: 'CMP', cycle: 6 },
    0xd1: { mode: 'indirectY', name: 'CMP', cycle: 5 },
    0xe0: { mode: 'immediate', name: 'CPX', cycle: 2 },
    0xe4: { mode: 'zeropage', name: 'CPX', cycle: 3 },
    0xec: { mode: 'absolute', name: 'CPX', cycle: 4 },
    0xc0: { mode: 'immediate', name: 'CPY', cycle: 2 },
    0xc4: { mode: 'zeropage', name: 'CPY', cycle: 3 },
    0xcc: { mode: 'absolute', name: 'CPY', cycle: 4 },
    0xe6: { mode: 'zeropage', name: 'INC', cycle: 5 },
    0xf6: { mode: 'zeropageX', name: 'INC', cycle: 6 },
    0xee: { mode: 'absolute', name: 'INC', cycle: 6 },
    0xfe: { mode: 'absoluteX', name: 'INC', cycle: 7 },
    0xc6: { mode: 'zeropage', name: 'DEC', cycle: 5 },
    0xd6: { mode: 'zeropageX', name: 'DEC', cycle: 6 },
    0xce: { mode: 'absolute', name: 'DEC', cycle: 6 },
    0xde: { mode: 'absoluteX', name: 'DEC', cycle: 7 },
    0xe8: { mode: 'implied', name: 'INX', cycle: 2 },
    0xca: { mode: 'implied', name: 'DEX', cycle: 2 },
    0xc8: { mode: 'implied', name: 'INY', cycle: 2 },
    0x88: { mode: 'implied', name: 'DEY', cycle: 2 },
    0x18: { mode: 'implied', name: 'CLC', cycle: 2 },
    0x38: { mode: 'implied', name: 'SEC', cycle: 2 },
    0x58: { mode: 'implied', name: 'CLI', cycle: 2 },
    0x78: { mode: 'implied', name: 'SEI', cycle: 2 },
    0xd8: { mode: 'implied', name: 'CLD', cycle: 2 },
    0xf8: { mode: 'implied', name: 'SED', cycle: 2 },
    0xb8: { mode: 'implied', name: 'CLV', cycle: 2 },
    0xa9: { mode: 'immediate', name: 'LDA', cycle: 2 },
    0xa5: { mode: 'zeropage', name: 'LDA', cycle: 3 },
    0xb5: { mode: 'zeropageX', name: 'LDA', cycle: 4 },
    0xad: { mode: 'absolute', name: 'LDA', cycle: 4 },
    0xbd: { mode: 'absoluteX', name: 'LDA', cycle: 4 },
    0xb9: { mode: 'absoluteY', name: 'LDA', cycle: 4 },
    0xa1: { mode: 'indirectX', name: 'LDA', cycle: 6 },
    0xb1: { mode: 'indirectY', name: 'LDA', cycle: 5 },
    0xa2: { mode: 'immediate', name: 'LDX', cycle: 2 },
    0xa6: { mode: 'zeropage', name: 'LDX', cycle: 3 },
    0xb6: { mode: 'zeropageY', name: 'LDX', cycle: 4 },
    0xae: { mode: 'absolute', name: 'LDX', cycle: 4 },
    0xbe: { mode: 'absoluteY', name: 'LDX', cycle: 4 },
    0xa0: { mode: 'immediate', name: 'LDY', cycle: 2 },
    0xa4: { mode: 'zeropage', name: 'LDY', cycle: 3 },
    0xb4: { mode: 'zeropageX', name: 'LDY', cycle: 4 },
    0xac: { mode: 'absolute', name: 'LDY', cycle: 4 },
    0xbc: { mode: 'absoluteX', name: 'LDY', cycle: 4 },
    0x85: { mode: 'zeropage', name: 'STA', cycle: 3 },
    0x95: { mode: 'zeropageX', name: 'STA', cycle: 4 },
    0x8d: { mode: 'absolute', name: 'STA', cycle: 4 },
    0x9d: { mode: 'absoluteX', name: 'STA', cycle: 5 },
    0x99: { mode: 'absoluteY', name: 'STA', cycle: 5 },
    0x81: { mode: 'indirectX', name: 'STA', cycle: 6 },
    0x91: { mode: 'indirectY', name: 'STA', cycle: 6 },
    0x86: { mode: 'zeropage', name: 'STX', cycle: 3 },
    0x96: { mode: 'zeropageY', name: 'STX', cycle: 4 },
    0x8e: { mode: 'absolute', name: 'STX', cycle: 4 },
    0x84: { mode: 'zeropage', name: 'STY', cycle: 3 },
    0x94: { mode: 'zeropageX', name: 'STY', cycle: 4 },
    0x8c: { mode: 'absolute', name: 'STY', cycle: 4 },
    0xaa: { mode: 'implied', name: 'TAX', cycle: 2 },
    0x8a: { mode: 'implied', name: 'TXA', cycle: 2 },
    0xa8: { mode: 'implied', name: 'TAY', cycle: 2 },
    0x98: { mode: 'implied', name: 'TYA', cycle: 2 },
    0x9a: { mode: 'implied', name: 'TXS', cycle: 2 },
    0xba: { mode: 'implied', name: 'TSX', cycle: 2 },
    0x48: { mode: 'implied', name: 'PHA', cycle: 3 },
    0x68: { mode: 'implied', name: 'PLA', cycle: 4 },
    0x08: { mode: 'implied', name: 'PHP', cycle: 3 },
    0x28: { mode: 'implied', name: 'PLP', cycle: 4 },
    0xea: { mode: 'implied', name: 'NOP', cycle: 2 },
    /* Unofficial opcodes */
    0x1a: { mode: 'implied', name: '*NOP', cycle: 2 },
    0x3a: { mode: 'implied', name: '*NOP', cycle: 2 },
    0x5a: { mode: 'implied', name: '*NOP', cycle: 2 },
    0x7a: { mode: 'implied', name: '*NOP', cycle: 2 },
    0xda: { mode: 'implied', name: '*NOP', cycle: 2 },
    0xfa: { mode: 'implied', name: '*NOP', cycle: 2 },
    0x04: { mode: 'immediate', name: '*NOP', cycle: 3 },
    0x44: { mode: 'immediate', name: '*NOP', cycle: 3 },
    0x64: { mode: 'immediate', name: '*NOP', cycle: 3 },
    0x14: { mode: 'immediate', name: '*NOP', cycle: 4 },
    0x34: { mode: 'immediate', name: '*NOP', cycle: 4 },
    0x54: { mode: 'immediate', name: '*NOP', cycle: 4 },
    0x74: { mode: 'immediate', name: '*NOP', cycle: 4 },
    0xd4: { mode: 'immediate', name: '*NOP', cycle: 4 },
    0xf4: { mode: 'immediate', name: '*NOP', cycle: 4 },
    0x0c: { mode: 'absolute', name: '*NOP', cycle: 4 },
    0x1c: { mode: 'absolute', name: '*NOP', cycle: 4 },
    0x3c: { mode: 'absolute', name: '*NOP', cycle: 4 },
    0x5c: { mode: 'absolute', name: '*NOP', cycle: 4 },
    0x7c: { mode: 'absolute', name: '*NOP', cycle: 4 },
    0xdc: { mode: 'absolute', name: '*NOP', cycle: 4 },
    0xfc: { mode: 'absolute', name: '*NOP', cycle: 4 },
    0x80: { mode: 'immediate', name: '*NOP', cycle: 2 },
    0xa7: { mode: 'zeropage', name: '*LAX', cycle: 3 },
    0xb7: { mode: 'zeropageY', name: '*LAX', cycle: 4 },
    0xaf: { mode: 'absolute', name: '*LAX', cycle: 4 },
    0xbf: { mode: 'absoluteY', name: '*LAX', cycle: 4 },
    0xa3: { mode: 'indirectX', name: '*LAX', cycle: 6 },
    0xb3: { mode: 'indirectY', name: '*LAX', cycle: 5 },
    0x87: { mode: 'zeropage', name: '*SAX', cycle: 3 },
    0x97: { mode: 'zeropageY', name: '*SAX', cycle: 4 },
    0x83: { mode: 'indirectX', name: '*SAX', cycle: 6 },
    0x8f: { mode: 'absolute', name: '*SAX', cycle: 4 },
    0xeb: { mode: 'immediate', name: '*SBC', cycle: 2 },
    0xc7: { mode: 'zeropage', name: '*DCP', cycle: 5 },
    0xd7: { mode: 'zeropageX', name: '*DCP', cycle: 6 },
    0xcf: { mode: 'absolute', name: '*DCP', cycle: 6 },
    0xdf: { mode: 'absoluteX', name: '*DCP', cycle: 7 },
    0xdb: { mode: 'absoluteY', name: '*DCP', cycle: 7 },
    0xc3: { mode: 'indirectX', name: '*DCP', cycle: 8 },
    0xd3: { mode: 'indirectY', name: '*DCP', cycle: 8 },
    0xe7: { mode: 'zeropage', name: '*ISB', cycle: 5 },
    0xf7: { mode: 'zeropageX', name: '*ISB', cycle: 6 },
    0xef: { mode: 'absolute', name: '*ISB', cycle: 6 },
    0xff: { mode: 'absoluteX', name: '*ISB', cycle: 7 },
    0xfb: { mode: 'absoluteY', name: '*ISB', cycle: 7 },
    0xe3: { mode: 'indirectX', name: '*ISB', cycle: 8 },
    0xf3: { mode: 'indirectY', name: '*ISB', cycle: 8 },
    0x07: { mode: 'zeropage', name: '*SLO', cycle: 5 },
    0x17: { mode: 'zeropageX', name: '*SLO', cycle: 6 },
    0x0f: { mode: 'absolute', name: '*SLO', cycle: 6 },
    0x1f: { mode: 'absoluteX', name: '*SLO', cycle: 7 },
    0x1b: { mode: 'absoluteY', name: '*SLO', cycle: 7 },
    0x03: { mode: 'indirectX', name: '*SLO', cycle: 8 },
    0x13: { mode: 'indirectY', name: '*SLO', cycle: 8 },
    0x47: { mode: 'zeropage', name: '*SRE', cycle: 5 },
    0x57: { mode: 'zeropageX', name: '*SRE', cycle: 6 },
    0x4f: { mode: 'absolute', name: '*SRE', cycle: 6 },
    0x5f: { mode: 'absoluteX', name: '*SRE', cycle: 7 },
    0x5b: { mode: 'absoluteY', name: '*SRE', cycle: 7 },
    0x43: { mode: 'indirectX', name: '*SRE', cycle: 8 },
    0x53: { mode: 'indirectY', name: '*SRE', cycle: 8 },
    0x27: { mode: 'zeropage', name: '*RLA', cycle: 5 },
    0x37: { mode: 'zeropageX', name: '*RLA', cycle: 6 },
    0x2f: { mode: 'absolute', name: '*RLA', cycle: 6 },
    0x3f: { mode: 'absoluteX', name: '*RLA', cycle: 7 },
    0x3b: { mode: 'absoluteY', name: '*RLA', cycle: 7 },
    0x23: { mode: 'indirectX', name: '*RLA', cycle: 8 },
    0x33: { mode: 'indirectY', name: '*RLA', cycle: 8 },
    0x67: { mode: 'zeropage', name: '*RRA', cycle: 5 },
    0x77: { mode: 'zeropageX', name: '*RRA', cycle: 6 },
    0x6f: { mode: 'absolute', name: '*RRA', cycle: 6 },
    0x7f: { mode: 'absoluteX', name: '*RRA', cycle: 7 },
    0x7b: { mode: 'absoluteY', name: '*RRA', cycle: 7 },
    0x63: { mode: 'indirectX', name: '*RRA', cycle: 8 },
    0x73: { mode: 'indirectY', name: '*RRA', cycle: 8 },
    0x89: { mode: 'immediate', name: '*NOP', cycle: 2 },
    0x02: { mode: 'implied', name: '*KIL', cycle: 1 },
    0x12: { mode: 'implied', name: '*KIL', cycle: 1 },
    0x22: { mode: 'implied', name: '*KIL', cycle: 1 },
    0x32: { mode: 'implied', name: '*KIL', cycle: 1 },
    0x42: { mode: 'implied', name: '*KIL', cycle: 1 },
    0x52: { mode: 'implied', name: '*KIL', cycle: 1 },
    0x62: { mode: 'implied', name: '*KIL', cycle: 1 },
    0x72: { mode: 'implied', name: '*KIL', cycle: 1 },
    0x92: { mode: 'implied', name: '*KIL', cycle: 1 },
    0xb2: { mode: 'implied', name: '*KIL', cycle: 1 },
    0xd2: { mode: 'implied', name: '*KIL', cycle: 1 },
    0xf2: { mode: 'implied', name: '*KIL', cycle: 1 }
};
function boolToUint8(b) {
    if (b) {
        return 1;
    }
    else {
        return 0;
    }
}
function boolToUint16(b) {
    if (b) {
        return 1;
    }
    else {
        return 0;
    }
}
var Cpu = /** @class */ (function () {
    function Cpu(name) {
        this.name = name; // This is pseudo code.
        this.reg = {
            A: 0,
            X: 0,
            Y: 0,
            SP: 0x00,
            P: {
                N: false,
                V: false,
                R: true,
                B: false,
                D: false,
                I: false,
                Z: false,
                C: false
            },
            PC: 0
        };
        this.bus = new CpuBus();
        this.debug = false;
        this.instrLog = false;
    }
    Cpu.prototype.loadCassette = function (data) {
        if (data[0] !== 0x4e ||
            data[1] !== 0x45 ||
            data[2] !== 0x53 ||
            data[3] !== 0x1a) {
            console.log('ROM header error!');
            return;
        }
        var programROMSize = data[4];
        var chrROMSize = data[5];
        var flags6 = data[6];
        var programROMStart = 0x10;
        console.log(programROMSize, chrROMSize, flags6, programROMStart);
        if ((flags6 & 0x4) !== 0) {
            console.log('trainer');
        }
        if (programROMSize === 2) {
            for (var i = 0; i < this.bus.programROML.mem.length; i++) {
                this.bus.programROML.mem[i] = data[programROMStart + i];
            }
            for (var i = 0; i < this.bus.programROMH.mem.length; i++) {
                this.bus.programROMH.mem[i] =
                    data[programROMStart + 0x4000 + i];
            }
        }
        else if (programROMSize === 1) {
            for (var i = 0; i < this.bus.programROML.mem.length; i++) {
                this.bus.programROML.mem[i] = data[programROMStart + i];
            }
            for (var i = 0; i < this.bus.programROMH.mem.length; i++) {
                this.bus.programROMH.mem[i] = data[programROMStart + i];
            }
        }
        else {
            console.log('Unknown programROMSize');
        }
        for (var i = 0; i < this.bus.ppu.bus.patternTables.mem.length; i++) {
            this.bus.ppu.bus.patternTables.mem[i] =
                data[programROMStart + programROMSize * 0x4000 + i];
        }
    };
    Cpu.prototype.interruptReset = function () {
        this.reg.P.I = true;
        this.reg.PC = 0xfffc;
        var l = this.fetch();
        var h = this.fetch();
        this.reg.PC = (h << 8) | l;
    };
    Cpu.prototype.interruptNMI = function () {
        this.reg.P.B = false;
        this.push((this.reg.PC >> 8) & 0xff);
        this.push(this.reg.PC & 0xff);
        this.pushStatus();
        this.reg.P.I = true;
        this.reg.PC = 0xfffa;
        var l = this.fetch();
        var h = this.fetch();
        this.reg.PC = (h << 8) | l;
    };
    Cpu.prototype.interruptIRQ = function () {
        if (this.reg.P.I) {
            return;
        }
        this.reg.P.B = false;
        this.push((this.reg.PC >> 8) & 0xff);
        this.push(this.reg.PC & 0xff);
        this.pushStatus();
        this.reg.P.I = true;
        this.reg.PC = 0xfffe;
        var l = this.fetch();
        var h = this.fetch();
        this.reg.PC = (h << 8) | l;
    };
    Cpu.prototype.interruptBRK = function () {
        if (this.reg.P.I) {
            return;
        }
        this.reg.P.B = true;
        this.reg.PC++;
        this.push((this.reg.PC >> 8) & 0xff);
        this.push(this.reg.PC & 0xff);
        this.pushStatus();
        this.reg.P.I = true;
        this.reg.PC = 0xfffe;
        var l = this.fetch();
        var h = this.fetch();
        this.reg.PC = (h << 8) | l;
    };
    Cpu.prototype.push = function (data) {
        this.bus.write(0x0100 | this.reg.SP, data);
        this.reg.SP = (this.reg.SP - 1) & 0xff;
    };
    Cpu.prototype.pop = function () {
        this.reg.SP = (this.reg.SP + 1) & 0xff;
        return this.bus.read(0x100 | this.reg.SP);
    };
    Cpu.prototype.branch = function (addr) {
        this.reg.PC = addr;
    };
    Cpu.prototype.pushStatus = function () {
        var status = (boolToUint8(this.reg.P.N) << 7) |
            (boolToUint8(this.reg.P.V) << 6) |
            (boolToUint8(true) << 5) |
            (boolToUint8(this.reg.P.B) << 4) |
            (boolToUint8(this.reg.P.D) << 3) |
            (boolToUint8(this.reg.P.I) << 2) |
            (boolToUint8(this.reg.P.Z) << 1) |
            boolToUint8(this.reg.P.C);
        this.push(status);
    };
    Cpu.prototype.popStatus = function () {
        var status = this.pop();
        this.reg.P.N = (status & 0x80) === 0x80;
        this.reg.P.V = (status & 0x40) === 0x40;
        this.reg.P.R = true;
        this.reg.P.B = false;
        this.reg.P.D = (status & 0x08) === 0x08;
        this.reg.P.I = (status & 0x04) === 0x04;
        this.reg.P.Z = (status & 0x02) === 0x02;
        this.reg.P.C = (status & 0x01) === 0x01;
    };
    Cpu.prototype.popPC = function () {
        this.reg.PC = this.pop(); // TODO: cast to Uint16
        this.reg.PC += this.pop() << 8; // TODO: cast to Uint16
    };
    Cpu.prototype.fetch = function () {
        return this.bus.read(this.reg.PC++);
    };
    Cpu.prototype.decode = function (opcode) {
        var op = opDict[opcode];
        if (op === undefined) {
            console.log("opcode: " + opcode);
        }
        return [op.name, op.mode, op.cycle];
    };
    Cpu.prototype.getAddrOrData = function (opcode) {
        var _a = this.decode(opcode), instr = _a[0], mode = _a[1], cycle = _a[2];
        switch (mode) {
            case 'accumulator': {
                var addrOrData = 0;
                return [instr, mode, addrOrData, cycle];
            }
            case 'implied': {
                var addrOrData = 0;
                return [instr, mode, addrOrData, cycle];
            }
            case 'immediate': {
                var addrOrData = this.fetch();
                return [instr, mode, addrOrData, cycle];
            }
            case 'relative': {
                var t = this.fetch();
                if ((t & 0x80) !== 0) {
                    t = 0xff00 | t;
                }
                var addrOrData = (this.reg.PC + t) & 0xffff;
                return [instr, mode, addrOrData, cycle];
            }
            case 'zeropage': {
                var l = this.fetch();
                var addrOrData = l;
                return [instr, mode, addrOrData, cycle];
            }
            case 'zeropageX': {
                var l = this.fetch();
                var addrOrData = (l + this.reg.X) & 0xff;
                return [instr, mode, addrOrData, cycle];
            }
            case 'zeropageY': {
                var l = this.fetch();
                var addrOrData = (l + this.reg.Y) & 0xff;
                return [instr, mode, addrOrData, cycle];
            }
            case 'absolute': {
                var l = this.fetch();
                var h = this.fetch();
                var addrOrData = (h << 8) + l;
                return [instr, mode, addrOrData, cycle];
            }
            case 'absoluteX': {
                var l = this.fetch();
                var h = this.fetch();
                var addrOrData = ((h << 8) + l + this.reg.X) & 0xffff;
                return [instr, mode, addrOrData, cycle];
            }
            case 'absoluteY': {
                var l = this.fetch();
                var h = this.fetch();
                var addrOrData = ((h << 8) + l + this.reg.Y) & 0xffff;
                return [instr, mode, addrOrData, cycle];
            }
            case 'indirect': {
                var l = this.fetch();
                var h = this.fetch();
                var addrOrData = (this.bus.read(l + (h << 8)) +
                    (this.bus.read(((l + 1) & 0xff) + (h << 8)) << 8)) &
                    0xffff;
                return [instr, mode, addrOrData, cycle];
            }
            case 'indirectX': {
                var t = this.fetch();
                t = (t + this.reg.X) & 0xff;
                var addrOrData = this.bus.read(t) + (this.bus.read((t + 1) & 0xff) << 8);
                return [instr, mode, addrOrData, cycle];
            }
            case 'indirectY': {
                var t = this.fetch();
                var addrOrData = (this.bus.read(t) +
                    (this.bus.read((t + 1) & 0xff) << 8) +
                    this.reg.Y) &
                    0xffff;
                return [instr, mode, addrOrData, cycle];
            }
            case 'preIndexedindirect':
            case 'postIndexedindirect':
            case 'indirectabsolute':
            default: {
                var t = this.fetch();
                return [instr, mode, t, cycle];
            }
        }
    };
    Cpu.prototype.execute = function (instr, mode, addrOrData) {
        var halt = false;
        switch (instr) {
            case 'LDA': {
                /* Load A from M */
                if (mode === 'immediate') {
                    this.reg.A = addrOrData & 0xff;
                }
                else {
                    this.reg.A = this.bus.read(addrOrData);
                }
                this.reg.P.N = (this.reg.A & 0x80) === 0x80;
                this.reg.P.Z = this.reg.A === 0;
                return halt;
            }
            case 'LDX': {
                if (mode === 'immediate') {
                    this.reg.X = addrOrData & 0xff;
                }
                else {
                    this.reg.X = this.bus.read(addrOrData);
                }
                this.reg.P.N = (this.reg.X & 0x80) === 0x80;
                this.reg.P.Z = this.reg.X === 0;
                return halt;
            }
            case 'LDY': {
                if (mode === 'immediate') {
                    this.reg.Y = addrOrData & 0xff;
                }
                else {
                    this.reg.Y = this.bus.read(addrOrData);
                }
                this.reg.P.N = (this.reg.Y & 0x80) === 0x80;
                this.reg.P.Z = this.reg.Y === 0;
                return halt;
            }
            case 'STA': {
                this.bus.write(addrOrData, this.reg.A);
                return halt;
            }
            case 'STX': {
                this.bus.write(addrOrData, this.reg.X);
                return halt;
            }
            case 'STY': {
                this.bus.write(addrOrData, this.reg.Y);
                return halt;
            }
            case 'TAX': {
                this.reg.X = this.reg.A;
                this.reg.P.N = (this.reg.X & 0x80) === 0x80;
                this.reg.P.Z = (this.reg.X & 0xff) === 0x00;
                return halt;
            }
            case 'TAY': {
                this.reg.Y = this.reg.A;
                this.reg.P.N = (this.reg.Y & 0x80) === 0x80;
                this.reg.P.Z = (this.reg.Y & 0xff) === 0x00;
                return halt;
            }
            case 'TSX': {
                this.reg.X = this.reg.SP;
                this.reg.P.N = (this.reg.X & 0x80) === 0x80;
                this.reg.P.Z = (this.reg.X & 0xff) === 0x00;
                return halt;
            }
            case 'TXA': {
                this.reg.A = this.reg.X;
                this.reg.P.N = (this.reg.A & 0x80) === 0x80;
                this.reg.P.Z = (this.reg.A & 0xff) === 0x00;
                return halt;
            }
            case 'TXS': {
                this.reg.SP = this.reg.X + 0x0100;
                return halt;
            }
            case 'TYA': {
                this.reg.A = this.reg.Y;
                this.reg.P.N = (this.reg.A & 0x80) === 0x80;
                this.reg.P.Z = (this.reg.A & 0xff) === 0x00;
                return halt;
            }
            case 'ADC': {
                var data = addrOrData;
                if (mode !== 'immediate') {
                    data = this.bus.read(addrOrData);
                }
                var operated = data + this.reg.A + boolToUint16(this.reg.P.C);
                var overflow = (data & 0x80) === (this.reg.A & 0x80) &&
                    (this.reg.A & 0x80) !== (operated & 0x80);
                this.reg.P.V = overflow;
                this.reg.P.C = operated > 0xff;
                this.reg.P.N = (operated & 0x80) === 0x80;
                this.reg.P.Z = (operated & 0xff) === 0;
                this.reg.A = operated & 0xff;
                return halt;
            }
            case 'AND': {
                var data = addrOrData;
                if (mode !== 'immediate') {
                    data = this.bus.read(addrOrData);
                }
                var operated = data & this.reg.A;
                this.reg.P.N = (operated & 0x80) === 0x80;
                this.reg.P.Z = operated === 0;
                this.reg.A = operated & 0xff;
                return halt;
            }
            case 'ASL': {
                if (mode === 'accumulator') {
                    var acc = this.reg.A;
                    this.reg.P.C = (acc & 0x80) !== 0;
                    this.reg.A = (acc << 1) & 0xff;
                    this.reg.P.Z = this.reg.A === 0;
                    this.reg.P.N = (this.reg.A & 0x80) === 0x80;
                }
                else {
                    var data = this.bus.read(addrOrData);
                    this.reg.P.C = (data & 0x80) !== 0;
                    var shifted = (data << 1) & 0xff;
                    this.bus.write(addrOrData, shifted);
                    this.reg.P.Z = shifted === 0;
                    this.reg.P.N = (shifted & 0x80) === 0x80;
                }
                return halt;
            }
            case 'BIT': {
                var data = this.bus.read(addrOrData);
                this.reg.P.N = (data & 0x80) === 0x80;
                this.reg.P.V = (data & 0x40) !== 0;
                this.reg.P.Z = (this.reg.A & data) === 0x00;
                return halt;
            }
            case 'CMP': {
                var data = addrOrData;
                if (mode !== 'immediate') {
                    data = this.bus.read(addrOrData);
                }
                var compared = this.reg.A - data;
                this.reg.P.C = compared >= 0;
                this.reg.P.N = (compared & 0x80) === 0x80;
                this.reg.P.Z = (compared & 0xff) === 0x00;
                return halt;
            }
            case 'CPX': {
                var data = addrOrData;
                if (mode !== 'immediate') {
                    data = this.bus.read(addrOrData);
                }
                var compared = this.reg.X - data;
                this.reg.P.C = compared >= 0;
                this.reg.P.N = (compared & 0x80) === 0x80;
                this.reg.P.Z = (compared & 0xff) === 0x00;
                return halt;
            }
            case 'CPY': {
                var data = addrOrData;
                if (mode !== 'immediate') {
                    data = this.bus.read(addrOrData);
                }
                var compared = this.reg.Y - data;
                this.reg.P.C = compared >= 0;
                this.reg.P.N = (compared & 0x80) === 0x80;
                this.reg.P.Z = (compared & 0xff) === 0x00;
                return halt;
            }
            case 'DEC': {
                // Decrement M by one
                var data = this.bus.read(addrOrData) - 1;
                this.reg.P.N = (data & 0x80) === 0x80;
                this.reg.P.Z = (data & 0xff) === 0x00;
                this.bus.write(addrOrData, data);
                return halt;
            }
            case 'DEX': {
                // Decrement X by one
                this.reg.X = (this.reg.X - 1) & 0xff;
                this.reg.P.N = (this.reg.X & 0x80) === 0x80;
                this.reg.P.Z = (this.reg.X & 0xff) === 0x00;
                return halt;
            }
            case 'DEY': {
                // Decrement Y by one
                this.reg.Y = (this.reg.Y - 1) & 0xff;
                this.reg.P.N = (this.reg.Y & 0x80) === 0x80;
                this.reg.P.Z = (this.reg.Y & 0xff) === 0x00;
                return halt;
            }
            case 'EOR': {
                var data = addrOrData;
                if (mode !== 'immediate') {
                    data = this.bus.read(addrOrData);
                }
                var operated = data ^ this.reg.A;
                this.reg.P.N = (operated & 0x80) === 0x80;
                this.reg.P.Z = (operated & 0xff) === 0x00;
                this.reg.A = operated & 0xff;
                return halt;
            }
            case 'INC': {
                var data = (this.bus.read(addrOrData) + 1) & 0xff;
                this.reg.P.N = (data & 0x80) === 0x80;
                this.reg.P.Z = (data & 0xff) === 0x00;
                this.bus.write(addrOrData, data);
                return halt;
            }
            case 'INX': {
                this.reg.X = (this.reg.X + 1) & 0xff;
                this.reg.P.N = (this.reg.X & 0x80) === 0x80;
                this.reg.P.Z = (this.reg.X & 0xff) === 0x00;
                return halt;
            }
            case 'INY': {
                this.reg.Y = (this.reg.Y + 1) & 0xff;
                this.reg.P.N = (this.reg.Y & 0x80) === 0x80;
                this.reg.P.Z = (this.reg.Y & 0xff) === 0x00;
                return halt;
            }
            case 'LSR': {
                if (mode === 'accumulator') {
                    var acc = this.reg.A & 0xff;
                    this.reg.P.C = (acc & 0x01) !== 0;
                    this.reg.A = acc >> 1;
                    this.reg.P.Z = this.reg.A === 0;
                }
                else {
                    var data = this.bus.read(addrOrData);
                    this.reg.P.C = (data & 0x01) !== 0;
                    this.reg.P.Z = data >> 1 === 0;
                    this.bus.write(addrOrData, data >> 1);
                }
                this.reg.P.N = false;
                return halt;
            }
            case 'ORA': {
                var data = addrOrData;
                if (mode !== 'immediate') {
                    data = this.bus.read(addrOrData);
                }
                var operated = data | this.reg.A;
                this.reg.P.N = (operated & 0x80) === 0x80;
                this.reg.P.Z = operated === 0;
                this.reg.A = operated & 0xff;
                return halt;
            }
            case 'ROL': {
                if (mode === 'accumulator') {
                    var carry = this.reg.P.C;
                    this.reg.P.C = (this.reg.A & 0x80) !== 0;
                    this.reg.A =
                        ((this.reg.A << 1) | boolToUint8(carry)) & 0xff;
                    this.reg.P.N = (this.reg.A & 0x80) === 0x80;
                }
                else {
                    var m = this.bus.read(addrOrData);
                    var carry = this.reg.P.C;
                    this.reg.P.C = (m & 0x80) !== 0;
                    m = ((m << 1) | boolToUint8(carry)) & 0xff;
                    this.reg.P.N = (m & 0x80) === 0x80;
                    this.bus.write(addrOrData, m);
                }
                return halt;
            }
            case 'ROR': {
                if (mode === 'accumulator') {
                    var carry = this.reg.P.C;
                    this.reg.P.C = (this.reg.A & 0x01) !== 0;
                    this.reg.A =
                        ((this.reg.A >> 1) | (boolToUint8(carry) << 7)) & 0xff;
                    this.reg.P.N = (this.reg.A & 0x80) === 0x80;
                }
                else {
                    var m = this.bus.read(addrOrData);
                    var carry = this.reg.P.C;
                    this.reg.P.C = (m & 0x01) !== 0;
                    m = ((m >> 1) | (boolToUint8(carry) << 7)) & 0xff;
                    this.reg.P.N = (m & 0x80) === 0x80;
                    this.bus.write(addrOrData, m);
                }
                return halt;
            }
            case 'SBC':
            case '*SBC': {
                var data = addrOrData;
                if (mode !== 'immediate') {
                    data = this.bus.read(addrOrData);
                }
                var operated = this.reg.A - data - boolToUint16(!this.reg.P.C);
                var overflow = (this.reg.A & 0x80) !== (data & 0x80) &&
                    (this.reg.A & 0x80) !== (operated & 0x80);
                this.reg.P.V = overflow;
                this.reg.P.C = operated >= 0;
                this.reg.P.N = (operated & 0x80) === 0x80;
                this.reg.P.Z = (operated & 0xff) === 0x00;
                this.reg.A = operated & 0xff;
                return halt;
            }
            case 'PHA': {
                this.push(this.reg.A);
                return halt;
            }
            case 'PHP': {
                var status_1 = (boolToUint8(this.reg.P.N) << 7) |
                    (boolToUint8(this.reg.P.V) << 6) |
                    (boolToUint8(this.reg.P.R) << 5) |
                    (1 << 4) |
                    (boolToUint8(this.reg.P.D) << 3) |
                    (boolToUint8(this.reg.P.I) << 2) |
                    (boolToUint8(this.reg.P.Z) << 1) |
                    boolToUint8(this.reg.P.C);
                this.push(status_1);
                return halt;
            }
            case 'PLA': {
                this.reg.A = this.pop();
                this.reg.P.N = (this.reg.A & 0x80) === 0x80;
                this.reg.P.Z = (this.reg.A & 0xff) === 0x00;
                return halt;
            }
            case 'PLP': {
                this.popStatus();
                return halt;
            }
            case 'JMP': {
                // Jump to new location
                this.reg.PC = addrOrData;
                return halt;
            }
            case 'JSR': {
                // Jump to new location saving return address
                var pc = this.reg.PC - 1;
                this.push((pc >> 8) & 0xff);
                this.push(pc & 0xff);
                this.reg.PC = addrOrData;
                return halt;
            }
            case 'RTS': {
                // Return from Subroutine
                this.popPC();
                this.reg.PC++;
                return halt;
            }
            case 'RTI': {
                this.popStatus();
                this.popPC();
                return halt;
            }
            case 'BCC': {
                // Branch on C clear
                if (!this.reg.P.C) {
                    this.branch(addrOrData);
                }
                return halt;
            }
            case 'BCS': {
                // Brach on C set
                if (this.reg.P.C) {
                    this.branch(addrOrData);
                }
                return halt;
            }
            case 'BEQ': {
                // Branch on Z set
                if (this.reg.P.Z) {
                    this.branch(addrOrData);
                }
                return halt;
            }
            case 'BMI': {
                // Branch on N set (result minus)
                if (this.reg.P.N) {
                    this.branch(addrOrData);
                }
                return halt;
            }
            case 'BNE': {
                // Branch on Z clear
                if (!this.reg.P.Z) {
                    this.branch(addrOrData);
                }
                return halt;
            }
            case 'BPL': {
                // Branch on N clear (result plus)
                if (!this.reg.P.N) {
                    this.branch(addrOrData);
                }
                return halt;
            }
            case 'BVS': {
                // Branch on V set
                if (this.reg.P.V) {
                    this.branch(addrOrData);
                }
                return halt;
            }
            case 'BVC': {
                // Branch on V clear
                if (!this.reg.P.V) {
                    this.branch(addrOrData);
                }
                return halt;
            }
            case 'CLD': {
                this.reg.P.D = false;
                return halt;
            }
            case 'CLC': {
                this.reg.P.C = false;
                return halt;
            }
            case 'CLI': {
                this.reg.P.I = false;
                return halt;
            }
            case 'CLV': {
                this.reg.P.V = false;
                return halt;
            }
            case 'SEC': {
                this.reg.P.C = true;
                return halt;
            }
            case 'SEI': {
                this.reg.P.I = true;
                return halt;
            }
            case 'SED': {
                this.reg.P.D = true;
                return halt;
            }
            case 'BRK': {
                // Force Break
                return halt;
            }
            case 'NOP': {
                return halt;
            }
            case '*NOP': {
                return halt;
            }
            case 'NOPD': {
                return halt;
            }
            case 'NOPI': {
                return halt;
            }
            case '*LAX': {
                this.reg.A = this.bus.read(addrOrData);
                this.reg.X = this.reg.A;
                this.reg.P.N = (this.reg.X & 0x80) === 0x80;
                this.reg.P.Z = (this.reg.X & 0xff) === 0x00;
                return halt;
            }
            case '*SAX': {
                this.bus.write(addrOrData, this.reg.X & this.reg.A);
                return halt;
            }
            case '*DCP': {
                var data = (this.bus.read(addrOrData) - 1) & 0xff;
                this.bus.write(addrOrData, data);
                var compared = this.reg.A - data;
                this.reg.P.C = compared >= 0;
                this.reg.P.N = (compared & 0x80) === 0x80;
                this.reg.P.Z = (compared & 0xff) === 0x00;
                return halt;
            }
            case '*ISB': {
                var data = (this.bus.read(addrOrData) + 1) & 0xff;
                this.bus.write(addrOrData, data);
                var operated = this.reg.A - data - boolToUint16(!this.reg.P.C);
                var overflow = (this.reg.A & 0x80) !== (data & 0x80) &&
                    (this.reg.A & 0x80) !== (operated & 0x80);
                this.reg.P.V = overflow;
                this.reg.P.C = operated >= 0;
                this.reg.P.N = (operated & 0x80) === 0x80;
                this.reg.P.Z = (operated & 0xff) === 0x00;
                this.reg.A = operated & 0xff;
                return halt;
            }
            case '*SLO': {
                var data = this.bus.read(addrOrData);
                this.reg.P.C = (data & 0x80) !== 0;
                var shifted = (data << 1) & 0xff;
                this.bus.write(addrOrData, shifted);
                var operated = shifted | this.reg.A;
                this.reg.P.N = (operated & 0x80) === 0x80;
                this.reg.P.Z = operated === 0;
                this.reg.A = operated & 0xff;
                return halt;
            }
            case '*RLA': {
                var m = this.bus.read(addrOrData);
                var carry = this.reg.P.C;
                this.reg.P.C = (m & 0x80) !== 0;
                m = ((m << 1) | boolToUint8(carry)) & 0xff;
                this.bus.write(addrOrData, m);
                var data = m;
                var operated = data & this.reg.A;
                this.reg.P.N = (operated & 0x80) === 0x80;
                this.reg.P.Z = operated === 0;
                this.reg.A = operated & 0xff;
                return halt;
            }
            case '*SRE': {
                var data = this.bus.read(addrOrData);
                this.reg.P.C = (data & 0x01) !== 0;
                this.bus.write(addrOrData, data >> 1);
                data = data >> 1;
                var operated = data ^ this.reg.A;
                this.reg.P.N = (operated & 0x80) === 0x80;
                this.reg.P.Z = (operated & 0xff) === 0x00;
                this.reg.A = operated & 0xff;
                return halt;
            }
            case '*RRA': {
                var m = this.bus.read(addrOrData);
                var carry = this.reg.P.C;
                this.reg.P.C = (m & 0x01) !== 0;
                m = ((m >> 1) | (boolToUint8(carry) << 7)) & 0xff;
                this.bus.write(addrOrData, m);
                var data = m;
                var operated = data + this.reg.A + boolToUint16(this.reg.P.C);
                var overflow = (data & 0x80) === (this.reg.A & 0x80) &&
                    (this.reg.A & 0x80) !== (operated & 0x80);
                this.reg.P.V = overflow;
                this.reg.P.C = operated > 0xff;
                this.reg.P.N = (operated & 0x80) === 0x80;
                this.reg.P.Z = (operated & 0xff) === 0x00;
                this.reg.A = operated & 0xff;
                return halt;
            }
            case '*KIL': {
                halt = true;
                return halt;
            }
            default: {
                console.log("unknown instr " + instr);
                return halt;
            }
        }
    };
    Cpu.prototype.run = function () {
        var opcode = this.fetch();
        var _a = this.getAddrOrData(opcode), instr = _a[0], addressingMode = _a[1], addrOrData = _a[2], cycle = _a[3];
        return [this.execute(instr, addressingMode, addrOrData), cycle];
    };
    return Cpu;
}());
export { Cpu };
