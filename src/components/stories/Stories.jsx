import "./stories.scss"
import { useContext } from "react";
import { AuthContext } from "../../context/authContext"

const Stories = () => {

    const {currentUser} = useContext(AuthContext)

    //  TEMPORARY
    const stories = [
        {
            id: 1,
            name: "Avinash Kale",
            img: "https://images.unsplash.com/photo-1779305608232-f95a8829a05e?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxmZWF0dXJlZC1waG90b3MtZmVlZHwxMDl8fHxlbnwwfHx8fHw%3D"
        },
        {
            id: 2,
            name: "Avinash Kale",
            img: "https://images.unsplash.com/photo-1773332598451-8a0a59941912?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDF8MHxmZWF0dXJlZC1waG90b3MtZmVlZHw4M3x8fGVufDB8fHx8fA%3D%3D"
        },
        {
            id: 3,
            name: "Avinash Kale",
            img: "https://images.unsplash.com/photo-1779126931870-7f30c215c2ae?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxmZWF0dXJlZC1waG90b3MtZmVlZHwxNHx8fGVufDB8fHx8fA%3D%3D"
        },
        {
            id: 4,
            name: "Avinash Kale",
            img: "https://images.unsplash.com/photo-1779372371052-b2b3f32154c6?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxmZWF0dXJlZC1waG90b3MtZmVlZHwxOHx8fGVufDB8fHx8fA%3D%3D"
        },
    ]

    return (
    <div className="stories">
        <div className="story">
                <img src={currentUser.profilePic} alt=""/>
                <span>{currentUser.name}</span>
                <button>+</button>
            </div>
        {stories.map(story=>(
            <div className="story" key={story.id}>
                <img src={story.img} alt=""/>
                <span>{story.name}</span>
            </div>
        ))}
    </div>
    )
}

export default Stories