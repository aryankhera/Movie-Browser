import React from 'react';
import { StyleSheet, Text, View,Image,FlatList,TouchableOpacity,TextInput, Button, ActivityIndicator } from 'react-native';
import {searchMovies} from './api';
import {createAppContainer} from 'react-navigation';
import {createStackNavigator} from 'react-navigation-stack';
import InfoScreen from './InfoScreen';

class HomeScreen extends React.Component{
  static navigationOptions={
    title:"Movie Browser",
    headerTintColor:"white",
    headerStyle:{
      backgroundColor:"teal"
    },
  };
  state={
    movies:[],
    search:"",
    isMounted:false,
    isLoading:false,
  }
  
  getMovies= async ()=>{
    try{
      this.setState(
        {
          movies:await searchMovies(this.state.search),
          error:false,
          isLoading:false
        }    
        )
      }
      catch(err){
        this.setState({
          error:true,
          isLoading:false
        })
      }
  }
  handleText=(text)=>{
    this.setState({
      search:text,
      isLoading:true
    })
  }
  componentDidMount(){
    this.setState({
      isMounted:true,
    })
  }
  componentDidUpdate(){
   if(this.state.isMounted)
    this.getMovies();
  
  }
  componentWillUnmount(){
    this.setState({
      isMounted:false
    })
  }

  render(){
    return (
      <View style={styles.container}>
        <Text style={styles.title}>Search</Text>
        <TextInput 
        placeholder="Enter a movie name"
        onChangeText={(text)=>this.handleText(text)}
        value={this.state.search}
        style={styles.input}
        />
        {this.state.isLoading && <ActivityIndicator size="large" color="teal" />}
        {this.state.error && <React.Fragment>
          <Text>Network Error</Text>
          <Button title="Retry" onPress={()=>{
            this.setState({error:false,
            })
            this.getMovies()
          }}/>
          </React.Fragment>}
      <FlatList
      data={this.state.movies}
      contentContainerStyle={styles.flatList}
      renderItem={({item:movie})=>{
        return(
          <View>
          <TouchableOpacity style={styles.tile} onPress={()=>this.props.navigation.navigate("info",{imdbID:movie["imdbID"],poster:movie["Poster"],title:movie["Title"]})}>

          <Image
        source={{uri:movie["Poster"]}}
        style={{width:75,height:100}}
        />
        <View style={styles.tileTextView}>
      <Text style={styles.tileText}>{movie["Title"]}</Text>
        </View>
        </TouchableOpacity>
      </View>
        );
      }}
      keyExtractor={(item)=>item["id"]}
      />
    </View>
  );
}
}

const AppNavigator=createAppContainer(
  createStackNavigator({
    home:HomeScreen,
    info:InfoScreen
  },
  {
    initialRouteName:"home"
  })
);

export default App=(props)=>{
  return(<AppNavigator/>);
}
const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
    display:"flex",
  },
  title:{
    fontSize:30,
    fontWeight:"bold",
    margin:15,
    alignSelf:"flex-start"
    
  },
  input:{
    width:"80%",
    borderColor:"teal",
    borderWidth:1,
    margin:15,
    padding:10,
    borderRadius:10
  },
  tile:{
    flexDirection:"row",
    width:"85%",
    padding:10,
    margin:10,
    justifyContent:"flex-start",
  },
  tileText:{
    flexWrap:"wrap",
    fontSize:14,
    
  },
  tileTextView:{
    flexShrink:1,
    justifyContent:"flex-start",
    padding:10,
    alignSelf:"center"    
  },
  flatList:{
    paddingBottom:80,
    justifyContent:"flex-start",
  }
});
