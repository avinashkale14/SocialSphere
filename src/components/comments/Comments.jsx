import { useContext } from "react";
import "./comments.scss"
import {AuthContext} from "../../context/authContext"

const Comments = () => {

    const {currentUser} = useContext(AuthContext)

    //Temporary
    const comments = [
        {
            id: 1,
            name: "Avinash Kale",
            userId: 1,
            profilePic:
            "https://images.unsplash.com/photo-1773332611612-ffdaa753afb1?w=700&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDF8MHxmZWF0dXJlZC1waG90b3MtZmVlZHwxNXx8fGVufDB8fHx8fA%3D%3D",
            desc: "Lorem ipsum dolor sit amet consectetur adipisicing elit. ",
            img:"https://plus.unsplash.com/premium_photo-1778903613220-2092adb7af4c?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxmZWF0dXJlZC1waG90b3MtZmVlZHwxODZ8fHxlbnwwfHx8fHw%3D"
        },
        {
            id: 2,
            name: "Avinash Kale",
            userId: 2,
            profilePic:
            "https://images.unsplash.com/photo-1773332611612-ffdaa753afb1?w=700&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDF8MHxmZWF0dXJlZC1waG90b3MtZmVlZHwxNXx8fGVufDB8fHx8fA%3D%3D",
            desc: "Lorem ipsum dolor sit amet consectetur adipisicing elit. ",
        },
    ];
  return (
    <div className="comments">
        <div className="write">
            <img src={currentUser.profilePic} alt=""/>
            <input type="text" placeholder="write a comment" />
            <button>Send</button>
        </div>
        {comments.map((comment) => (
            <div className="comment">
                <img src={comment.profilePic} alt=""/>
                <div className="info">
                    <span>{comment.name}</span>
                    <p>{comment.desc}</p>
                </div>
                <span className="date">1 hour ago</span>
            </div>
        ))}
        </div>
  );
};

export default Comments;
