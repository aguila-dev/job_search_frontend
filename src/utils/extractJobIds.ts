export const extractWorkdayJobId = (job: JobData): string => {
  return job.bulletFields.length > 1
    ? job.bulletFields[1]
    : job.bulletFields[0];
};
export const extractGreenhouseJobId = (job: JobData): string => {
  return job.id.toString(); // Assuming ID is directly accessible and needs to be stringified
};
