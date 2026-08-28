import { useContext } from "react";
import "./comments.scss";
import { AuthContext } from "../../context/authContext";

const Comments = () => {
  const { currentUser } = useContext(AuthContext);

  // TEMPORARY DATA
  const comments = [
    {
      id: 1,
      name: "Avinash Kale",
      userId: 1,
      profilePic:
        "https://images.unsplash.com/photo-1773332611612-ffdaa753afb1?w=700&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDF8MHxmZWF0dXJlZC1waG90b3MtZmVlZHwxNXx8fGVufDB8fHx8fA%3D%3D",
      desc: "Lorem ipsum dolor sit amet consectetur adipisicing elit.",
    },
    {
      id: 2,
      name: "Avinash Kale",
      userId: 2,
      profilePic:
        "https://images.unsplash.com/photo-1773332611612-ffdaa753afb1?w=700&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDF8MHxmZWF0dXJlZHwxNXx8fGVufDB8fHx8fA%3D%3D",
      desc: "Lorem ipsum dolor sit amet consectetur adipisicing elit.",
    },
  ];

  return (
    <div className="comments">

      {/* WRITE COMMENT */}
      <div className="write">
        <img
          src={currentUser.profilePic}
          alt={currentUser.name}
        />

        <input
          type="text"
          placeholder="Write a comment..."
        />

        <button type="button">
          Send
        </button>
      </div>


      {/* COMMENTS LIST */}
      {comments.map((comment) => (
        <div className="comment" key={comment.id}>

          <img
            src={comment.profilePic}
            alt={comment.name}
          />

          <div className="info">
            <span>{comment.name}</span>

            <p>{comment.desc}</p>

            <span className="mobile-date">
              1 hour ago
            </span>
          </div>

          <span className="date">
            1 hour ago
          </span>

        </div>
      ))}
    </div>
  );
};

export default Comments;