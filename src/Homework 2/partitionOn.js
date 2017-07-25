function partitionOn(pred, items) {
    let falses = items.filter(a => !pred(a));
    let trues = items.filter(pred);
    items.length = 0;
    items.push.apply(items, [...falses, ...trues]);
    return falses.length;
}
