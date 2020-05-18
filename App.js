import React from "react";
import { StyleSheet, Text, View, Platform, StatusBar } from "react-native";
import MainScreen from "./app/screens/MainScreen";

export default function App() {
	return (
		<View style={styles.container}>
			<MainScreen />
		</View>
	);
}

const styles = StyleSheet.create({
	container: {
		paddingTop: Platform.OS === "android" ? StatusBar.currentHeight : 0,
	},
});
