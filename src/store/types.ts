export type GetCollectionsFilter = {
    count: number;
    after?: string;
    title?: string;
};
export type Collection = {
    handle: string;
    title: string;
    description: string;
};
export type CollectionsState = {
    list: Collection[];
    hasMore: boolean;
    after: string | null;
    isLoading: boolean;
};
export type OauthServiceResponse = {
    status: 'success' | 'error';
    message?: string;
};
