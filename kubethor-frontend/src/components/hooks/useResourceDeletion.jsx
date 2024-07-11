const useResourceDeletion = (
  apiDeleteResource,
  showAlertNotificationDisplay
) => {
  const handleDeleteResource = async (
    resourceType,
    namespaceName,
    resourceName
  ) => {
    const confirmed = window.confirm(
      "Are you sure you want to delete " + resourceName + "?"
    );
    if (!confirmed) {
      return;
    }
    try {
      const response = await apiDeleteResource(
        resourceType,
        namespaceName,
        resourceName
      );

      if (response.status === 200) {
        showAlertNotificationDisplay(
          "Resource: " + resourceName + " deleted successfully"
        );
      } else {
        showAlertNotificationDisplay(
          "Failed to delete resource: " + resourceName
        );
      }
    } catch (error) {
      showAlertNotificationDisplay(
        "An error occurred while deleting the resource"
      );
    }
  };

  return handleDeleteResource;
};

export default useResourceDeletion;
