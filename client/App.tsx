import { NavigationContainer } from "@react-navigation/native";
import { useEffect } from "react";
import { NotesProvider } from "./context/NotesContext";
import { RootNavigator } from "./routes/RootNavigator";
import { requestNotificationPermissions } from "./utils/notifications";

export default function App() {
  useEffect(() => {
    // Request notification permissions on app start
    requestNotificationPermissions();
  }, []);

  return (
    <NotesProvider>
      <NavigationContainer>
        <RootNavigator />
      </NavigationContainer>
    </NotesProvider>
  );
}
