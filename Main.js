import React, { Component } from 'react';

import { View ,Text} from 'react-native';
import { PanGestureHandler, RotationGestureHandler,State } from 'react-native-gesture-handler';
import { Provider as PaperProvider,Title,Caption } from 'react-native-paper';
import { NavigationContainer} from '@react-navigation/native';
import { createStackNavigator,HeaderBackButton } from '@react-navigation/stack';
import DataService from './DataService.js';
import {Interface} from './Interface.js';
import Scenario from './Scenario.js';
import FactionList from './FactionList.js';
import {Deployed} from './Deployed.js';

import {Manage} from './Manage.js';
import {Info} from './Info.js';
import {HeroInfo} from './HeroInfo.js';

import {Employ} from './Employ.js';
import Build from './Build.js';
import Assign from './Assign.js';
import Equip from './Equip.js';
import Exchange from './Exchange.js';

import {Trade} from './Trade.js';
import {Group} from './Group.js';
import {SelectUnit} from './SelectUnit.js';


import {Building} from './Building.js';



import cityStore from './CityContext.js';
import { Provider } from 'mobx-react';
import mainStore from './MainContext.js';

const Stack = createStackNavigator();


export default class Main extends Component{

	constructor(){
		super();
		this.scene = React.createRef();

	     this.state = {
              selectedCity:{}
         };
		    
	}
	
	componentDidMount(){
		
		
	}
	
	
	
	render(){
		return  <PaperProvider>
                <NavigationContainer>
                    <Stack.Navigator initialRouteName="Home">
                        <Stack.Screen name="Home" component={Interface} options={{ headerStyle: {height: 0},title:''}} onLoad={this.onLoad}/>
                        <Stack.Screen name="Scenario" component={Scenario} options={{ title:'Select Scenario'}}/>
                        <Stack.Screen name="FactionList" component={FactionList} options={{ title:'Select Faction'}}/>
                        <Stack.Screen name="Deployed" component={Deployed} options={{ title:'Deployed Units'}}/>

                        <Stack.Screen name="Manage" component={Manage}
                                options={({ route }) => ({
                                    headerTitle: props =>
                                        <View style={{flexDirection:'row'}}>
                                            <Text style={{fontSize:18}}> {route.params.city.name} </Text>
                                            <Caption style={{position: 'relative',top: 2}}> {route.params.city.originalName}</Caption>
                                        </View>}
                                )}
                         />
                        <Stack.Screen name="Info" component={Info}
                                options={({ route }) => ({
                                    headerTitle: props =>
                                        <View style={{flexDirection:'row'}}>
                                            <Text style={{fontSize:18}}> {route.params.city.name} </Text>
                                            <Caption style={{position: 'relative',top: 2}}> {route.params.city.originalName}</Caption>
                                        </View>}
                                )}
                        />
                         <Stack.Screen name="HeroInfo" component={HeroInfo} options={({ route }) => ({ title: route.params.hero.name })}/>
                        <Stack.Screen name="Employ" component={Employ} options={{ title:'Add Unit'}}/>
                        <Stack.Screen name="Build" component={Build} options={{ title:'Build'}}/>
                        <Stack.Screen name="Assign" component={Assign} options={{ title:'Assign'}}/>
                        <Stack.Screen name="Equip" component={Equip}
                            options={({ navigation, route }) => ({
                                 title:'Inventory',
                                headerLeft: (props) => (
                                    <HeaderBackButton
                                      {...props}
                                      onPress={() => {
                                        mainStore.resume();
                                        navigation.goBack()
                                      }}
                                    />
                                  )})
                            }  />
                        <Stack.Screen name="Exchange" component={Exchange} options={{ title:'Exchange'}}/>
                        <Stack.Screen name="BuildingDetail" component={Building} options={({ route }) => ({ title: route.params.building.name })}/>
                        <Stack.Screen name="Trade" component={Trade}
                                options={({ navigation, route }) => ({
                                     title:'Trade',
                                    headerLeft: (props) => (
                                        <HeaderBackButton
                                          {...props}
                                          onPress={() => {
                                            mainStore.resume();
                                            navigation.goBack()
                                          }}
                                        />
                                      )})
                                }
                        />
                        <Stack.Screen name="Group" component={Group}
                            options={({ navigation, route }) => ({
                                 title:'Group',
                                headerLeft: (props) => (
                                    <HeaderBackButton
                                      {...props}
                                      onPress={() => {
                                        mainStore.resume();
                                        navigation.goBack()
                                      }}
                                    />
                                  )})
                            }
                        />
                        <Stack.Screen name="SelectUnit" component={SelectUnit} options={{ title:'Select Unit'}} />

                     </Stack.Navigator>
                </NavigationContainer>
            </PaperProvider>
	}
	
}