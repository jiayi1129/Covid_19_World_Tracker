import { NavigationContainer } from '@react-navigation/native'
import { createStackNavigator } from '@react-navigation/stack'
import MainScreen from "../screens/MainScreen";
import SearchScreen from "../screens/SearchScreen";
import React from 'react'

const Stack = createStackNavigator()

export default function Navigator() {
    return (
      <NavigationContainer>
        <Stack.Navigator initialRouteName='Main' headerMode="none">
          <Stack.Screen name='Main' component={MainScreen} initialParams={{ code: 'GLOBAL', name: 'Global' }}/>
          <Stack.Screen name='Search' component={SearchScreen} />
        </Stack.Navigator>
      </NavigationContainer>
    );
  }