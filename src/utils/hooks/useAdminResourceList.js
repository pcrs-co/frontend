import { useQuery } from '@tanstack/react-query';
import { fetchAdminResource } from '../api/admin';

// This one hook can fetch ANY admin resource list.
export const useAdminResourceList = (resource) => {
    return useQuery({
        // The key is now dynamic, e.g., ['admin', 'cpu-benchmarks']
        queryKey: ['admin', resource],
        queryFn: () => fetchAdminResource(resource),
        enabled: !!resource, // The query will not run until a resource name is provided
    });
};