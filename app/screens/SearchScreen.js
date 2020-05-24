import React, { useState, useEffect } from 'react';
import { View, Text, Image, StyleSheet, TouchableHighlight, TouchableOpacity, ScrollView, Dimensions, Platform, StatusBar, AsyncStorage, SafeAreaView } from 'react-native'
import { Card, ListItem, Button, SearchBar } from 'react-native-elements'
import Flag from 'react-native-flags';
import countries from '../constants/countries'
import colors from "../config/colors"
import { FlatList } from 'react-native-gesture-handler';
import Icon from 'react-native-vector-icons/FontAwesome';

function SearchScreen({ navigation }) {
    const _retrieveData = async () => {
		try {
          const value = await AsyncStorage.getItem('theme');
		  return value;
		} catch (error) {
		  // Error retrieving data
		}
	};
    const [isEnabled, setIsEnabled] = useState();

    useEffect(function effectFunction(){
        _retrieveData().then(value => {
            setIsEnabled(value == "true")
        })
    })

    const [state, setState] = useState({
		search: "",
	});

	const updateSearch = (search) => {
		setState((searchPrev) => {
			return { search };
        });
        setCountry((prevCountry) => {
            let list = []
            for (let u of countries.countries){
                if (u.name.toUpperCase().includes(search.toUpperCase())){
                    list.push(u);
                }
            }
            if (!list.length){
                list.push({name: "No Results Found", code: ""})
            }
            return list;
        })
	};

	const { search } = state;

    const [country, setCountry] = useState(countries.countries);

    return (
        <SafeAreaView style={[styles.container, isEnabled ? {backgroundColor: "black"} : null]}>
            <SearchBar
				placeholder="Search Countries..."
				onChangeText={updateSearch}
				value={search}
				lightTheme={isEnabled ? false : true}
			/>
            <View style={styles.flatListContainer}>
                <FlatList
                    keyExtractor={(item) => item.code}
                    data={country}
                    renderItem = {({ item }) => (
                        <TouchableOpacity onPress={() => {navigation.navigate('Main', item)}}>
                        <View style={styles.cardView}>
                            {
                                item.code == 'GLOBAL' ? 
                                <Image style={styles.earthImg} source={require('../../assets/earthLogo.png') } />
                                :
                                <Flag
                                code={item.code}
                                size={48}
                                />
                            }
                            <Text style={styles.name}>{item.name}</Text>
                        </View>
                        </TouchableOpacity>
                    )}
                />
            </View>
            <View style={styles.icon}>
                <TouchableOpacity onPress={() => {navigation.navigate('Main')}}>
                    <View style={[styles.iconContainer, isEnabled ? {backgroundColor: "black"} : null ]}>
                        <Icon name="home" size={60} color="#900" />
                    </View>
                </TouchableOpacity>
			</View>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    cardView: {
        flexDirection: "row",
        // borderBottomColor: "grey",
        // borderBottomWidth: 1,
        paddingTop: 10,
        paddingBottom: 10,
        backgroundColor: "white",
        width: Dimensions.get('window').width,
        paddingLeft: 20,
        borderRadius: 10,
        marginTop: 10,
    },
    container: {
        paddingTop: Platform.OS === "android" ? StatusBar.currentHeight : 0,
        minHeight: Dimensions.get('window').height,
        backgroundColor: colors.backgroundColor,
	},
    earthImg: {
        width: 50,
        height: 50,
        borderRadius: 25,
    },
    flatListContainer: {
        alignItems: "center"
    },
    icon: {
        position: "absolute",
        top: Dimensions.get('window').height - 100,
        right: 20,
    },
    iconContainer: {
		height: 100,
		width: 100,
		borderRadius: 50,
		backgroundColor: colors.backgroundColor,
		justifyContent: "center",
        alignItems: "center",
	},
    name: {
        paddingLeft: 60,
        fontSize: 20,
        alignItems: "center",
        justifyContent: "center",
        paddingTop: 10,
        width: '80%'
    }
})

export default SearchScreen;