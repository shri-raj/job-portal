import JobList from "../components/JobList";

const Home = () => {
    return (
        <div className="container mx-auto p-4">
            <h1 className="text-2xl font-bold mb-4">Available Jobs</h1>
            <JobList />
        </div>
    );
};

export default Home;