function createSecretHolder(secret) {
    return {
        getSecret: () => secret,
        setSecret: (newSecret) => { secret = newSecret; }
    };
}