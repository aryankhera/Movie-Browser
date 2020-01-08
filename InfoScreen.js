import React from 'react';
import {View,Text,ScrollView,Image, ActivityIndicator,StyleSheet,Button,} from 'react-native';
import {fetchDescription} from './api'

export default class InfoScreen extends React.Component{
    state={
        description:{},
        isLoading:true
    }
    static navigationOptions=({navigation})=>{
        let title=navigation.getParam("title");
        return{
            title:title.length>25?"Details":title,
            headerTintColor:"white",
            headerStyle:{
              backgroundColor:"teal"
            }
        }
    };
    getDescription= async()=>{
        try{

            this.setState(
                {
                    description:await fetchDescription(this.props.navigation.getParam("imdbID")),
                    isLoading:false
                }); 
            }
            catch(err){
                this.setState({
                    error:true,
                })
            }
        }
        componentDidMount(){
     this.getDescription();   
    }
    render(){
        return(
            <View style={styles.root}>
            <ScrollView contentContainerStyle={styles.container}>
                {this.props.navigation.getParam('poster')!=="N/A" && <Image
                source={{uri:this.props.navigation.getParam('poster')}}
                style={{width:300,height:400,marginBottom:10}}
                />}
                {this.state.error && <React.Fragment>
                <Text>Network Error</Text>
                <Button title="Retry" onPress={()=>{
                    this.setState({
                        error:false,
                        isLoading:false
                    })
                    this.getDescription()
                }}/>
                </React.Fragment>}
                {this.state.isLoading?<ActivityIndicator size="large" color="teal"/>:(
                <React.Fragment>
                <Text style={styles.title}>{this.props.navigation.getParam('title')}</Text>
                 <Bold title="IMDB Rating:" style={{color:"#d4cdcd",alignSelf:"flex-start",marginLeft:15,marginTop:15}}/>  
                 <View style={{...styles.ratingIndicatorBack,...styles.ratingIndicator}}>
                 <View style={{...styles.ratingIndicatorFront,width:10*parseFloat(this.state.description["imdbRating"])+"%"}}>
                    <Text style={{color:"#d4cdcd",marginTop:15}}>
                    {this.state.description!=={} && this.state.description["imdbRating"]}{"\n"}
                     </Text>
                 </View>
                 </View>
                <Text style={styles.description}>
                    <Bold title="Type:" /> {this.state.description!=={} && this.state.description["Type"]}{"\n"}
                    <Bold title="Genre:" /> {this.state.description!=={} && this.state.description["Genre"]}{"\n"}
                    <Bold title="Cast:" />  {this.state.description!=={} && this.state.description["Actors"]}{"\n"}
                    <Bold title="Director:" />  {this.state.description!=={} && this.state.description["Director"]}{"\n"}
                    <Bold title="Plot:" />  {this.state.description!=={} && this.state.description["Plot"]}{"\n"}
                </Text>
                </React.Fragment>)}
            </ScrollView>
            </View>
        );
    }
}
const Bold=(props)=>{
    return(
        <Text style={{...props.style,fontWeight:"bold"}}>
            {props.title}
        </Text>
    );
}

const styles=StyleSheet.create({
    root:{
        display:"flex",
        flex:1,
        backgroundColor:"black"
    },
    container:{
        flexGrow:1,
        margin:10,
        alignItems:"center",
    },
    description:{
        fontSize:15,
        margin:15,
        alignSelf:"flex-start",
        color:"#d4cdcd",
        lineHeight:22
    },
    title:{
        fontSize:18,
        fontWeight:"bold",
        color:"#d4cdcd",
    },
    ratingIndicator:{
        alignSelf:"flex-start",
        flexDirection:"row",
        height:30,
        display:"flex",
    },

    ratingIndicatorBack:{
        width:"100%",
        backgroundColor:"#80a8a8",
        margin:15
    },
    ratingIndicatorFront:{
        alignItems:"center",
        justifyContent:"center",
        backgroundColor:"green",
    }

});