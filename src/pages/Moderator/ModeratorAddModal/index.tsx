import { useState } from 'react'
import { Button, Select } from 'antd'
import AddModal from '../../../components/AddModal'
const { Option } = Select

const ModeratorAddModal = ({ ...props }) => {
    const [users, setUsers] = useState<any[]>([])
    const [roles, setRoles] = useState<any[]>([])
    const [selectUser, setSelectUser] = useState<any>([])
    const [selectRole, setSelectRole] = useState<any>(['user', 'driver'])

    function onChangeUser(value: any) {
        console.log(`selected user ${value}`)
        setSelectUser(value)
    }

    function onChangeRole(value: any) {
        console.log(`selected role ${value}`)
        setSelectRole(value)
    }

    function onSearch(val: any) {
        console.log('search:', val)
    }

    const handleAddNewModerator = async (value: any) => {
        window.alert('Create new mod')
    }

    return (
        <AddModal {...props} width={600} title="Thêm quản trị viên" footer={<Button onClick={handleAddNewModerator}>Đăng ký</Button>}>
            <div className="moderator-add-container">
                <Select
                    showSearch
                    style={{ width: 200 }}
                    placeholder="Chọn người dùng"
                    optionFilterProp="children"
                    onChange={onChangeUser}
                    onSearch={onSearch}
                    filterOption={(input, option) => option?.children.toLowerCase().indexOf(input.toLowerCase()) >= 0}
                >
                    {users &&
                        users.map((user) => (
                            <Option value={user.name} key={user.id}>
                                {user.name}
                            </Option>
                        ))}
                </Select>

                <Select style={{ width: 200 }} placeholder="Chọn chức vụ" optionFilterProp="children" onChange={onChangeRole} onSearch={onSearch}>
                    {roles &&
                        roles.map((role) => (
                            <Option value={role.name} key={role.id}>
                                {role.name}
                            </Option>
                        ))}
                </Select>
            </div>
        </AddModal>
    )
}

export default ModeratorAddModal
