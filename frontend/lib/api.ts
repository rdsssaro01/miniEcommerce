

function getAuthHeaders(): Record<string, string> {
    if (typeof window === 'undefined') return {};
    const token = localStorage.getItem('token');
    return token ? { Authorization: `Bearer ${token}` } : {};
}


export async function apiGet<T>(url: string, auth = false): Promise<any> {
    try {
        const headers: Record<string, string> = {
            'Content-Type': 'application/json',
            ...(auth ? getAuthHeaders() : {}),
        };
        const envUrl = process.env.NEXT_PUBLIC_API_URL;
        const res = await fetch(`${envUrl}${url}`, {
            method: 'GET',
            headers,
        });

        if (!res.ok) {
            const errorText = await res.text();
            throw new Error(`GET ${url} failed (${res.status}): ${errorText}`);
        }

        const data = await res.json();
        console.log('RESPONSE CHECK:', data);
        return data;
    } catch (error) {
        console.error(`Error in GET ${url}:`, error);
        throw error;
    }
}


export async function apiPost<T>(url: string, body: any, auth = false): Promise<any> {
    try {
        const headers: Record<string, string> = {
            'Content-Type': 'application/json',
            ...(auth ? getAuthHeaders() : {}),
        };
        console.log('ENV CHECK:', process.env.NEXT_PUBLIC_API_URL);
        const envUrl = process.env.NEXT_PUBLIC_API_URL;
        const res = await fetch(`${envUrl}${url}`, {
            method: 'POST',
            headers: headers,
            body: JSON.stringify(body),
        });

        if (!res.ok) {
            const errorText = await res.text();
            throw new Error(`POST ${url} failed (${res.status}): ${errorText}`);
        }
        const data = await res.json();
        console.log('RESPONSE CHECK:', data);
        return data;
    } catch (error) {
        console.error(`Error in POST ${url}:`, error);
        throw error;
    }
}
