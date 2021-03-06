import React, { Component } from 'react';
import {  View,StyleSheet ,ScrollView,Text,TouchableOpacity  } from 'react-native';
import { Button ,Dialog,Modal,Portal ,Paragraph,List,IconButton,Caption,Subheading,Title,Divider ,Surface,Menu,TextInput } from 'react-native-paper';
import { FlatGrid } from 'react-native-super-grid';

import Popover from 'react-native-popover-view';

import Util from './Util.js';
import Icon from './Icon.js';
import Resource from './Resource.js';


import Unit from './Unit.js';
import UnitData from './UnitData.js';
import BuildingData from './BuildingData.js';

import ResourceRow from './ResourceRow.js';



import buildings from "./json/building.json"
import resources from './json/resource.json';

import mainStore from './MainContext.js';

const styles = StyleSheet.create({

	title:{
		fontSize:15,
	},
	electionTitle:{
		fontSize:15,
		padding:0,
		margin:0,
		position:'relative',
		left: -7
	},
	accordion:{
		margin:0,
		padding:0
	},
	election:{
		margin:0,
		paddingTop:4,
		paddingBottom:4,
	},
	sub:{
		marginLeft:12
	},
	faction:{
    	marginLeft:30
    },
	subTitle:{
		fontSize:13,
		padding:0,
		margin:0,
		position:'relative',
		left:-5
	},
	subIcon:{
		width:15,
		height:15
	},

    unit: {
        padding: 8,
         height: 60,
         width: 60,
        alignItems: 'center',
        justifyContent: 'center',
        elevation: 1,
        margin:2
     }
});


const Production = (props)=>{
    const production = props.data;
    const city = props.city;
    return <>
      <View style={{flexDirection:'row'}}>
        {props.index>0?<Paragraph>or </Paragraph>:null}
       {production.result=='happiness'?
       <ResourceRow prefix="Increase happiness " resource={production.result} suffix={(production.quantity/(city.population/1000)).toFixed(3)+'/'+production.delay+' days'}/>
       :<ResourceRow prefix={"Produce "+production.result} resource={production.result} suffix={Util.number(production.quantity)+'/'+production.delay+' days'}/>

       }
        </View>



       {production.cost&&props.showDetail?<>
           <Paragraph>Production consumes</Paragraph>
           {
               production.cost.map((cost,index)=>{
                   const resource = resources[cost.type];
                   return  <View style={{flexDirection:'row',marginLeft:7}}>
                        {cost.optional==true&&index!=0?<Paragraph>or </Paragraph>:null}
                       <Paragraph>{cost.type}  </Paragraph>
                       <Resource icon={resource.icon} color={resource.color}/>
                       <Paragraph>{Util.number(cost.quantity)}</Paragraph>
                   </View>
               })
           }
       </>:null
       }
   </>
}


export default class Build extends Component {

    constructor(){
		super();

	    this.state={
            visible :false,
            amount:1
        }
	}

	minus = () =>{
        this.setState({amount:--this.state.amount})
	}
	plus = () =>{
        this.setState({amount:++this.state.amount})
	}

    add = (building,amount)=>{

        const { unit } = this.props.route.params;
        const city = mainStore.selectedCity;

        city.build(unit,building);


        this.props.navigation.goBack();
       this.props.navigation.navigate('Building');
       // city.refreshBuildings();
    }

   action   = (unit,disabled) =>{

          const city = mainStore.selectedCity;
        const production = unit.production;
        const storage = unit.storage;

        return <>
            <View style={{maxWidth:280,padding:15}}>
                <Caption>{unit.description}</Caption>
                {production?
                    Array.isArray(production)?<>
                    {
                        production.map((p,index)=>{
                            return <Production data={p} city={city} index={index} showDetail={production.length<5}/>
                        })
                    }
                    </>:<Production data={production} city={city} index={0} showDetail={true}/>
                :null}
                {storage?<>
                    {storage.type=='resource'?
                    <Paragraph>Increase resource storage capacity by {Util.number(storage.quantity)} </Paragraph>
                    :<ResourceRow prefix={"Can hold "+storage.type} resource={storage.type} suffix={Util.number(storage.quantity)}/>
                    }
                </>:null}
                 {unit.defense?<ResourceRow prefix="Increase Defense" resource="defense" suffix={unit.defense}/>
                 :null
                 }
                {unit.cost?
                    Array.isArray(unit.cost)?<>
                    {
                        unit.cost.map(cost=>{
                            return <ResourceRow prefix={"Require "+cost.type} resource={cost.type} suffix={Util.number(cost.quantity)}/>
                        })
                    }
                 </>
                :<ResourceRow prefix={"Require "+unit.cost.type} resource={unit.cost.type} suffix={Util.number(unit.cost.quantity)}/>
                :null
                }
                {unit.require?<ResourceRow prefix="Require" resource={unit.require} suffix={resources[unit.require].name}/>
                 :null
                 }
            </View>
            {false?<View style={{flexDirection:'row',alignItems: 'center',justifyContent: 'center',padding:15}}>
                 <Button icon="minus" contentStyle={{marginLeft:12}} onPress={()=>this.minus()}/>{this.state.amount}
                 <Button icon="plus" contentStyle={{marginLeft:12}} onPress={()=>this.plus()}/>
             </View>
             :null}
            {disabled?null:<Button  onPress={()=>this.add(unit,1)}>Build</Button>}
             <View style={{width:'100%'}}>
                <Caption style={{textAlign:'center'}}>Takes {unit.delay} days</Caption>
            </View>
        </>
    }

	render(){

		const { unit } = this.props.route.params;
		 const city = mainStore.selectedCity;

		const arr = Object.keys(buildings).filter(key=>{
		    const building = buildings[key];

            const req = building.require;
            if(req){
                if(city.rareResources[req]==undefined) return false;
            }

            if(key=='wall'){
                if(city.buildings.wall.quantity>=city.getDefenseMax()) return false;
            }

            if(unit.data.action.build.includes(key)){
                return true;
            }else{
                return false;
            }
		});

		return <ScrollView contentContainerStyle={{ padding: 10 }}>
		<FlatGrid
                   itemDimension={mainStore.unitSize}
                   data={arr}

                   spacing={1}
                   renderItem={({ item }) => {
            		    const building = buildings[item];

                        let disabled = false;
                        const cost = building.cost;
                        if(cost){
                           if(Array.isArray(cost)){
                                cost.forEach(c=>{
                                    if(city.resources[c.type]< c.quantity || city.resources[c.type]==undefined) disabled=true;
                                })
                           }else{
                                if(city.resources[cost.type]< cost.quantity || city.resources[cost.type]==undefined) disabled=true;
                           }
                        }


                        return <Unit data={building}  action={()=>this.action(building,disabled)} disabled={disabled}/>
                   }}
         />

	     </ScrollView>
	}
	
}