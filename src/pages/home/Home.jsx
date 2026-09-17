import "./home.scss";

import Stories from "../../components/stories/Stories";
import Share from "../../components/share/Share";
import Posts from "../../components/posts/Posts";

const Home = () => {
  return (
    <div className="home">
      <section id="stories-section">
        <Stories />
      </section>

      <section id="create-post">
        <Share />
      </section>

      <section>
        <Posts />
      </section>
    </div>
  );
};

export default Home;