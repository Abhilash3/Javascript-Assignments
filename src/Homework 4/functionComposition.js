function compose(f, g) {
    return a => f(g(a));
}
