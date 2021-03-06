import React, { Component } from 'react';
import Navigation from './components/Navigation/Navigation';
import Logo from './components/Logo/Logo';
import Rank from './components/Rank/Rank';
import ImageLinkForm from './components/ImageLinkForm/ImageLinkForm';
import FaceRecognition from './components/FaceRecognition/FaceRecognition';
import Signin from './components/Signin/Signin';
import Register from './components/Register/Register';
import Particles from 'react-particles-js';
import './App.css';

//global constant to configure Particles Options.
const particlesOptions = {
  particles: {
    number: {
      value: 55,
      density: {
        enable: true,
        value_area: 800
      }
    }
  }
} //end particlesOptions constant

const initialState = { 
                      input: '',
                      imageUrl: '',
                      box: {},
                      route: 'signin',
                      isSignedIn: false,
                      user: {
                            id: '',
                            name: '',
                            email: '',
                            entries: 0,
                            joined: '',
                      }
} //end of initialState constant

//App Component
class App extends Component { //changed function App to class App
  constructor() {
    super();
    this.state = initialState;
  } //end constructor

  loadUser = (data) => {
    this.setState({
      user: {
              id: data.id,
              name: data.name,
              email: data.email,
              entries: data.entries,
              joined: data.joined
        }
    }) //end setState
  } //end loadUser

  //calculateFaceLocation
  calculateFaceLocation = (data) => {
    const clarifaiFace = data.outputs[0].data.regions[0].region_info.bounding_box;
    const image = document.getElementById('inputimage');
    const width = Number(image.width);
    const height = Number(image.height);
    return {
      leftCol: clarifaiFace.left_col * width,
      topRow:  clarifaiFace.top_row * height,
      rightCol: width - (clarifaiFace.right_col * width),
      bottomRow: height - (clarifaiFace.bottom_row * height)
    }
  } //end calculateFaceLocation

  //displayFaceBox
  displayFaceBox = (box) => {
    this.setState({box: box});
  } //displayFaceBox

  //onInputChange. Used for the input field in ImageLinkForm.
  onInputChange = (event) => {
    this.setState({input: event.target.value});
  } //end onInputChange

  //onButtonSubmit. Used for the "Detect" button being clicked.
  onButtonSubmit = () => {
    this.setState({imageUrl: this.state.input});
    fetch('https://stunning-redwood-68854.herokuapp.com/imageurl', {
            method: 'post',
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify({
              input: this.state.input
            })
          })
      .then(response => response.json())
      .then(response => {
        if (response) {
          fetch('https://stunning-redwood-68854.herokuapp.com/image', {
            method: 'put',
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify({
              id: this.state.user.id
            })
          })
          .then(response => response.json())
          .then(count => {
            this.setState(Object.assign(this.state.user, { entries: count}));
          })
          .catch(console.log)
        }
        this.displayFaceBox(this.calculateFaceLocation(response))
      })
      .catch(error => console.log(error));
  }// end onButtonSubmit

  //onRouteChange
  onRouteChange = (route) => {
    if (route === 'signout') {
      this.setState(initialState)
    } else if (route === 'home') {
      this.setState({isSignedIn: true})
    }
    this.setState({route: route});
  } //end onRouteChange

  //render
  render() {
    const { isSignedIn, imageUrl, route, box } = this.state;
    return (
      <div className="App">
        <Particles className='particles' 
                   params={particlesOptions} 
        />
        <Navigation isSignedIn={isSignedIn} 
                    onRouteChange={this.onRouteChange}/>
        { route === 'home'
          ? <div> 
              <Logo />
              <Rank 
                  name={this.state.user.name}
                  entries={this.state.user.entries}
              />
              <ImageLinkForm 
                  onInputChange={this.onInputChange}
                  onButtonSubmit={this.onButtonSubmit}
              />
              <FaceRecognition box={box} imageUrl={imageUrl}/>
            </div>
          : (
              route === 'signin'
              ? <Signin   
                      onRouteChange={this.onRouteChange}
                      loadUser={this.loadUser}
                />
              : (
                  route === 'register'
                  ? <Register 
                        onRouteChange={this.onRouteChange}
                        loadUser={this.loadUser}
                    />
                  : <Signin   onRouteChange={this.onRouteChange}
                              loadUser={this.loadUser}
                  />
              )
            )
        }
      </div>
    );
  }
} //end render

export default App;