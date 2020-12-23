var Memory = /** @class */ (function () {
    function Memory(size) {
        this.mem = new Uint8Array(size);
    }
    Memory.prototype.read = function (addr) {
        return this.mem[addr];
    };
    Memory.prototype.write = function (addr, data) {
        this.mem[addr] = data;
    };
    return Memory;
}());
export { Memory };
