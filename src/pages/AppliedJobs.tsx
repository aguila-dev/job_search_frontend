import { useEffect, useState } from 'react'

import Search from '../components/Search'
import JobRow from '../components/Table/JobRow'
import { updateJobProperty } from '../utils/updateJobProperty'

// JobTable Component
const JobTable: React.FC<JobTableProps> = ({
  jobs,
  handleAppliedDateChange,
  handleStatusChange,
  handleJobConsideration,
  handleAppliedDateSort,
  appliedDateSortOrder,
}) => (
  <table className="min-w-full border-collapse text-sm">
    <thead>
      <tr className="bg-[#f4f4f4] dark:bg-slate-700">
        <th className="border p-2">Company</th>
        <th className="border p-2">Job Title</th>
        <th className="border p-2">Location</th>
        <th className="border p-2">
          <span className="cursor-pointer" onClick={handleAppliedDateSort}>
            Applied Date {appliedDateSortOrder === 'desc' ? '↓' : '↑'}
          </span>
        </th>
        <th className="border p-2">Notes</th>
        <th className="border p-2">Status</th>
        <th className="border p-2">No Longer Considering</th>
      </tr>
    </thead>
    <tbody>
      {jobs.map((job, index) => (
        <JobRow
          key={job.id + index}
          job={job}
          handleAppliedDateChange={handleAppliedDateChange}
          handleStatusChange={handleStatusChange}
          handleJobConsideration={handleJobConsideration}
        />
      ))}
    </tbody>
  </table>
)

// Main Component
const AppliedJobsComponent: React.FC = () => {
  const [appliedJobs, setAppliedJobs] = useState<Job[]>([])
  const [sortOrder, setSortOrder] = useState<string>('')
  const [searchQuery, setSearchQuery] = useState<string>('')
  const [selectedTab, setSelectedTab] = useState<string>('tracking')
  const [appliedDateSortOrder, setAppliedDateSortOrder] = useState<
    'asc' | 'desc'
  >('desc')

  useEffect(() => {
    const allAppliedJobs = JSON.parse(
      localStorage.getItem('appliedJobs') || '{}'
    )
    const jobsList = Object.entries(allAppliedJobs).flatMap(
      ([companyName, companyJobs]: [string, any]) =>
        Object.values(companyJobs).map((job: any) => ({
          ...job,
          company: companyName,
        }))
    )
    setAppliedJobs(jobsList)
  }, [])

  const filteredJobs = appliedJobs.filter(
    (job) =>
      job?.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      job?.company.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (job?.location?.name &&
        job.location.name.toLowerCase().includes(searchQuery.toLowerCase()))
  )

  const sortedAndFilteredJobs = filteredJobs.sort((a, b) => {
    const dateA = new Date(a?.updated_at).getTime()
    const dateB = new Date(b?.updated_at).getTime()

    const appliedDateSortOrderMultiplier =
      appliedDateSortOrder === 'asc' ? 1 : -1

    if (sortOrder === 'newest') {
      return dateB - dateA
    } else if (sortOrder === 'oldest') {
      return dateA - dateB
    } else if (sortOrder === 'appliedDate') {
      if (a.appliedDate && b.appliedDate) {
        return (
          appliedDateSortOrderMultiplier *
          (new Date(a.appliedDate).getTime() -
            new Date(b.appliedDate).getTime())
        )
      } else if (a.appliedDate) {
        return -1
      } else if (b.appliedDate) {
        return 1
      }
    }
    return 0
  })

  const trackingJobs = sortedAndFilteredJobs.filter((job) => job.considering)
  const noLongerConsideringJobs = sortedAndFilteredJobs.filter(
    (job) => !job.considering
  )

  const handleAppliedDateChange = (
    company: string,
    jobId: number,
    newDate: string
  ) => {
    updateJobProperty(company, jobId, 'appliedDate', newDate)
    setAppliedJobs((prevJobs) =>
      prevJobs.map((job) =>
        job.company === company && job.id === jobId
          ? { ...job, appliedDate: newDate }
          : job
      )
    )
  }

  const handleStatusChange = (
    company: string,
    jobId: number,
    status: string
  ) => {
    updateJobProperty(company, jobId, 'status', status)
    setAppliedJobs((prevJobs) =>
      prevJobs.map((job) =>
        job.company === company && job.id === jobId ? { ...job, status } : job
      )
    )
  }

  const handleJobConsideration = (
    company: string,
    jobId: number,
    considering: boolean
  ) => {
    updateJobProperty(company, jobId, 'considering', considering)
    setAppliedJobs((prevJobs) =>
      prevJobs.map((job) =>
        job.company === company && job.id === jobId
          ? { ...job, considering }
          : job
      )
    )
  }

  const handleAppliedDateSort = () => {
    const newSortOrder = appliedDateSortOrder === 'desc' ? 'asc' : 'desc'
    setAppliedDateSortOrder(newSortOrder)
    setSortOrder('appliedDate')
  }

  return (
    <div className="container mx-auto rounded-lg bg-white p-4 shadow-md dark:bg-slate-600">
      <h2 className="mb-4 text-center text-2xl font-semibold">
        Applied Jobs {appliedJobs.length > 0 && `(${appliedJobs.length})`}
      </h2>
      <Search
        setSortOrder={setSortOrder}
        setSearchQuery={setSearchQuery}
        searchQuery={searchQuery}
      />
      <div className="tabs mb-4 flex justify-center">
        <button
          className={`tab rounded-t-lg px-4 py-2 ${
            selectedTab === 'tracking'
              ? 'border-b-2 border-transparent bg-white dark:bg-slate-400'
              : 'bg-slate-100 dark:bg-slate-700'
          }`}
          onClick={() => setSelectedTab('tracking')}
        >
          Job Tracking
        </button>
        <button
          className={`tab rounded-t-lg px-4 py-2 ${
            selectedTab === 'noLongerConsidering'
              ? 'border-b-2 border-transparent bg-white dark:bg-slate-400'
              : 'bg-slate-100 dark:bg-slate-700'
          }`}
          onClick={() => setSelectedTab('noLongerConsidering')}
        >
          No Longer Considering
        </button>
      </div>
      <div className="tab-content">
        {selectedTab === 'tracking' ? (
          <JobTable
            jobs={trackingJobs}
            handleAppliedDateChange={handleAppliedDateChange}
            handleStatusChange={handleStatusChange}
            handleJobConsideration={handleJobConsideration}
            handleAppliedDateSort={handleAppliedDateSort}
            appliedDateSortOrder={appliedDateSortOrder}
          />
        ) : (
          <JobTable
            jobs={noLongerConsideringJobs}
            handleAppliedDateChange={handleAppliedDateChange}
            handleStatusChange={handleStatusChange}
            handleJobConsideration={handleJobConsideration}
            handleAppliedDateSort={handleAppliedDateSort}
            appliedDateSortOrder={appliedDateSortOrder}
          />
        )}
      </div>
    </div>
  )
}

export default AppliedJobsComponent
