import { NavigationContainer } from "@react-navigation/native";
import { createStackNavigator } from "@react-navigation/stack";
import { FC } from "react";
import { StyleSheet, View } from "react-native";

import { ScreenEmpty, ScreenEmptyParams } from "./Common/ScreenEmpty";
import { ScreenEvent, ScreenEventParams } from "./Events/ScreenEvent";
import { ScreenAreas, ScreenAreasParams } from "./ScreenAreas";

/**
 * Available routes.
 */
export type ScreenStartNavigatorParamsList = {
    /**
     * Primary areas.
     */
    Areas: ScreenAreasParams;

    /**
     * Detail screen for events.
     */
    Event: ScreenEventParams;

    /**
     * About page.
     */
    About: ScreenEmptyParams;
};

const ScreenStartNavigator = createStackNavigator<ScreenStartNavigatorParamsList>();

/**
 * The properties to the screen as a component.
 */
export type ScreenStartProps = object;

export const ScreenStart: FC<ScreenStartProps> = () => {
    return (
        <NavigationContainer>
            <View style={StyleSheet.absoluteFill}>
                <ScreenStartNavigator.Navigator screenOptions={{ headerShown: false }}>
                    <ScreenStartNavigator.Screen name="Areas" component={ScreenAreas} />
                    <ScreenStartNavigator.Screen name="Event" component={ScreenEvent} />
                    <ScreenStartNavigator.Screen name="About" component={ScreenEmpty} />
                </ScreenStartNavigator.Navigator>
            </View>
        </NavigationContainer>
    );
};
