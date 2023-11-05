import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { AdminProvider } from "./admin/AdminContext";
import Login from "./client/screens/Login";
import Signup from "./client/screens/Signup";

import ClientHome from "./client/screens/Home";

import AdminHome from "./admin/screens/Home";
import AdminUsers from "./admin/screens/Users";
import AdminDonations from "./admin/screens/Donations";
import AdminCenters from "./admin/screens/Centers";
import AdminCampaigns from "./admin/screens/Campaigns";

const Stack = createNativeStackNavigator();

export default function App() {
  return (
    <NavigationContainer>
      <AdminProvider>
        <Stack.Navigator initialRouteName="Signup">
          <Stack.Screen
            name="Login"
            component={Login}
            options={{ headerShown: false }}
          />
          <Stack.Screen
            name="Signup"
            component={Signup}
            options={{ headerShown: false }}
          />
          <Stack.Screen
            name="AdminHome"
            component={AdminHome}
            options={{ headerShown: false }}
          />
          <Stack.Screen
            name="ClientHome"
            component={ClientHome}
            options={{ headerShown: false }}
          />
          <Stack.Screen
            name="AdminUsers"
            component={AdminUsers}
            options={{ headerShown: false }}
          />
          <Stack.Screen
            name="AdminDonations"
            component={AdminDonations}
            options={{ headerShown: false }}
          />
          <Stack.Screen
            name="AdminCenters"
            component={AdminCenters}
            options={{ headerShown: false }}
          />
          <Stack.Screen
            name="AdminCampaigns"
            component={AdminCampaigns}
            options={{ headerShown: false }}
          />
        </Stack.Navigator>
      </AdminProvider>
    </NavigationContainer>
  );
}
