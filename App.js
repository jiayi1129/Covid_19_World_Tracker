import React from "react";
import { StyleSheet, Text, View, Platform, StatusBar, Dimensions } from "react-native";
import MainScreen from "./app/screens/MainScreen";
import SearchScreen from "./app/screens/SearchScreen";
import colors from "./app/config/colors"
import Navigator from './app/routes/MainStack';

export default function App() {
	return (
		Navigator()
	);
}
