import React, {Component} from 'react'
import {db, fireApp} from "../fire-config";
import * as firebase from "firebase";
import {USERS_COLLECTION} from "../utils";
import LoadingPage from "./loading_page";
import LoginPage from "./login";
import { Redirect, Route, withRouter, Switch } from 'react-router-dom'
import LandingPage from "./landing_page";
import NotFound from "./not_found";

const HOME = 'HOME'
const PROFILE = 'PROFILE'

class AppRouting extends Component {
  state = {
    isLoggedIn: false,
    isLoading: true,
    user: {},
  };

  componentDidMount() {
    fireApp.auth().onAuthStateChanged((user) => {
      if (user) {
        this.setState({
          isLoggedIn: true,
          isLoading: false,
          user
        })
      } else {
        this.setState({
          isLoading: false,
        })
      }
    })
  }

  createUsername = (displayName) => {
    return displayName.split(' ')[0] + Math.floor((Math.random() * 100000) + 1);
  };

  handleSignInButtonClick = e => {
    e.preventDefault()
    const googleProvider = new firebase.auth.GoogleAuthProvider()
    fireApp.auth().setPersistence(firebase.auth.Auth.Persistence.LOCAL).then(() => {
      fireApp.auth().signInWithPopup(googleProvider).then(result => {
        // This gives you a Google Access Token. You can use it to access the Google API.
        var token = result.credential.accessToken;
        // The signed-in user info.
        var user = result.user;
        this.setState({
          isLoggedIn: true,
          isLoading: false,
          user
        }, () => {
          this.props.history.push('/profile');
        });
        // insert user into DB if they don't already exist
        const docRef = db.collection(USERS_COLLECTION).doc(user.email)
        docRef.get().then((doc) => {
          if (!doc.exists) {
            // insert into user collection
            docRef.set({
              name: user.displayName,
              email: user.email,
              username: this.createUsername(user.displayName),
              placesBeen: [],
              placesToGo: [],
              countriesBeen: [],
              publicProfile: false,
            })
          }
        }).catch((error) => console.log("Error getting document:", error))
      }).catch(function(error) {
        const {code, message, email} = error
        console.log(`Error logging in with code ${code} for user ${email} with message ${message}`)
      });
    })
  };

  handleSignOutButtonClick = e => {
    e.preventDefault()
    fireApp.auth().signOut().then(() => {
      this.setState({
        isLoggedIn: false,
        user: {}
      }, () => {
        this.props.history.push('/');
      })
    }).catch(function(error) {
      console.log(error)
    });
  };

  renderRoute = (currentRoute) => {
    const {
      isLoggedIn,
      isLoading,
      user,
    } = this.state;

    if (isLoading) {
      return <LoadingPage />
    } else if (isLoggedIn && !!user) {
      if (currentRoute === HOME) {
        return (
          <Redirect to="/profile" />
        );
      } else if (currentRoute === PROFILE) {
        return (
          <LandingPage
            userObject={user}
            handleLogoutClick={e => this.handleSignOutButtonClick(e)}
          />
        );
      } else {
        return (
          <NotFound />
        );
      }
    } else {
      return (
        <LoginPage
          handleLoginClick={e => this.handleSignInButtonClick(e)}
        />
      )
    }
  };

  render() {
    return (
      <Switch>
        <Route path='/profile'>
          {this.renderRoute(PROFILE)}
        </Route>
        <Route exact path='/'>
          {this.renderRoute(HOME)}
        </Route>
        <Route component={NotFound}/>
      </Switch>
    )
  }
}

export default withRouter(AppRouting);