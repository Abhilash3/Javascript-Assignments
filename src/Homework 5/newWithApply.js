function construct(Class, ...values) {
    let obj = Object.create(Class.prototype);
    Class.apply(obj, values);
    return obj;
}
