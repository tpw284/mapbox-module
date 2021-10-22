import { Route, Switch } from 'react-router'
import './App.css'
import { useAppSelector } from './app/store'
import Login from './components/Login'
import PrivateRoute from './components/PrivateRoute'
import Register from './components/Register'
import HomePage from './pages/HomePage/HomePage'
import MapPage from './pages/Map/Map'

function App() {
    const account = useAppSelector((state) => state.account)
    return (
        <div className="App">
            <Switch>
                <PrivateRoute path="/map">
                    <MapPage parentPath={'/'} />
                </PrivateRoute>
                <Route path="/login">
                    <Login />
                </Route>
                <Route path="/register">
                    <Register />
                </Route>
                <PrivateRoute path="/">
                    <HomePage parentPath={'/'} />
                </PrivateRoute>
            </Switch>
        </div>
    )
}

export default App
