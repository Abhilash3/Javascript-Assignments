let defaultMap = () => ({ calculated: false, result: undefined, map: new Map() });
function cache(func) {
    let map = defaultMap();
    return (...values) => {
        let obj = map, i = 0, stack = [];
        while (i < values.length) {
            stack.push(obj);
            obj = obj.map.get(values[i]);
            if (!obj) {
                obj = defaultMap();
                stack[i].map.set(values[i++], obj);
            }
        }
        obj.result = obj.calculated ? obj.result : func(...values);
        obj.calculated = true;
        return obj.result;
    };
}
