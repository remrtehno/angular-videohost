export function getJwtToken(): string
{
    return localStorage.getItem('access_token');
}

export function removeToken(): void
{
    localStorage.removeItem('access_token');
}

export function saveToken(token): void
{
    localStorage.setItem('access_token', token);
}
