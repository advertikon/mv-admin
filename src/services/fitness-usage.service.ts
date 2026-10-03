import { authFetchApi } from '../modules/oauth/ouath';

const backendUrl = process.env.NEXT_PUBLIC_FITNESS_BACK_END || process.env.NEXT_PUBLIC_BACK_END;

export type UsageFilters = {
    page: number;
    pageSize: number;
    search?: string;
    platform?: string;
    status?: string;
    responseCacheHit?: string;
    operation?: string;
    provider?: string;
    model?: string;
    installationId?: string;
    from?: string;
    to?: string;
};

function queryString(filters: UsageFilters): string {
    const params = new URLSearchParams();
    Object.entries(filters).forEach(([key, value]) => {
        if (value !== undefined && value !== '') params.set(key, String(value));
    });
    return params.toString();
}

export async function getFitnessInstallations(filters: UsageFilters) {
    return authFetchApi(`${backendUrl}/admin/usage/installations?${queryString(filters)}`);
}

export async function getFitnessModelCalls(filters: UsageFilters) {
    return authFetchApi(`${backendUrl}/admin/usage/model-calls?${queryString(filters)}`);
}

export async function getFitnessOverview() {
    return authFetchApi(`${backendUrl}/admin/usage/overview`);
}
