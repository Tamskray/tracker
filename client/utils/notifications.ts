import * as Notifications from "expo-notifications";

// Set the notification handler
Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldPlaySound: true,
    shouldSetBadge: true,
    shouldShowBanner: true,
    shouldShowList: true,
  }),
});

export const sendTestNotification = async () => {
  try {
    await Notifications.scheduleNotificationAsync({
      content: {
        title: "Test Notification 🎯",
        body: "This is a test push notification from Exercise Tracker!",
        data: { notificationType: "test" },
      },
      trigger: null, // Send immediately
    });
  } catch (error) {
    console.error("Error sending notification:", error);
  }
};

export const requestNotificationPermissions = async () => {
  try {
    const { status } = await Notifications.requestPermissionsAsync();
    return status === "granted";
  } catch (error) {
    console.error("Error requesting notification permissions:", error);
    return false;
  }
};
