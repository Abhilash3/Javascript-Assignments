function add(n) {
    let number = (a) => add(n + a);
    number.valueOf = () => n;
    return number;
}
