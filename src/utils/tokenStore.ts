type TokenEntry = {
    pdf: string;
    expiresAt: number;
};

const store = new Map<string, TokenEntry>();

export function saveToken(token: string, pdf: string) {
    store.set(token, {
        pdf,
        expiresAt: Date.now() + 1000 * 60 * 10
    });
}

export function consumeToken(token: string) {
    const entry = store.get(token);

    if (!entry) return null;

    if (Date.now() > entry.expiresAt) {
        store.delete(token);
        return null;
    }

    // 🔥 Suppression immédiate (usage unique)
    store.delete(token);

    return entry.pdf;
}
