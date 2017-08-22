function compose(...values) {
    return values.reverse().reduce((a, b) => c => b(a(c)), a => a);
}
