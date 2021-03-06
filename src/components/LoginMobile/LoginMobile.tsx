import './index.css'
import imetLogo from '../../assets/imet-logo.png'

import { useHistory } from 'react-router'
import { Form, Button, message } from 'antd'

import { useAppDispatch } from '../../app/store'
import { updateToken } from '../../app/authSlice'
import { Link } from 'react-router-dom'

import loginLogo from '../../assets/imet-logo-mobile.png'
import { ENDPOINT_URL } from '../../app/config'

const LoginMobile = () => {
    const history = useHistory()

    const dispatch = useAppDispatch()

    const onFinish = (values: any) => {
        const query = {
            username: values.username,
            password: values.password,
        }
        fetch(ENDPOINT_URL + '/login/', {
            method: 'POST',
            body: JSON.stringify(query),
            headers: {
                'Content-Type': 'application/json',
            },
        })
            .then((res) => res.json())
            .then((data) => {
                const { token, id, role } = data
                const newQuery = {
                    pk: id,
                    action: 'read',
                }
                if (id === 1) {
                    message.success('Đăng nhập thành công')
                    dispatch(
                        updateToken({
                            accessToken: token,
                            id: id,
                            role: role,
                            avatar: '',
                            name: 'Mod',
                        })
                    )
                    history.push('/')
                } else
                    fetch(ENDPOINT_URL + '/user/', {
                        method: 'POST',
                        body: JSON.stringify(newQuery),
                        headers: {
                            'Content-Type': 'application/json',
                        },
                    })
                        .then((res) => res.json())
                        .then((data) => {
                            const { name } = data[0]
                            message.success('Đăng nhập thành công')
                            dispatch(
                                updateToken({
                                    accessToken: token,
                                    id: id,
                                    role: role,
                                    avatar: '',
                                    name: name,
                                })
                            )
                            history.push('/')
                        })
            })
            .catch((err) => console.log(err))
    }

    const onFinishFailed = (errorInfo: any) => {
        console.log('Failed:', errorInfo)
    }

    return (
        <div className="login-wrapper">

                <img src={loginLogo} alt="" className="login-logo" />
        
                <div className="login-title">LOG IN TO iMET</div>
                
                <Form
                    className="login-form"
                    name="basic"
                    layout="vertical"
                    labelCol={{ span: 16 }}
                    // wrapperCol={{ span: 16 }}
                    initialValues={{ remember: true }}
                    onFinish={onFinish}
                    onFinishFailed={onFinishFailed}
                    autoComplete="off"
                >
                    <Form.Item
                        name="username"
                        rules={[
                            {
                                required: true,
                                message: 'Please input your username!',
                            },
                        ]}
                    >
                        <input type="text" className="login-form-input input-username" placeholder="Username" />
                    </Form.Item>

                    <Form.Item
                        name="password"
                        rules={[
                            {
                                required: true,
                                message: 'Please input your password!',
                            },
                        ]}
                    >
                        <input type="password" className="login-form-input input-password" placeholder="Password" />
                    </Form.Item>

                    <Form.Item
                        className="login-form-forget-password"
                        name="remember"
                        valuePropName="checked"
                        wrapperCol={{ offset: 4, span: 16 }}
                    >
                        <Link to="/">Forget Password?</Link>
                    </Form.Item>

                    <Form.Item 
                        // wrapperCol={{ offset: 4, span: 16 }}
                    >
                        <Button className="login-form-button" type="primary" htmlType="submit">
                            LOG IN
                        </Button>
                    </Form.Item>
                </Form>
            </div>
    )
}

export default LoginMobile
