// src/utils/hooks/useAdminFileUpload.js
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { uploadAdminResourceFile } from '../api/admin';

export const useAdminFileUpload = (resource) => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: (file) => uploadAdminResourceFile({ resource, file }),
        onSuccess: () => {
            // After a successful upload, refetch the list for that resource
            queryClient.invalidateQueries({ queryKey: ['admin', resource] });
            alert('File uploaded and data updated successfully!');
        },
        onError: (error) => {
            alert(`Upload failed: ${error.response?.data?.error || error.message}`);
        }
    });
};