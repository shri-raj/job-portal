import { useQuery } from "@tanstack/react-query";
import api from "../api";

interface Job {
    id: string;
    title: string;
    company: string;
    location: string;
}

const fetchJobs = async () => {
    const { data } = await api.get("/jobs");
    return data;
};

const JobList = () => {
    const { data, error, isLoading } = useQuery<Job[]>({
        queryKey: ["jobs"],
        queryFn: fetchJobs,
    });

    if (isLoading) return <div>Loading...</div>;
    if (error) return <div>An error occurred</div>;

    return (
        <div>
            {data?.map((job) => (
                <div key={job.id} className="border p-4 mb-4 rounded">
                    <h2 className="text-xl font-bold">{job.title}</h2>
                    <p>{job.company}</p>
                    <p>{job.location}</p>
                </div>
            ))}
        </div>
    );
};

export default JobList;