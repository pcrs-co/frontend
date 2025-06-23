// src/utils/hooks/useAdminResourceList.js
import { useQuery } from '@tanstack/react-query';
import { fetchAdminResource } from '../api/admin';

export const useAdminResourceList = (resource, page = 1) => {
    return useQuery({
        queryKey: ['admin', resource, page],
        queryFn: () => fetchAdminResource(resource, { page }), // Pass params as an object
        enabled: !!resource,
        keepPreviousData: true,
    });
};