import '../diary.scss'
const Loading: React.FC = () => {

    return(<div style={{
        width: "100%",
        height: "100%",
        display: "flex",
        justifyContent: "center", 
        alignItems: "center"
    }}>
        <div className="loading"/>
    </div>)
}
export default Loading