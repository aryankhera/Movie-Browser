fetch = require('node-fetch');
const API_KEY='cca7f892';

//Get List of Movies
fetchMovies= async (search,page=1)=>{
    try{
    response= await fetch(`http://www.omdbapi.com/?apikey=${API_KEY}&page=${page}&s=${encodeURI(search)}`);
    result= await response.json();
    }
    catch(err){
        throw new Error();
    }
    return result;
}

export const searchMovies= async (search,page=1,maxpage=2)=>{
    let list=[]
    try{
    do{
        result=await fetchMovies(search,page++);
        list=list.concat(result["Search"])
    }
    while(result['Response']==="True"&&page<=maxpage)
}
    catch(err){
        throw new Error();
    }
    return list.filter((item)=>item!==undefined).map((movie,key)=>({id:key.toString(),...movie}));
}

//Get Description

export const fetchDescription= async (imdbID)=>{
    try{

        response= await fetch(`http://www.omdbapi.com/?apikey=${API_KEY}&i=${encodeURI(imdbID)}&plot=full`);
        result= await response.json();
    }
    catch(err){
        throw new Error();
    }
    return result;
}
