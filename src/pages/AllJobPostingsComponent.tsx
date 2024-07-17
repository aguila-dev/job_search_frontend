import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import { SingleJobPostingSkeletonRow } from "../ui/JobPostingSkeleton";
import fetchJobs, {
  fetchTodayJobs,
  fetchTodaysCompanies,
} from "../api/jobsAPI";
import SinglePostingRow from "../components/Table/SinglePostingRow";
import { LoadingSpinner } from "../ui";
import Search from "../components/Search";
import { JobSourceEnum } from "../constants";
import CompanyFilterComponent from "../components/Dropdown/CompanyFilterDropdown";
import SelectedJobModal from "../components/Modal/SelectedJobModal";

interface TodayCompany {
  id: number;
  name: string;
}
interface CompanyData {
  count: number;
  companies: TodayCompany[];
}
interface Props {
  isTodaysJobs?: boolean;
}

// Main component
const AllJobPostingsComponent = ({ isTodaysJobs = false }: Props) => {
  const { company } = useParams<{ company: string }>();
  const [jobs, setJobs] = useState<any[]>([]);
  const [data, setData] = useState<any>({});
  const [url, setUrl] = useState<string>("");
  const [searchQuery, setSearchQuery] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isError, setIsError] = useState(false);
  const [selectedJob, setSelectedJob] = useState<any | null>(null);
  const [totalPages, setTotalPages] = useState(1);
  const [currentPage, setCurrentPage] = useState(1);
  const [companies, setCompanies] = useState<CompanyData>({
    count: 0,
    companies: [],
  });
  const [todayCompanySelect, setTodayCompanySelect] = useState<string | null>(
    null
  );

  useEffect(() => {
    const getJobs = async () => {
      setIsLoading(true);
      setIsError(false);

      try {
        let jobsData;
        let companiesData = companies;
        if (isTodaysJobs) {
          jobsData = await fetchTodayJobs(
            currentPage,
            searchQuery,
            todayCompanySelect ? Number(todayCompanySelect) : undefined
          );
          if (companies.companies?.length === 0) {
            companiesData = await fetchTodaysCompanies();
            setCompanies(companiesData);
          }
        } else if (company && !isTodaysJobs) {
          jobsData = await fetchJobs(company, currentPage, searchQuery);
        }
        if (!jobsData) {
          setIsError(true);
          throw new Error("Network response errored out");
        }

        const jobs = jobsData.jobs;
        const totalNumPages = Math.ceil(jobsData.count / 20);
        setData(jobsData);
        setJobs(jobs);
        setTotalPages(totalNumPages);
      } catch (error) {
        console.error("Error fetching jobs:", error);
        setIsError(true);
      } finally {
        setIsLoading(false);
      }
    };

    getJobs();
  }, [company, isTodaysJobs, currentPage, searchQuery, todayCompanySelect]);

  useEffect(() => {
    if (selectedJob) {
      document.addEventListener("click", handleClickOutside);
    } else {
      document.removeEventListener("click", handleClickOutside);
    }
    return () => {
      document.removeEventListener("click", handleClickOutside);
    };
  }, [selectedJob]);

  function extractJobPath(url: string): string {
    const regex = /\/job\/(.*)/;
    const match = url.match(regex);
    return match ? match[1] : "";
  }

  const fetchJobDetails = async (job: any) => {
    const jobCompany = company || job.company.slug;
    if (
      jobCompany &&
      job.jobId &&
      job.jobSource.name === JobSourceEnum.GREENHOUSE
    ) {
      const response = await axios.get(
        `${job.company.apiEndpoint}/${job.jobId}`,
        { withCredentials: false }
      );

      setSelectedJob(response.data);
    } else if (
      jobCompany &&
      job.jobId &&
      job.jobSource.name === JobSourceEnum.WORKDAY
    ) {
      console.log("workday job to be implemented");
      // console.log('Job endpoint:', job.company.apiEndpoint);
      const jobPath = extractJobPath(job.absoluteUrl);
      console.log("Job path:", jobPath);
      const fullBackendUrl = `${job.company.apiEndpoint.replace(
        "/jobs",
        "/job"
      )}/${jobPath}`;

      const response = await axios.get(
        "http://localhost:8000/v1/api/jobs/workday/individualJob",
        { params: { fullBackendUrl } }
      );
      setSelectedJob(response.data);
      console.log("make api call to get job details from workday");
    } else {
      console.error(
        `No job details found for ${job.title} in ${company}...no ${{
          ...Object.values(JobSourceEnum),
        }}`
      );
    }
    setUrl(job.absoluteUrl);
  };

  const handleSearchSubmit = (query: string) => {
    setSearchQuery(query);
    setCurrentPage(1); // Reset to first page on new search
  };

  function handleClickOutside(e: MouseEvent) {
    if ((e.target as HTMLElement).classList.contains("overlay")) {
      setSelectedJob(null);
      setUrl("");
    }
  }
  const handlePaginatedPage = (direction: string) => {
    if (direction === "next") {
      if (currentPage < totalPages) {
        setCurrentPage(currentPage + 1);
      }
    } else {
      if (currentPage > 1) {
        setCurrentPage(currentPage - 1);
      }
    }
  };
  const handleCompanySelect = (selectedCompanyId: number) => {
    setTodayCompanySelect(
      selectedCompanyId ? selectedCompanyId.toString() : null
    );
  };
  console.log({ isLoading, isError });
  return (
    <div className="px-4 w-full">
      <h2 className="text-center font-semibold text-2xl flex justify-center items-center">
        Job Listings for{" "}
        {isTodaysJobs
          ? "Today "
          : jobs[0]?.company.name
          ? jobs[0]?.company.name
          : ""}{" "}
        <span className="inline-flex justify-center items-center">
          &#40;
          {jobs?.length ? (
            data?.count
          ) : isLoading ? (
            <LoadingSpinner height="6" width="6" />
          ) : isError ? (
            ""
          ) : (
            0
          )}
          &#41;
        </span>
      </h2>

      {isError ? (
        <div className="flex items-start justify-center pt-4">
          <div className="text-red-600 bg-white p-4 rounded-lg shadow-lg">
            Network error, sorry. Please try again later.
          </div>
        </div>
      ) : (
        <>
          <Search onSubmitSearch={handleSearchSubmit} />
          {isTodaysJobs && (
            <CompanyFilterComponent
              companies={companies}
              onCompanySelect={handleCompanySelect}
            />
          )}
        </>
      )}
      <div className="overflow-x-auto jobs-list-container">
        <table className="min-w-full mt-4 border-collapse text-xs sm:text-base">
          <thead>
            <tr className="bg-[#f4f4f4] dark:bg-slate-700">
              <th className="border p-2">Company</th>
              <th className="border p-2">Title</th>
              <th className="border p-2">Last Updated</th>
              <th className="border p-2">Location</th>
              <th className="border p-2">Job Link</th>
              <th className="border p-2">Applied</th>
            </tr>
          </thead>
          <tbody>
            {isLoading
              ? Array.from({ length: 12 }, (_, index) => (
                  <SingleJobPostingSkeletonRow key={index} cols={6} />
                ))
              : jobs.map((job: any, jobIndex: number) => (
                  <SinglePostingRow
                    key={jobIndex}
                    job={job}
                    onRowClick={() => fetchJobDetails(job)}
                  />
                ))}
          </tbody>
        </table>
      </div>
      {/* Pagination section for company postings */}
      <section className="flex flex-col justify-center items-center mt-4">
        <div>
          <button
            type="button"
            className="mx-2 px-4 py-2 bg-gray-200 text-gray-700 rounded disabled:opacity-50 disabled:cursor-not-allowed  disabled:hover:border-none"
            disabled={currentPage === 1}
            onClick={() => handlePaginatedPage("prev")}
          >
            Previous
          </button>
          <button
            type="button"
            className="mx-2 px-4 py-2 bg-gray-200 text-gray-700 rounded disabled:opacity-50 disabled:cursor-not-allowed"
            disabled={currentPage === totalPages}
            onClick={() => handlePaginatedPage("next")}
          >
            Next
          </button>
        </div>
        <div>
          {currentPage}/{totalPages}
        </div>
      </section>

      {selectedJob && (
        <SelectedJobModal
          selectedJob={selectedJob}
          setSelectedJob={setSelectedJob}
          url={url}
          setUrl={setUrl}
        />
      )}
    </div>
  );
};

export default AllJobPostingsComponent;
