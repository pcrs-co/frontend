import api from "../api";

const getResourceUrl = (resource) => `admin/${resource}`;

// Generic GET all items for a resource
export const fetchAdminResource = async (resource, params = {}) => {
    // resource is just "customers", "vendors", etc.
    // params is an object like { page: 1 }
    const { data } = await api.get(`/admin/${resource}/`, { params });
    return data;
};

// Generic CREATE an item for a resource
export const createAdminResource = async ({ resource, payload }) => {
    const { data } = await api.post(`/${getResourceUrl(resource)}/`, payload);
    return data;
};

// Generic UPDATE an item for a resource
export const updateAdminResource = async ({ resource, id, payload }) => {
    const { data } = await api.patch(`/${getResourceUrl(resource)}/${id}/`, payload);
    return data;
};

// Generic DELETE an item for a resource
export const deleteAdminResource = async ({ resource, id }) => {
    await api.delete(`/${getResourceUrl(resource)}/${id}/`);
};

// NEW function for file uploads
export const uploadAdminResourceFile = async ({ resource, file }) => {
    const formData = new FormData();
    formData.append('file', file);

    // When sending FormData, let the browser set the Content-Type header.
    // We do this by creating a specific config for this request.
    const { data } = await api.post(
        `/admin/${resource}/upload/`,
        formData,
        {
            headers: {
                'Content-Type': 'multipart/form-data',
            },
        }
    );
    return data;
}

