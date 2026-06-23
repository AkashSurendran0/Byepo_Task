type TokenPayload = {
    exp?: number;
    role?: string;
}

const parsePayload = (token: string): TokenPayload | null => {
    try {
        const payload = token.split('.')[1];
        if (!payload) return null;

        return JSON.parse(atob(payload.replace(/-/g, '+').replace(/_/g, '/')));
    } catch {
        return null;
    }
}

export const isValidToken = (tokenKey: string, expectedRole: string) => {
    if (typeof window === 'undefined') return false;

    const token = localStorage.getItem(tokenKey);
    if (!token) return false;

    const payload = parsePayload(token);
    if (!payload?.exp || payload.role !== expectedRole) {
        localStorage.removeItem(tokenKey);
        return false;
    }

    const isExpired = payload.exp * 1000 <= Date.now();
    if (isExpired) {
        localStorage.removeItem(tokenKey);
        return false;
    }

    return true;
}

export const logout = (tokenKey: string, redirectPath: string) => {
    localStorage.removeItem(tokenKey);
    window.location.href = redirectPath;
}
