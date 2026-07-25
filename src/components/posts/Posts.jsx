import "./posts.scss"
import Post from "../post/Post";

const Posts = () => {

    //TEMPORARY
    const posts = [
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
    return <div className="posts">
        {posts.map(post=>(
            <Post post={post} key={post.id}/>
        ))}
    </div>;
};

export default Posts;