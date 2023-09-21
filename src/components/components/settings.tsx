import { Space } from 'antd'
import '../diary.scss'
import Exercises from './exercises'
import Timetable from "./timetable"
import DeleteResults from './deleteResults'

const Settings: React.FC = () => {
    

    return (<Space size="large">
        <Timetable />
        <Exercises />
        <DeleteResults />
    </Space>)
}

export default Settings