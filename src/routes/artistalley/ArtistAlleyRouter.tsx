import { BottomTabScreenProps } from "@react-navigation/bottom-tabs";
import { CompositeScreenProps } from "@react-navigation/core";
import { createMaterialTopTabNavigator, MaterialTopTabScreenProps } from "@react-navigation/material-top-tabs";
import { NavigatorScreenParams } from "@react-navigation/native";
import { StackScreenProps } from "@react-navigation/stack";
import { FC, useMemo } from "react";
import { useTranslation } from "react-i18next";
import { StyleSheet, useWindowDimensions, View } from "react-native";
import { useTabStyles } from "../../components/generic/nav/useTabStyles";
import { AreasRouterParamsList } from "../AreasRouter";
import { IndexRouterParamsList } from "../IndexRouter";
import { TabLabel } from "../../components/generic/atoms/TabLabel";
import { ArtistAlleyList, ArtistAlleyListParams } from "./ArtistAlleyList";

/**
 * Available routes.
 */
export type ArtistAlleyRouterParamsList = {
    List: ArtistAlleyListParams;
};

/**
 * Create an instance of the top tabs with the provided routes.
 */
const Tab = createMaterialTopTabNavigator<ArtistAlleyRouterParamsList>();

/**
 * Params handled by the screen in route. Delegated parameters for the days. TODO: Verify.
 */
export type ArtistAlleyRouterParams = NavigatorScreenParams<ArtistAlleyRouterParamsList>;

/**
 * The properties to the screen as a component.
 */
export type ArtistAlleyRouterProps =
    // Route carrying from area screen at "ArtistAlley", own navigation via own parameter list.
    CompositeScreenProps<
        BottomTabScreenProps<AreasRouterParamsList, "ArtistAlley">,
        MaterialTopTabScreenProps<ArtistAlleyRouterParamsList> & BottomTabScreenProps<AreasRouterParamsList> & StackScreenProps<IndexRouterParamsList>
    >;

/**
 * Controls and provides routing to artist alley lists. Artist alley items are pushed via the index router.
 * @constructor
 */
export const ArtistAlleyRouter: FC<ArtistAlleyRouterProps> = () => {
    const { t } = useTranslation("ArtistAlley");

    // // Get common tab styles.
    const tabStyles = useTabStyles();

    // Get window dimensions and use it to prevent initial shrinkage on the screens.
    const dimensions = useWindowDimensions();
    const layout = useMemo(() => ({ width: dimensions.width, height: dimensions.height }), [dimensions.height, dimensions.width]);
    const scene = useMemo(() => ({ width: dimensions.width, minHeight: dimensions.height - 200 }), [dimensions.height, dimensions.width]);

    const defaultScreens = useMemo(
        () => [<Tab.Screen key="list" name="List" options={{ title: t("list"), tabBarLabelStyle: tabStyles.normal }} component={ArtistAlleyList} />],
        [t, tabStyles.normal],
    );

    // If the screens require too much performance we should set detach to true again.
    return (
        <View style={StyleSheet.absoluteFill}>
            <Tab.Navigator
                initialRouteName="List"
                initialLayout={layout}
                sceneContainerStyle={scene}
                screenOptions={{
                    tabBarLabel: ({ focused, children }) => (
                        <TabLabel wide={false} focused={focused}>
                            {children}
                        </TabLabel>
                    ),
                }}
            >
                {defaultScreens}
            </Tab.Navigator>
        </View>
    );
};
