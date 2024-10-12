// src/components/CompanyComponent.js

import { useAuth0 } from '@auth0/auth0-react'
import axios from 'axios'
import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'

import CompanyNameCard from '../components/Cards/CompanyNameCard'
import Search from '../components/Search'
import { API } from '../constants'
import { SkeletonCardLoader } from '../ui/JobPostingSkeleton'

interface JobSource {
  createdAt: string
  id: number
  name: string
  updatedAt: string
}
interface CompanyInfo {
  active: boolean
  apiEndpoint: string
  createdAt: string
  frontendUrl: string
  id: number
  jobSource: JobSource
  jobSourceId: number
  name: string
  slug: string
  updatedAt: string
}

function isAuth0Error(error: any): error is { error: string } {
  return error && typeof error.error === 'string'
}

const Home = () => {
  const [companyList, setCompanyList] = useState<CompanyInfo[]>([])
  const [isLoading, setIsLoading] = useState<boolean>(true)
  // const { data } = useAppSelector((state) => state.auth)
  // const dispatch = useAppDispatch()
  const navigate = useNavigate()
  const { getAccessTokenSilently, loginWithRedirect } = useAuth0()

  // const token = data?.token

  const handleCompanyClick = (company: any) => {
    navigate(`/jobs/${company.slug}`)
    console.log('COMPANY CLICKED', company)
  }

  useEffect(() => {
    console.log('Fetching company list...')
    setIsLoading(true)
    const fetchCompanyList = async () => {
      console.log('Fetching company list...part 2')
      try {
        const token = await getAccessTokenSilently({
          authorizationParams: {
            audience: import.meta.env.VITE_AUTH0_AUDIENCE,
            scope: 'openid profile email',
            prompt: 'consent',
          },
        })
        console.log('Token:', token)

        const { data } = await axios.get<CompanyInfo[]>(
          `${API.BASE_URL}${API.COMPANIES}`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        )
        console.log('Company list:', data)
        setCompanyList(data)
      } catch (error: unknown) {
        if (isAuth0Error(error)) {
          if (
            error.error === 'consent_required' ||
            error.error === 'login_required'
          ) {
            loginWithRedirect({
              authorizationParams: {
                audience: import.meta.env.VITE_AUTH0_AUDIENCE,
                scope: 'openid profile email',
              },
            })
          } else {
            console.error('Error fetching company list:', error)
          }
        } else {
          console.error('An unknown error occurred:', error)
        }
      }
    }
    fetchCompanyList()
    setIsLoading(false)
  }, [getAccessTokenSilently])

  const handleSearchSubmit = async (query: string) => {
    console.log('Searching for companies with query:', query)
    setIsLoading(true)
    try {
      const token = await getAccessTokenSilently({
        authorizationParams: {
          audience: import.meta.env.VITE_AUTH0_AUDIENCE,
          scope: 'openid profile email',
          prompt: 'consent',
        },
      })
      console.log('Token:', token)
      const { data } = await axios.get(
        `${API.BASE_URL}${API.COMPANIES}?name=${query}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      )
      setCompanyList(data)
    } catch (error) {
      console.error('Error searching for companies:', error)
    }
    setIsLoading(false)
  }

  return (
    <div className="flex w-full max-w-6xl flex-col items-center justify-start gap-4">
      <h2 className="text-lg font-bold">
        Welcome to the job board! Here you can find job listings for different
        companies.
      </h2>
      <Search onSubmitSearch={handleSearchSubmit} />
      <h3 className="text-center text-xl font-semibold">
        All Companies ({companyList?.length})
      </h3>

      <section className="h-[55dvh] w-full overflow-y-auto p-2 md:h-[65dvh] lg:h-[70dvh]">
        <div className="grid grid-cols-2 flex-wrap gap-4 sm:grid-cols-3 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5">
          {isLoading
            ? Array.from({ length: 10 }, (_, index) => (
                <SkeletonCardLoader key={index} />
              ))
            : companyList?.map((company, idx) => (
                <CompanyNameCard
                  key={idx}
                  company={company}
                  onClick={() => handleCompanyClick(company)}
                />
              ))}
        </div>
      </section>
    </div>
  )
}

export default Home
