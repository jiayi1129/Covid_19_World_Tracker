import React, { useState, useEffect } from "react";
import { View, Text, StyleSheet, Button, Image, ScrollView, TouchableOpacity, Dimensions, Platform, StatusBar, ActivityIndicator, Switch, AsyncStorage, SafeAreaView } from "react-native";
import { SearchBar } from "react-native-elements";
import PieChart from 'react-native-pie-chart';
import { SimpleCard, Card } from "@paraboly/react-native-card";
import colors from "../config/colors"
import Icon from 'react-native-vector-icons/FontAwesome';
import Flag from 'react-native-flags';
import { VictoryPie } from 'victory-native';
import Svg, { Circle } from 'react-native-svg'

function MainScreen({ route, navigation }) {

	var code = 'GLOBAL'
	var name = 'Global'

	if (route){
		code = route.params.code;
		name = route.params.name;
	}

	const pressHandler = () => {
		navigation.navigate('Search')
	}

	const _storeData = async (data) => {
		try {
		  await AsyncStorage.setItem(
			'theme',
			data.toString(),
		  );
		} catch (error) {
		  // Error saving data
		}
	};

	const _retrieveData = async () => {
		try {
		  const value = await AsyncStorage.getItem('theme');
		  return value;
		} catch (error) {
		  // Error retrieving data
		}
	};

	const [isEnabled, setIsEnabled] = useState();

 	const toggleSwitch = () => {
		setIsEnabled(previousState => !previousState);
		_storeData(!isEnabled)
	}
	const [loading, setLoading] = useState(true);

	const [found, setFound] = useState(true);

	const [list, setList] = useState([]);

	const [data, setData] = useState({
		total_cases: '0',
		total_recovered: '0',
		total_active_cases: '0',
		total_deaths: '0',
		total_new_cases_today: '0',
		total_new_deaths_today: '0',
		total_danger_rank: '0',
	});

	useEffect(function effectFunction(){
		async function fetchData(){
			try{
				setLoading(true);
				let url;
				code == 'GLOBAL' ? url = 'https://thevirustracker.com/free-api?global=stats' : url = 'https://thevirustracker.com/free-api?countryTotal=' + code;
				let response = await fetch(url);
				let json = await response.json();
				if (json.results && json.results[0].data == 'none'){
					setFound(false);
					setList([]);
					setData({
						total_cases: '-',
						total_recovered: '-',
						total_active_cases: '-',
						total_deaths: '-',
						total_new_cases_today: '-',
						total_new_deaths_today: '-',
						total_danger_rank: '-',
					});
					setLoading(false);
					return;
				}
				let data;
				code == 'GLOBAL' ? data = json.results[0] : data = json.countrydata[0];
				delete data.source;
				delete data.info;
				let list = [
					{ x: "Total Cases", y: data.total_cases }, 
					{ x: "Active Cases", y: data.total_active_cases }, 
					{ x: "Total Recovered", y: data.total_recovered }, 
					{ x: "Total Deaths", y: data.total_deaths }, 
					{ x: "New Cases", y: data.total_new_cases_today }, 
					{ x: "New Deaths", y: data.total_new_deaths_today },
				]
				
				for (let u of Object.keys(data)){
					data[u] = data[u].toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",")
				}
				
				setFound(true);
				setList(list)
				setData({
					total_cases: data.total_cases,
					total_recovered: data.total_recovered,
					total_active_cases: data.total_active_cases,
					total_deaths: data.total_deaths,
					total_new_cases_today: data.total_new_cases_today,
					total_new_deaths_today: data.total_new_deaths_today,
					total_danger_rank: data.total_danger_rank,
				})
				setLoading(false);
			} catch (error) {
				console.error(error);
			}
		}
		// check if async storage has this value before, if not create and store true

		_retrieveData().then(value => {
			setIsEnabled(value == "true")
			if (!value){
				_storeData(false);
			}
		})
		fetchData();
	}, [code, name])

	return (
		<View style={[styles.container, isEnabled ? {backgroundColor: "black"} : null]}>
			<ScrollView>
				<SafeAreaView style={styles.header}>
					<Text style={[styles.headerFont, isEnabled ? {color: "white"} : null]}>{ code == 'GLOBAL' ? "Global" : name}</Text>
					{ code == 'GLOBAL' ? 
					<Image style={styles.earthImg} source={require('../../assets/earthLogo.png') } />
					:  
					<Flag
					code={code}
					size={48}
					/> }
				</SafeAreaView>
				<SafeAreaView style={styles.switch}>
					<Switch
						trackColor={{ false: "#767577", true: "#81b0ff" }}
						thumbColor={isEnabled ? "#f5dd4b" : "#f4f3f4"}
						ios_backgroundColor="#3e3e3e"
						onValueChange={toggleSwitch}
						value={isEnabled}
					/>
				</SafeAreaView>
				{loading ? 
				<SafeAreaView style={styles.loadingView}>
					<ActivityIndicator size="large" color="#0000ff" />
				</SafeAreaView>
				:
				<View style={styles.pieChartContainer}>
					<View style={styles.covidBackground} />
					<Image style={styles.covidLogo} source={require('../../assets/covid19logo.jpg')} />
					<VictoryPie
						labels={() => null}
						width={350} height={350}
						innerRadius={90}
						data={list}
						colorScale={[colors.total_cases, colors.total_active_cases, colors.total_recovered, colors.total_deaths, colors.total_new_cases_today, colors.total_new_deaths_today]}
					/>
				</View>
				}
				{!found ?
				<SafeAreaView style={styles.noResultsContainer}>
					<Text style={styles.noResultsFont}>No Results Found</Text>
				</SafeAreaView>: null}

				{ code != 'GLOBAL' ?
				<View style={styles.card}>
					<SimpleCard
						title={data.total_danger_rank + '\nDanger Rank'}
						backgroundColor={colors.total_danger_rank}
						styles={{ width: '45%' }}
						titleTextColor="#fff"
						titleFontSize={20}
					/>
				</View>
				: null}
				<View style={styles.card}>
					<SimpleCard
						title={data.total_cases + '\nTotal Cases'}
						backgroundColor={colors.total_cases}
						styles={{ width: '45%' }}
						titleTextColor="#fff"
						titleFontSize={20}
					/>
					<SimpleCard
						title={data.total_active_cases + '\nActive Cases'}
						backgroundColor={colors.total_active_cases}
						styles={{ width: '45%' }}
						titleTextColor="#fff"
						titleFontSize={20}
					/>
				</View>
				<View style={styles.card}>
					<SimpleCard
						title={data.total_recovered + "\nTotal Recovered"}
						backgroundColor={colors.total_recovered}
						styles={{ width: '45%' }}
						titleTextColor="#fff"
						titleFontSize={20}
					/>
					<SimpleCard
						title={data.total_deaths + "\nTotal Deaths"}
						backgroundColor={colors.total_deaths}
						styles={{ width: '45%' }}
						titleTextColor="#fff"
						titleFontSize={20}
					/>
				</View>
				<View style={[styles.card , {paddingBottom: 0}]}>
					<SimpleCard
						title={data.total_new_cases_today + "\nNew Cases"}
						backgroundColor={colors.total_new_cases_today}
						styles={{ width: '45%' }}
						titleTextColor="#fff"
						titleFontSize={20}
					/>
					<SimpleCard
						title={data.total_new_deaths_today + "\nNew Deaths"}
						backgroundColor={colors.total_new_deaths_today}
						styles={{ width: '45%' }}
						titleTextColor="#fff"
						titleFontSize={20}
					/>
				</View>
				<View style={styles.icon}>
					<TouchableOpacity onPress={pressHandler}>
						<View style={styles.iconContainer}>
							<Icon name="rocket" size={60} color="#900" />
						</View>
					</TouchableOpacity>
				</View>
			</ScrollView>
		</View>
	);
}

const styles = StyleSheet.create({
	card: {
		paddingBottom: 30,
		flexDirection: "row",
		justifyContent: "space-around",
	},
	container: {
		paddingTop: Platform.OS === "android" ? StatusBar.currentHeight : 20,
		backgroundColor: colors.backgroundColor,
		minHeight: Dimensions.get('window').height,
	},
	covidLogo: {
		width: 150,
		height: 150,
		position: "absolute",
		borderRadius: 75,
	},
	covidBackground: {
		width: 220,
		height: 220,
		position: "absolute",
		borderRadius: 110,
		backgroundColor: "white",
	},
	earthImg: {
        width: 50,
		height: 50,
		borderRadius: 25,
    },
	header: {
		flexDirection: "row",
		alignItems: "center",
		marginTop: 20,
		width: '60%',
	},
	headerFont: {
		fontSize: 25,
		fontWeight: "bold",
		paddingRight: 10,
		paddingLeft: 20,
		color: colors.headerFont,
	},
	icon: {
		flexDirection: "row",
		justifyContent: "flex-end",
		paddingRight: 30,
		paddingTop: 30,
		paddingBottom: 30,
	},
	iconContainer: {
		height: 100,
		width: 100,
		borderRadius: 50,
		borderColor: "white",
		backgroundColor: "white",
		borderWidth: 1,
		justifyContent: "center",
		alignItems: "center"
	},
	loadingView: {
		minHeight: 350,
		justifyContent: "center",
		alignItems: "center",
	},
	noResultsContainer: {
		justifyContent: "center",
		alignItems: "center",
		backgroundColor: '#d44950',
		height: 50,
		marginBottom: 30,
	},
	noResultsFont: {
		fontSize: 20,
		color: "white",
	},
	pieChartContainer: {
		alignItems: "center",
		justifyContent: "center",
	},
	switch: {
		position: "absolute",
		top: Platform.OS === "android" ? StatusBar.currentHeight : 30,
		right: 20,
	}
})

export default MainScreen;
