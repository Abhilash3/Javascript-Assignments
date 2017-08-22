var Cat = (function () {
    let arr = [];
    let Cat = function(name, weight) {
        if (name === undefined || weight === undefined) {
            throw new Error('undefined parameter');
        }
        let index = arr.length;
        Object.defineProperty(this, 'name', {
            get: () => name,
            set: newName => { name = newName; }
        });
        Object.defineProperty(this, 'weight', {
            get: () => weight,
            set: newWeight => {
                weight = newWeight;
                arr[index] = newWeight;
            }
        });
        arr.push(weight);
    };
    Cat.averageWeight = () => arr.reduce((a, b) => a + b, 0) / arr.length;
    return Cat;
}());
