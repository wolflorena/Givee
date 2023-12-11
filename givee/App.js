import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { AdminProvider } from "./admin/AdminContext";
import { LoginProvider } from "./client/LoginContext";
import Login from "./client/screens/Login";
import Signup from "./client/screens/Signup";
import Clothes from "./client/screens/Clothes";
import Food from "./client/screens/Food";
import Toys from "./client/screens/Toys";
import Profile from "./client/screens/Profile";
import History from "./client/screens/History";
import AdminHome from "./admin/screens/Home";
import AdminUsers from "./admin/screens/Users";
import AdminDonations from "./admin/screens/Donations";
import AdminCenters from "./admin/screens/Centers";
import AdminCampaigns from "./admin/screens/Campaigns";
import CenterData from "./admin/CenterData";
import CenterForm from "./admin/CenterForm";
import CampaignForm from "./admin/CampaignForm";
import DonationData from "./admin/DonationData";
import CampaignData from "./admin/CampaignData";
import Home from "./client/screens/Home";
import SuccessfulDonation from "./client/screens/SuccessfulDonation";
import Location from "./client/screens/Location";
import EditCenter from "./admin/EditCenter";
import EditCampaign from "./admin/EditCampaign";
import AboutUs from "./client/screens/AboutUs";
import ChangePassword from "./client/screens/ChangePassword";

const Stack = createNativeStackNavigator();

export default function App() {
  return (
    <NavigationContainer>
      <AdminProvider>
        <LoginProvider>
          <Stack.Navigator initialRouteName="ChangePassword">
            <Stack.Screen
              name="Login"
              component={Login}
              options={{ headerShown: false }}
            />
            <Stack.Screen
              name="ChangePassword"
              component={ChangePassword}
              options={{ headerShown: false }}
            />
            <Stack.Screen
              name="Signup"
              component={Signup}
              options={{ headerShown: false }}
            />
            <Stack.Screen
              name="Home"
              component={Home}
              options={{ headerShown: false }}
            />
            <Stack.Screen
              name="Clothes"
              component={Clothes}
              options={{ headerShown: false }}
            />
            <Stack.Screen
              name="Food"
              component={Food}
              options={{ headerShown: false }}
            />
            <Stack.Screen
              name="Toys"
              component={Toys}
              options={{ headerShown: false }}
            />
            <Stack.Screen
              name="Profile"
              component={Profile}
              options={{ headerShown: false }}
            />
            <Stack.Screen
              name="History"
              component={History}
              options={{ headerShown: false }}
            />
            <Stack.Screen
              name="AboutUs"
              component={AboutUs}
              options={{ headerShown: false }}
            />
            <Stack.Screen
              name="Location"
              component={Location}
              options={{ headerShown: false }}
            />
            <Stack.Screen
              name="SuccessfulDonation"
              component={SuccessfulDonation}
              options={{ headerShown: false }}
            />
            <Stack.Screen
              name="AdminHome"
              component={AdminHome}
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
            <Stack.Screen
              name="CenterData"
              component={CenterData}
              options={{ headerShown: false }}
            />
            <Stack.Screen
              name="CenterForm"
              component={CenterForm}
              options={{ headerShown: false }}
            />
            <Stack.Screen
              name="CampaignForm"
              component={CampaignForm}
              options={{ headerShown: false }}
            />
            <Stack.Screen
              name="DonationData"
              component={DonationData}
              options={{ headerShown: false }}
            />
            <Stack.Screen
              name="CampaignData"
              component={CampaignData}
              options={{ headerShown: false }}
            />
            <Stack.Screen
              name="EditCenter"
              component={EditCenter}
              options={{ headerShown: false }}
            />
            <Stack.Screen
              name="EditCampaign"
              component={EditCampaign}
              options={{ headerShown: false }}
            />
          </Stack.Navigator>
        </LoginProvider>
      </AdminProvider>
    </NavigationContainer>
  );
}
