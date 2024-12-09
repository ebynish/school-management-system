import { useCallback } from 'react';
import { useNavigate } from 'react-router-dom'; // Ensure you have react-router-dom installed
import useApi from './useApi'; // Adjust the path as needed

const useDynamicActions = (url) => {
    const navigate = useNavigate(); // Hook to get access to the navigation function
    const api = useApi; // Store useApi at the top level

    // Handle View Action
    const handleView = useCallback((row) => {
        console.log("View clicked for", row);
        navigate(`view/${row?._id}`); // Redirect to the view page
    }, [url, navigate]);

    // Handle Edit Action
    const handleEdit = useCallback((row) => {
        console.log("Edit clicked for", row);
        navigate(`edit/${row?._id}`); // Redirect to the edit page
    }, [url, navigate]);

    // Handle Delete Action
    const handleDelete = useCallback(async (row) => {
        console.log("Delete clicked for", row);
        try {
            const response = await api(`${url}/delete/${row.id}`, { method: 'DELETE' });
            if (response.success) {
                console.log("Delete successful", response.data);
                // Optionally, you can add logic to refresh the data or show a notification
            } else {
                console.error("Delete failed", response.error);
            }
        } catch (error) {
            console.error("An error occurred while deleting:", error);
        }
    }, [url, api]);

    // Handle Disable Action
    const handleDisable = useCallback(async (row) => {
        console.log("Disable clicked for", row);
        try {
            const response = await api(`${url}/disable/${row.id}`, { method: 'PATCH' }); // Assuming PATCH for disabling
            if (response.success) {
                console.log("Disable successful", response.data);
                // Optionally, you can add logic to refresh the data or show a notification
            } else {
                console.error("Disable failed", response.error);
            }
        } catch (error) {
            console.error("An error occurred while disabling:", error);
        }
    }, [url, api]);

    return {
        handleView,
        handleEdit,
        handleDelete,
        handleDisable, // Return the new action
    };
};

export default useDynamicActions;
