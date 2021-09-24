import "./App.css";
import { useState } from "react";
import { Route, Switch, useHistory, useLocation } from "react-router-dom";

import { Drawer } from "antd";
import Layout, { Content, Header } from "antd/lib/layout/layout";
import { Dehaze } from "@material-ui/icons";

import Dashboard from "./Dashboard";
import ProfileDashboard from "./ProfileDashboard";

import FieldCreate from "./FieldCreate";
import FieldPage from "./FieldPage";
import FieldList from "./FieldPage/FieldList";
import FieldCard from "./FieldPage/FieldCard";

import BoundingMap from "./BoundingMap/BoundingMap";
import RealtimeMap from "./RealtimeMap/RealtimeMap";
import TrackingMap from "./TrackingMap/TrackingMap";
import RecordMap from "./RecordMap";


function App() {
  const location = useLocation();
  const history = useHistory();

  const [isSideboardCollapse, setIsSideboardCollapse] = useState(false);
  const [isProfileCollapse, setIsProfileCollapse] = useState(false);
  const handleClickMenu = () => {
    setIsSideboardCollapse(!isSideboardCollapse);
  };

  const handleClickProfile = () => {
    setIsProfileCollapse(!isProfileCollapse);
  };

  const handleSelectMenuItem = (menu: any) => {
    history.push(menu.key);
    setIsSideboardCollapse(false);
  };

  return (
    <div className="App">
      <Layout style={{ maxHeight: "100vh" }}>
        <Drawer
          placement="left"
          closable={false}
          onClose={() => setIsSideboardCollapse(false)}
          visible={isSideboardCollapse}
          bodyStyle={{ padding: "0" }}
        >
          <Dashboard
            selectItem={location.pathname}
            handleSelectMenuItem={handleSelectMenuItem}
          />
        </Drawer>

        <Drawer
          placement="right"
          closable={false}
          onClose={() => setIsProfileCollapse(false)}
          visible={isProfileCollapse}
          bodyStyle={{ padding: "0" }}
        >
          <ProfileDashboard />
        </Drawer>
        <Header
          className="header"
          style={{ height: "70px", backgroundColor: "#00a26a" }}
        >
          <div className="float-start">
            <Dehaze onClick={handleClickMenu} style={{ color: "white" }} />
          </div>
          <div className="float-end">
            <img
              alt="no?"
              src="https://s3-ap-northeast-1.amazonaws.com/agri-info-design-public/icons/ic_person_black_48dp.png"
              className=""
              style={{ height: "40px" }}
              onClick={handleClickProfile}
            ></img>
          </div>
        </Header>
        <Content>
          <div>
            <Switch>
              <Route exact path="/field/create">
                <FieldCreate />
              </Route>

              <Route path="/bounding/:id" component={BoundingMap}>
                {/* <BoundingMap match={}/> */}
              </Route>

              <Route exact path="/field/list">
                <FieldPage>
                  {(props: any) => <FieldList data={props} />}
                </FieldPage>
              </Route>

              <Route exact path="/field/card">
                <FieldPage>
                  {(props: any) => <FieldCard data={props} />}
                </FieldPage>
              </Route>

              <Route exact path="/">
                <TrackingMap />
              </Route>
              <Route exact path="/realtime">
                <RealtimeMap />
              </Route>
              <Route exact path="/record"> 
                <RecordMap />
              </Route>

            </Switch>
          </div>
        </Content>
      </Layout>
    </div>
  );
}

export default App;
