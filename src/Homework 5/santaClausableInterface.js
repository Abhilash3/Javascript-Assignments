function isSantaClausable(obj) {
    return obj.sayHoHoHo instanceof Function &&
        obj.distributeGifts instanceof Function &&
        obj.goDownTheChimney instanceof Function;
}
