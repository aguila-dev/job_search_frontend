// src/api/jobsAPI.js
import axios from 'axios'

import { wait } from '../utils/wait'

axios.defaults.withCredentials = true

const fetchJobs = async (
  companySlug: string,
  page: number = 1,
  searchQuery = ''
) => {
  try {
    const { data } = await axios.get(
      `http://localhost:8000/v1/api/jobs/company/${companySlug}?page=${page}&search=${searchQuery}`
    )

    if (!data) {
      throw new Error('Network response was not ok')
    }
    // await wait(1000);
    return data
  } catch (error) {
    console.error('Error fetching jobs:', error)
    return error
    // throw error;
  }
}

export const fetchTodayJobs = async (
  page: number = 1,
  searchQuery = '',
  companyId?: number
) => {
  try {
    const params: any = { page, search: searchQuery }
    if (companyId) {
      params.companyId = companyId
    }
    const { data } = await axios.get(
      `http://localhost:8000/v1/api/jobs/todays-jobs`,
      { params }
    )
    if (!data) {
      throw new Error('Network response was not ok')
    }

    return data
  } catch (error) {
    console.error('Error fetching today jobs:', error)
    return error
  }
}

export const fetchTodaysCompanies = async (): Promise<any> => {
  try {
    const { data } = await axios.get(
      'http://localhost:8000/v1/api/jobs/todays-jobs/companies'
    )
    if (!data) {
      throw new Error('Network response was not ok')
    }
    return data
  } catch (error) {
    console.error('Error fetching companies:', error)
    return error
  }
}

export default fetchJobs
