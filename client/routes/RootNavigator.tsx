import React from "react";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import CalendarScreen from "../screens/CalendarScreen";
import NotesScreen from "../screens/NotesScreen";

export interface RootStackParamList {
  Calendar: undefined;
  Notes: { date: string };
  [key: string]: any;
}

const Stack = createNativeStackNavigator<RootStackParamList>();

export const RootNavigator = () => {
  return (
    <Stack.Navigator
      screenOptions={{
        headerBackTitle: "Back",
        headerTitleStyle: {
          fontSize: 18,
          fontWeight: "600",
        },
      }}
    >
      <Stack.Screen
        name="Calendar"
        component={CalendarScreen}
        options={{
          headerShown: false,
        }}
      />
      <Stack.Screen
        name="Notes"
        component={NotesScreen}
        options={{
          headerBackTitle: "Back",
        }}
      />
    </Stack.Navigator>
  );
};
