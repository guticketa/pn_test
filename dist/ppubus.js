import { Memory } from './memory.js';
var PpuBus = /** @class */ (function () {
    function PpuBus() {
        this.patternTables = new Memory(0x2000);
        this.nameTables = new Memory(0x2000);
    }
    PpuBus.prototype.read = function (addr) {
        if (addr <= 0x1fff) {
            return this.patternTables.read(addr);
        }
        else {
            return this.nameTables.read(addr - 0x2000);
        }
    };
    PpuBus.prototype.write = function (addr, data) {
        if (addr <= 0x1fff) {
            this.patternTables.write(addr, data);
        }
        else {
            this.nameTables.write(addr - 0x2000, data);
        }
    };
    return PpuBus;
}());
export { PpuBus };
