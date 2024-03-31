import { QueryClient } from '@tanstack/react-query';
import { Mutations, Queries } from '../query-client';
import { processResponse } from '../../../utils/query';

function Foo() {
    return fetch('/api/products/sync', {
        method: 'get',
    }).then(processResponse);
}

export function addShopifyMutations(queryClient: QueryClient) {
    queryClient.setMutationDefaults([Mutations.FOO], {
        mutationFn: Foo,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: [Queries.FOO] });
        },
    });
}
