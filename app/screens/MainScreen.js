import React, { useState } from "react";
import { View, Text } from "react-native";
import { SearchBar } from "react-native-elements";
import Pie from "react-native-pie";

function MainScreen(props) {
	const [state, setState] = useState({
		search: "",
	});

	const updateSearch = (search) => {
		setState((searchPrev) => {
			console.log({ search });
			return { search };
		});
	};

	const { search } = state;

	return (
		<View>
			<SearchBar
				placeholder="Search Countries..."
				onChangeText={updateSearch}
				value={search}
				lightTheme={true}
			/>
			{/* <Pie
				radius={2}
				sections={[
					{
						percentage: 10,
						color: "#C70039",
					},
					{
						percentage: 20,
						color: "#44CD40",
					},
					{
						percentage: 30,
						color: "#404FCD",
					},
					{
						percentage: 40,
						color: "#EBD22F",
					},
				]}
			/> */}
		</View>
	);
}

export default MainScreen;
