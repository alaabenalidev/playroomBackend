# harrypotter_nodejs
Package utilizes @andyrewlee's harry potter api.</br>
Link to his project can be found [HERE](https://github.com/andyrewlee/harrypotterapi).

## Installation
```
  npm install harrypotter
```

## Usage

<b>Initialization</b>
```
  var hp = require('harrypotter');
  var client = new hp();
```

<b>Callback:</br></b>
This callback function requires two arguments, ```error``` and ```data```. If the request fails, the ```error``` will be an ```Error``` object. Otherwise, the ```data``` argument will contain the JSON that is returned by the API.

<b>Gets a list of movies:</b>
```
  client.getAllMovies(callback);
```

<b>Gets basic/detailed info for specified movie:</b>
```
  client.getMovieDetails(movieID, dispEmp, callback);
```
<b>Arguments:</b>
* ```movieID```: [string] ID of movie
* ```dispEmp```: [boolean] If true, ```getMovieDetails()``` provides detailed info pertaining to movie (i.e. employees of hogwarts).

<b>Gets a list of hogwart employees:</b>
```
  client.getEmployees(callback);
```

<b>Gets basic/detailed info for specified employee:</b>
```
  client.getEmployeeInfo(empID, dispDetailed, callback);
```
<b>Arguments:</b>
* ```empID```: [string] ID of employee
* ```dispDetailed```: [boolean] If true, ```getEmployeeInfo()``` provides detailed info pertaining to employee (i.e. all of the movies they appeared in) 

