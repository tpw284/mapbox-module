import './index.scss'

import { useState } from 'react'
import { Route, Switch, useHistory } from 'react-router-dom'

import HomeDashboard from './HomeDashboard'
import ProjectList from '../Project/ProjectList'
import DeviceList from '../Devices/DevicesList'

import { Drawer, Layout } from 'antd'
import { Dehaze } from '@material-ui/icons'

import ProfileDashboard from '../../components/ProfileDashboard'
import FieldPage from '../../components/Map/FieldPage'
import FieldList from '../../components/Map/FieldPage/FieldList'
import FieldCard from '../../components/Map/FieldPage/FieldCard'
import BoundingMap from '../../components/Map/BoundingMap'
import RecordMap from '../../components/Map/RecordMap'
import ProjectSummaryModal from '../Project/ProjectSummaryModal'
import ProjectDetail from '../Project/ProjectDetail'
import UserDetail from '../User/UserDetail'
import DeviceDetail from '../Devices/DeviceInfo/DeviceDetail'
import DeviceTask from '../Devices/DeviceInfo/DeviceTask'
import UserList from '../User/UserList'
import UserEdit from '../User/UserEdit'
import ModeratorList from '../Moderator/ModeratorList'
import ModeratorEdit from '../Moderator/ModeratorEdit'
import ModeratorDetail from '../Moderator/ModeratorDetail'
import MachinesList from '../Machine/MachinesList'
import MachineInfo from '../Machine/MachineInfo'

const { Header, Content } = Layout

const HomePage = ({ parentPath }: any) => {
    const history = useHistory()

    const [isSideboardCollapse, setIsSideboardCollapse] = useState(false)
    const [isProfileCollapse, setIsProfileCollapse] = useState(false)
    const handleClickMenu = () => {
        setIsSideboardCollapse(!isSideboardCollapse)
    }

    const handleClickProfile = () => {
        setIsProfileCollapse(!isProfileCollapse)
    }

    const handleSelectMenuItem = (menu: any) => {
        history.push(menu.key)
        setIsSideboardCollapse(false)
    }

    return (
        <div>
            <Layout style={{ maxHeight: '100vh' }}>
                <Drawer
                    placement="left"
                    closable={false}
                    onClose={() => setIsSideboardCollapse(false)}
                    visible={isSideboardCollapse}
                    bodyStyle={{ padding: '0' }}
                >
                    <HomeDashboard selectItem={handleSelectMenuItem} />
                </Drawer>

                <Drawer
                    placement="right"
                    closable={false}
                    onClose={() => setIsProfileCollapse(false)}
                    visible={isProfileCollapse}
                    bodyStyle={{ padding: '0' }}
                >
                    <ProfileDashboard />
                </Drawer>
                <Header
                    className="header"
                    style={{ height: '70px', backgroundColor: '#00a26a' }}
                >
                    <div className="float-start">
                        <Dehaze
                            onClick={handleClickMenu}
                            style={{ color: 'white' }}
                        />
                    </div>
                    <div className="float-end">
                        <img
                            alt="no?"
                            src="https://s3-ap-northeast-1.amazonaws.com/agri-info-design-public/icons/ic_person_black_48dp.png"
                            className=""
                            style={{ height: '40px' }}
                            onClick={handleClickProfile}
                        ></img>
                    </div>
                </Header>
                <Content style={{padding: "20px"}}>
                    <Switch>
                        <Route path={`${parentPath}devices/list`}>
                            <DeviceList />
                        </Route>
                        <Route path={`${parentPath}devices/:id/tasks`}>
                            <DeviceTask />
                        </Route>
                        <Route path={`${parentPath}devices/:id`} render={({match}) => (
                            <DeviceDetail id={match.params.id}/>
                        )} />
                        <Route path={`${parentPath}devices-summary`}>
                            <DeviceDetail />
                        </Route>

                        <Route path={`${parentPath}machines/list`}>
                            <MachinesList />
                        </Route>
                        <Route path={`${parentPath}machines/:id`} render={({match}) => (
                            <MachineInfo id={match.params.id}/>
                        )} />

                        <Route path={`${parentPath}projects/list`}>
                            <ProjectList />
                        </Route>
                        <Route path={`${parentPath}projects/:id`} render={({match}) => (
                            <ProjectDetail id={match.params.id}/>
                        )} />
                        {/* <Route path={`${parentPath}projects-summary`}>
                            <ProjectSummary />
                        </Route> */}


                        <Route path={`${parentPath}users/list`}>
                            <UserList />
                        </Route>
                        <Route path={`${parentPath}users/edit/:id`} render={({match}) => (
                            <UserEdit id={match.params.id}/>
                        )} />
                        <Route path={`${parentPath}users/:id`} render={({match}) => (
                            <UserDetail id={match.params.id}/>
                        )} />
                        {/* <Route path={`${parentPath}users-summary`}>
                            <ProjectSummary />
                        </Route> */}


                        <Route path={`${parentPath}moderators/list`}>
                            <ModeratorList />
                        </Route>
                        <Route path={`${parentPath}moderators/edit/:id`} render={({match}) => (
                            <ModeratorEdit id={match.params.id}/>
                        )} />
                        <Route path={`${parentPath}moderators/:id`} render={({match}) => (
                            <ModeratorDetail id={match.params.id}/>
                        )}>
                        </Route>
                        {/* <Route path={`${parentPath}moderators-summary`}>
                            <ProjectSummary />
                        </Route> */}


                        <Route path={`${parentPath}fields/list`}>
                            <FieldPage>
                                {(props: any) => <FieldList data={props} />}
                            </FieldPage>
                        </Route>
                        <Route path={`${parentPath}fields/card`}>
                            <FieldPage>
                                {(props: any) => <FieldCard data={props} />}
                            </FieldPage>
                        </Route>
                        <Route
                            path={`${parentPath}fields/:id`}
                            render={({ match }) => <RecordMap match={match} />}
                        ></Route>
                    </Switch>
                </Content>
            </Layout>
        </div>
    )
}

export default HomePage
